import { useState, useEffect } from "react";

export interface DayProgress {
  dayId: string;
  dayName: string;
  completedAt: string | null;
  isLocked: boolean;
  scheduledDate: string;
  weekDay: string; // segunda, terca, etc.
}

interface TrainingProgress {
  days: DayProgress[];
  startDate: string;
  selectedDays: string[]; // dias selecionados pelo usuário
}

const STORAGE_KEY = "diego_training_progress";

// Mapa de dias da semana em português para o número do dia (0 = domingo)
const WEEKDAY_MAP: Record<string, number> = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};

const WEEKDAY_NAMES: Record<string, string> = {
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
  domingo: "Domingo",
};

// Encontra a próxima ocorrência de um dia da semana
function getNextWeekday(fromDate: Date, targetWeekday: number): Date {
  const result = new Date(fromDate);
  const currentDay = result.getDay();
  let daysToAdd = targetWeekday - currentDay;
  
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }
  
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

export const useTrainingProgress = () => {
  const [progress, setProgress] = useState<TrainingProgress | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (progress) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  const initializeProgress = (dayNames: string[], selectedDays?: string[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = today.toISOString().split("T")[0];
    
    // Ordenar dias selecionados pela ordem da semana (segunda primeiro)
    const orderedWeekDays = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
    const sortedSelectedDays = selectedDays 
      ? [...selectedDays].sort((a, b) => orderedWeekDays.indexOf(a) - orderedWeekDays.indexOf(b))
      : orderedWeekDays.slice(0, dayNames.length);
    
    const days: DayProgress[] = [];
    let currentDate = new Date(today);
    
    // Para cada treino, calcular a data correta baseada nos dias selecionados
    for (let i = 0; i < dayNames.length; i++) {
      const weekDayIndex = i % sortedSelectedDays.length;
      const weekDay = sortedSelectedDays[weekDayIndex];
      const targetWeekday = WEEKDAY_MAP[weekDay];
      
      let scheduledDate: Date;
      
      if (i === 0) {
        // Primeiro treino: encontrar o próximo dia válido (pode ser hoje)
        const todayWeekday = today.getDay();
        if (targetWeekday === todayWeekday) {
          scheduledDate = new Date(today);
        } else {
          scheduledDate = getNextWeekday(today, targetWeekday);
        }
      } else {
        // Próximos treinos: encontrar próxima ocorrência após o último agendado
        const lastScheduledDate = new Date(days[i - 1].scheduledDate);
        lastScheduledDate.setDate(lastScheduledDate.getDate() + 1);
        scheduledDate = getNextWeekday(lastScheduledDate, targetWeekday);
      }
      
      days.push({
        dayId: `day_${i}`,
        dayName: dayNames[i],
        completedAt: null,
        isLocked: i > 0, // Primeiro dia desbloqueado
        scheduledDate: scheduledDate.toISOString().split("T")[0],
        weekDay: weekDay,
      });
    }

    const newProgress: TrainingProgress = { 
      days, 
      startDate,
      selectedDays: sortedSelectedDays,
    };
    setProgress(newProgress);
    return newProgress;
  };

  const completeDay = (dayId: string) => {
    if (!progress) return;

    const now = new Date().toISOString();
    const dayIndex = progress.days.findIndex(d => d.dayId === dayId);
    
    if (dayIndex === -1) return;

    const updatedDays = progress.days.map((day, index) => {
      if (day.dayId === dayId) {
        return { ...day, completedAt: now };
      }
      // Unlock next day if it's the day after
      if (index === dayIndex + 1) {
        const today = new Date().toISOString().split("T")[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        
        // Check if the scheduled date is today or in the past
        const isUnlockable = day.scheduledDate <= tomorrowStr;
        return { ...day, isLocked: !isUnlockable };
      }
      return day;
    });

    setProgress({ ...progress, days: updatedDays });
  };

  const isDayUnlocked = (_dayId: string): boolean => {
    // Todos os dias ficam disponíveis para o usuário acessar livremente
    return true;
  };

  const isDayCompleted = (dayId: string): boolean => {
    if (!progress) return false;
    const day = progress.days.find(d => d.dayId === dayId);
    return day?.completedAt !== null;
  };

  const getProgress = () => progress;

  const getNextAvailableDay = (): DayProgress | null => {
    if (!progress) return null;
    
    const today = new Date().toISOString().split("T")[0];
    
    for (const day of progress.days) {
      // Find first day that's unlocked and not completed
      const dayIndex = progress.days.findIndex(d => d.dayId === day.dayId);
      
      if (dayIndex === 0) {
        if (!day.completedAt) return day;
        continue;
      }
      
      const previousDay = progress.days[dayIndex - 1];
      if (previousDay?.completedAt && !day.completedAt && day.scheduledDate <= today) {
        return day;
      }
    }
    
    return null;
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(null);
  };

  return {
    progress,
    initializeProgress,
    completeDay,
    isDayUnlocked,
    isDayCompleted,
    getProgress,
    getNextAvailableDay,
    resetProgress,
  };
};
