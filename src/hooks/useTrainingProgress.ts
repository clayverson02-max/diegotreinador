import { useState, useEffect } from "react";

export interface DayProgress {
  dayId: string;
  dayName: string;
  completedAt: string | null;
  isLocked: boolean;
  scheduledDate: string;
}

interface TrainingProgress {
  days: DayProgress[];
  startDate: string;
}

const STORAGE_KEY = "diego_training_progress";

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

  const initializeProgress = (dayNames: string[]) => {
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    
    const days: DayProgress[] = dayNames.map((dayName, index) => {
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + index);
      
      return {
        dayId: `day_${index}`,
        dayName,
        completedAt: null,
        isLocked: index > 0, // First day unlocked, rest locked
        scheduledDate: scheduledDate.toISOString().split("T")[0],
      };
    });

    const newProgress: TrainingProgress = { days, startDate };
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

  const isDayUnlocked = (dayId: string): boolean => {
    if (!progress) return false;
    
    const day = progress.days.find(d => d.dayId === dayId);
    if (!day) return false;
    
    // First day is always unlocked
    if (day.dayId === "day_0") return true;
    
    // Check if the scheduled date has arrived
    const today = new Date().toISOString().split("T")[0];
    const dayIndex = progress.days.findIndex(d => d.dayId === dayId);
    const previousDay = progress.days[dayIndex - 1];
    
    // Day is unlocked if previous day is completed AND scheduled date has arrived
    return previousDay?.completedAt !== null && day.scheduledDate <= today;
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
