import { UserProfile, WorkoutDay, DailyMealPlan, RoutineTips, Exercise, Meal } from "@/types/diego";

export function generatePersonalizedPlan(profile: UserProfile): {
  workout: WorkoutDay[];
  meals: DailyMealPlan;
  routine: RoutineTips;
} {
  const workout = generateWorkoutPlan(profile);
  const meals = generateMealPlan(profile);
  const routine = generateRoutineTips(profile);

  return { workout, meals, routine };
}

function generateWorkoutPlan(profile: UserProfile): WorkoutDay[] {
  const isGym = profile.local === "academia";
  const days = parseInt(profile.diasSemana) || 3;
  const objetivo = profile.objetivo.toLowerCase();
  const isBegginer = profile.nivel === "iniciante";

  // Base workout templates
  const workoutDays: WorkoutDay[] = [];

  if (days >= 2) {
    workoutDays.push({
      dia: "Segunda-feira",
      grupoMuscular: "Peito e Tríceps",
      exercicios: isGym
        ? [
            createExercise(
              "Supino Reto na Máquina",
              "Máquina com banco e barras para empurrar",
              ["Deite no banco com os pés no chão", "Segure as barras na altura do peito", "Empurre para cima até esticar os braços", "Desça devagar controlando o peso"],
              isBegginer ? "3" : "4",
              "12",
              "60 seg",
              "Tirar os pés do chão ou arquear demais as costas",
              "Flexão de braço no chão"
            ),
            createExercise(
              "Crucifixo na Máquina",
              "Máquina com braços laterais para fechar",
              ["Sente com as costas apoiadas", "Segure as alavancas com os braços abertos", "Feche os braços à frente do peito", "Volte devagar à posição inicial"],
              "3",
              "12",
              "60 seg",
              "Usar peso demais e não completar o movimento",
              "Crucifixo com halteres leves"
            ),
            createExercise(
              "Tríceps na Polia",
              "Cabo com barra reta ou corda na polia alta",
              ["Fique de frente para a polia", "Segure a barra/corda na altura do peito", "Empurre para baixo até esticar os braços", "Volte controlando sem mover os cotovelos"],
              "3",
              "15",
              "45 seg",
              "Mover os cotovelos ou inclinar o corpo",
              "Tríceps francês com halter"
            ),
          ]
        : [
            createExercise(
              "Flexão de Braço",
              "No chão, pode usar joelhos como apoio",
              ["Mãos na largura dos ombros no chão", "Corpo reto da cabeça aos pés", "Desça até o peito quase tocar o chão", "Suba empurrando o chão"],
              "3",
              "10-12",
              "60 seg",
              "Deixar o quadril cair ou subir demais",
              "Flexão na parede se ainda for difícil"
            ),
            createExercise(
              "Tríceps no Banco",
              "Apoie as mãos em uma cadeira ou banco firme",
              ["Mãos apoiadas no banco atrás de você", "Pernas esticadas à frente", "Desça dobrando os cotovelos", "Suba esticando os braços"],
              "3",
              "12",
              "60 seg",
              "Descer demais ou muito rápido",
              "Dobre os joelhos para facilitar"
            ),
          ],
    });
  }

  if (days >= 3) {
    workoutDays.push({
      dia: "Quarta-feira",
      grupoMuscular: "Costas e Bíceps",
      exercicios: isGym
        ? [
            createExercise(
              "Puxada Frontal",
              "Máquina com barra larga conectada a cabo",
              ["Sente e trave os joelhos na almofada", "Segure a barra mais larga que os ombros", "Puxe até a barra chegar perto do peito", "Volte controlando o peso"],
              isBegginer ? "3" : "4",
              "12",
              "60 seg",
              "Puxar usando só os braços, sem ativar as costas",
              "Puxada com elástico"
            ),
            createExercise(
              "Remada Baixa",
              "Máquina com cabo e pegador triangular",
              ["Sente com os pés nos apoios", "Segure o pegador com braços esticados", "Puxe em direção ao abdômen", "Aperte as costas e volte devagar"],
              "3",
              "12",
              "60 seg",
              "Inclinar o tronco demais para trás",
              "Remada com halteres"
            ),
            createExercise(
              "Rosca Direta na Máquina",
              "Máquina com apoio para os braços",
              ["Sente com os braços no apoio", "Segure as alças", "Dobre os cotovelos trazendo as mãos", "Desça controlando o movimento"],
              "3",
              "12",
              "60 seg",
              "Balançar o corpo para subir o peso",
              "Rosca com halteres em pé"
            ),
          ]
        : [
            createExercise(
              "Remada com Elástico",
              "Elástico preso em uma porta ou poste",
              ["Segure as pontas do elástico", "Braços esticados à frente", "Puxe em direção ao corpo", "Aperte as costas e volte devagar"],
              "3",
              "15",
              "60 seg",
              "Não apertar as costas no final",
              "Use um elástico mais leve"
            ),
            createExercise(
              "Rosca com Garrafas",
              "Use garrafas de 1.5L ou 2L com água",
              ["Em pé, braços ao lado do corpo", "Segure uma garrafa em cada mão", "Dobre os cotovelos subindo as garrafas", "Desça devagar"],
              "3",
              "15",
              "45 seg",
              "Balançar o corpo",
              "Pode fazer um braço por vez"
            ),
          ],
    });
  }

  if (days >= 3) {
    workoutDays.push({
      dia: "Sexta-feira",
      grupoMuscular: "Pernas e Ombros",
      exercicios: isGym
        ? [
            createExercise(
              "Leg Press",
              "Máquina inclinada com plataforma para empurrar",
              ["Sente e apoie os pés na plataforma", "Destrave e desça flexionando os joelhos", "Não deixe os joelhos passarem dos pés", "Empurre a plataforma subindo"],
              isBegginer ? "3" : "4",
              "12",
              "90 seg",
              "Tirar o quadril do banco ou travar os joelhos",
              "Agachamento livre"
            ),
            createExercise(
              "Cadeira Extensora",
              "Máquina sentada para estender as pernas",
              ["Sente e ajuste a almofada nos tornozelos", "Segure nas barras laterais", "Estique as pernas até a horizontal", "Desça controlando o peso"],
              "3",
              "12",
              "60 seg",
              "Fazer muito rápido ou com impulso",
              "Extensão de perna em pé com caneleira"
            ),
            createExercise(
              "Desenvolvimento na Máquina",
              "Máquina de ombros com barras para empurrar",
              ["Sente com as costas apoiadas", "Segure as barras na altura dos ombros", "Empurre para cima até quase esticar", "Desça controlando"],
              "3",
              "12",
              "60 seg",
              "Arquear as costas ou subir peso demais",
              "Elevação lateral com halteres leves"
            ),
          ]
        : [
            createExercise(
              "Agachamento Livre",
              "Sem equipamento, apenas peso do corpo",
              ["Pés na largura dos ombros", "Desça como se fosse sentar numa cadeira", "Joelhos apontando para fora", "Suba apertando as pernas"],
              "3",
              "15",
              "60 seg",
              "Joelhos para dentro ou inclinar demais",
              "Agachamento na parede (costas apoiadas)"
            ),
            createExercise(
              "Afundo",
              "Dê um passo à frente e desça",
              ["Passo largo para frente", "Desça até o joelho de trás quase tocar o chão", "Mantenha o tronco reto", "Volte empurrando o chão"],
              "3",
              "10 cada perna",
              "60 seg",
              "Joelho da frente passar da ponta do pé",
              "Segure em uma parede para equilíbrio"
            ),
            createExercise(
              "Elevação Lateral com Garrafas",
              "Use garrafas como peso",
              ["Braços ao lado do corpo com garrafas", "Levante os braços lateralmente", "Pare na altura dos ombros", "Desça devagar"],
              "3",
              "12",
              "45 seg",
              "Subir acima dos ombros ou usar impulso",
              "Faça sem peso primeiro"
            ),
          ],
    });
  }

  // Add extra days if needed
  if (days >= 4) {
    workoutDays.push({
      dia: "Terça-feira",
      grupoMuscular: "Abdômen e Cardio",
      exercicios: [
        createExercise(
          "Prancha",
          "No chão, posição de flexão",
          ["Apoie antebraços e pontas dos pés", "Corpo reto como uma tábua", "Aperte o abdômen", "Mantenha a posição"],
          "3",
          "30 segundos",
          "30 seg",
          "Deixar o quadril cair ou subir",
          "Prancha com joelhos apoiados"
        ),
        createExercise(
          "Abdominal Curto",
          "Deitado no chão de barriga para cima",
          ["Joelhos dobrados, pés no chão", "Mãos atrás da cabeça", "Suba só as escápulas do chão", "Desça devagar"],
          "3",
          "15",
          "45 seg",
          "Puxar o pescoço ou subir demais",
          "Abdominal com pés elevados"
        ),
      ],
    });
  }

  if (days >= 5) {
    workoutDays.push({
      dia: "Quinta-feira",
      grupoMuscular: "Glúteos e Posterior",
      exercicios: isGym
        ? [
            createExercise(
              "Cadeira Flexora",
              "Máquina deitada para dobrar as pernas",
              ["Deite de bruços na máquina", "Ajuste a almofada nos calcanhares", "Dobre as pernas em direção ao glúteo", "Desça controlando"],
              "3",
              "12",
              "60 seg",
              "Levantar o quadril do banco",
              "Flexão de perna em pé com caneleira"
            ),
            createExercise(
              "Stiff",
              "Barra ou halteres, em pé",
              ["Pés na largura do quadril", "Segure o peso à frente das coxas", "Desça inclinando o tronco, pernas levemente dobradas", "Sinta alongar a posterior e volte"],
              "3",
              "12",
              "60 seg",
              "Arredondar as costas",
              "Stiff com halteres leves"
            ),
          ]
        : [
            createExercise(
              "Elevação de Quadril",
              "Deitado no chão de barriga para cima",
              ["Joelhos dobrados, pés no chão", "Empurre o quadril para cima", "Aperte o glúteo no topo", "Desça devagar sem encostar"],
              "3",
              "15",
              "45 seg",
              "Usar as costas em vez do glúteo",
              "Mantenha mais tempo no topo"
            ),
            createExercise(
              "Quatro Apoios",
              "De quatro no chão",
              ["Mãos embaixo dos ombros, joelhos embaixo do quadril", "Estenda uma perna para trás", "Aperte o glúteo no topo", "Desça e repita"],
              "3",
              "12 cada perna",
              "60 seg",
              "Arquear as costas",
              "Mantenha o movimento pequeno e controlado"
            ),
          ],
    });
  }

  return workoutDays;
}

function createExercise(
  nome: string,
  maquina: string,
  execucao: string[],
  series: string,
  repeticoes: string,
  descanso: string,
  erroComum: string,
  alternativa: string
): Exercise {
  return {
    nome,
    maquina,
    execucao,
    series,
    repeticoes,
    descanso,
    erroComum,
    alternativa,
  };
}

function generateMealPlan(profile: UserProfile): DailyMealPlan {
  const objetivo = profile.objetivo.toLowerCase();
  const peso = parseInt(profile.peso) || 70;

  const isEmagrecimento = objetivo.includes("perder") || objetivo.includes("emagrec");
  const isGanho = objetivo.includes("ganhar") || objetivo.includes("massa");

  return {
    cafeDaManha: createMeal(
      "Café da Manhã",
      "7h - 8h",
      isEmagrecimento
        ? ["2 ovos mexidos", "1 fatia de pão integral", "1 fruta (banana ou maçã)", "Café sem açúcar"]
        : ["3 ovos mexidos", "2 fatias de pão integral com pasta de amendoim", "1 banana", "1 copo de leite ou vitamina"],
      ["Omelete com queijo branco", "Tapioca com ovo", "Iogurte natural com granola"],
      "Proteína + carboidrato no café dá energia pro dia todo e mantém a saciedade"
    ),
    almoco: createMeal(
      "Almoço",
      "12h - 13h",
      isEmagrecimento
        ? ["Salada verde à vontade", "100g de frango grelhado ou peixe", "3 colheres de arroz integral", "2 colheres de feijão", "Legumes refogados"]
        : ["Salada variada", "150g de carne vermelha ou frango", "4-5 colheres de arroz", "Feijão ou lentilha", "Batata doce ou mandioca"],
      ["Patinho moído", "Atum", "Ovo cozido como proteína"],
      "Almoço é a principal refeição. Proteína ajuda a construir músculo, carboidrato dá energia"
    ),
    jantar: createMeal(
      "Jantar",
      "19h - 20h",
      isEmagrecimento
        ? ["Sopa de legumes com frango desfiado", "ou Omelete com salada", "Chá sem açúcar"]
        : ["Similar ao almoço, pode reduzir um pouco o carboidrato", "Proteína é importante antes de dormir"],
      ["Frango grelhado com legumes", "Peixe assado com salada", "Wrap integral com atum"],
      "Jantar mais leve, mas ainda com proteína pra recuperação muscular durante o sono"
    ),
    lanches: [
      createMeal(
        "Lanche da Manhã",
        "10h",
        isEmagrecimento
          ? ["1 fruta", "5 castanhas ou nozes"]
          : ["1 banana com pasta de amendoim", "Mix de oleaginosas"],
        ["Iogurte natural", "Barrinha de proteína caseira"],
        "Lanche leve pra manter o metabolismo ativo"
      ),
      createMeal(
        "Lanche da Tarde",
        "16h",
        isEmagrecimento
          ? ["Iogurte natural", "ou 1 fatia de queijo branco com tomate"]
          : ["Vitamina de banana com aveia", "ou Sanduíche natural de frango"],
        ["Frutas com iogurte", "Ovo cozido"],
        "Importante não ficar muito tempo sem comer, evita beliscar besteiras"
      ),
    ],
  };
}

function createMeal(
  nome: string,
  horario: string,
  alimentos: string[],
  substituicoes: string[],
  porque: string
): Meal {
  return {
    nome,
    horario,
    alimentos,
    substituicoes,
    porque,
  };
}

function generateRoutineTips(profile: UserProfile): RoutineTips {
  const peso = parseInt(profile.peso) || 70;
  const aguaLitros = Math.round((peso * 35) / 1000 * 10) / 10; // 35ml por kg

  return {
    horarioTreino: "Manhã (6h-9h) ou fim da tarde (17h-19h)",
    agua: `${aguaLitros}L por dia`,
    sono: "7-8 horas por noite",
    frequencia: `${profile.diasSemana}x por semana, sem faltar`,
    dicasMotivacao: [
      "Separe a roupa de treino na noite anterior",
      "Vá mesmo nos dias que não estiver com vontade - só ir já é vitória",
      "Tire fotos de progresso a cada 2 semanas",
      "Foque no processo, não só no resultado",
      "Comemore pequenas vitórias (peso aumentou, fez todas as séries...)",
      "Encontre um parceiro de treino se possível",
    ],
  };
}
