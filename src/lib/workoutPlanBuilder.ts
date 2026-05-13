import { UserProfile } from "@/types/diego";
import { ParsedWorkoutDay } from "./parseWorkoutPlan";

const ORDERED_WEEKDAYS = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

const DAY_LABELS: Record<string, string> = {
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
  domingo: "Domingo",
};

const DIVISIONS_BY_COUNT: Record<number, string[]> = {
  1: ["Full Body"],
  2: ["Superior", "Inferior"],
  3: ["Push", "Pull", "Pernas"],
  4: ["Peito e Tríceps", "Costas e Bíceps", "Pernas", "Ombros e Core"],
  5: ["Peito", "Costas", "Pernas", "Ombros", "Braços e Core"],
  6: ["Push", "Pull", "Pernas", "Push", "Pull", "Pernas"],
  7: ["Peito e Tríceps", "Costas e Bíceps", "Pernas", "Ombros e Core", "Full Body", "Posterior e Glúteos", "Mobilidade e Cardio"],
};

type ExerciseTemplate = ParsedWorkoutDay["exercises"][number];

const gymExercises: Record<string, ExerciseTemplate[]> = {
  "Peito e Tríceps": [
    exercise("Supino reto na máquina", "Máquina de supino", ["Ajuste o banco para as pegadas ficarem na linha do peito", "Apoie os pés no chão e mantenha as costas firmes", "Empurre até quase estender os cotovelos", "Desça controlando até voltar à linha do peito"], "3x12", "60 segundos", "Arquear demais a lombar", "Flexão de braços"),
    exercise("Crucifixo na máquina", "Peck deck", ["Sente com o peito aberto e costas apoiadas", "Segure as alças com cotovelos levemente dobrados", "Feche os braços até aproximar as mãos", "Volte devagar sentindo alongar o peitoral"], "3x12", "60 segundos", "Usar impulso e perder a postura", "Crucifixo com halteres leves"),
    exercise("Tríceps na polia", "Polia alta com corda", ["Fique de frente para a polia", "Prenda os cotovelos ao lado do corpo", "Empurre a corda para baixo até estender os braços", "Volte devagar sem deixar os cotovelos subirem"], "3x12", "45 segundos", "Balançar o tronco para ajudar", "Tríceps francês com halter"),
    exercise("Tríceps testa guiado", "Banco + barra ou halteres", ["Deite no banco segurando a carga acima do peito", "Mantenha os cotovelos apontados para cima", "Desça a carga em direção à testa com controle", "Suba estendendo os braços sem abrir os cotovelos"], "3x10", "60 segundos", "Abrir os cotovelos para os lados", "Tríceps banco"),
  ],
  "Costas e Bíceps": [
    exercise("Puxada frontal", "Polia alta", ["Sente e trave as coxas no apoio", "Segure a barra um pouco mais aberta que os ombros", "Puxe em direção à parte alta do peito", "Suba controlando até alongar as costas"], "3x12", "60 segundos", "Puxar só com os braços", "Puxada com elástico"),
    exercise("Remada baixa", "Cabo com pegador", ["Sente com coluna neutra e pés apoiados", "Comece com braços estendidos", "Puxe o pegador em direção ao abdômen", "Aperte as escápulas e volte devagar"], "3x12", "60 segundos", "Jogar o tronco para trás", "Remada unilateral com halter"),
    exercise("Rosca direta", "Barra ou máquina", ["Fique em pé com abdômen firme", "Segure a barra com palmas para cima", "Suba dobrando os cotovelos sem balançar", "Desça até quase estender os braços"], "3x12", "45 segundos", "Usar o balanço do corpo", "Rosca com halteres"),
    exercise("Rosca martelo", "Halteres", ["Segure os halteres com palmas viradas uma para a outra", "Mantenha ombros relaxados", "Suba alternando ou junto até contrair o bíceps", "Desça devagar mantendo o punho firme"], "3x12", "45 segundos", "Dobrar o punho durante o movimento", "Rosca com elástico"),
  ],
  Pernas: [
    exercise("Leg press", "Máquina leg press", ["Sente com lombar apoiada", "Coloque os pés na largura dos ombros", "Desça até dobrar bem os joelhos sem tirar o quadril", "Empurre a plataforma sem travar os joelhos"], "3x12", "90 segundos", "Tirar o quadril do banco", "Agachamento livre"),
    exercise("Cadeira extensora", "Máquina extensora", ["Ajuste a almofada acima dos pés", "Segure os apoios laterais", "Estenda os joelhos até contrair a frente da coxa", "Desça controlando todo o peso"], "3x12", "60 segundos", "Chutar a carga rápido demais", "Extensão com caneleira"),
    exercise("Mesa flexora", "Máquina flexora", ["Deite com joelhos alinhados ao eixo da máquina", "Prenda a almofada nos calcanhares", "Dobre os joelhos levando os pés ao glúteo", "Volte devagar sem bater a carga"], "3x12", "60 segundos", "Levantar o quadril", "Flexão de pernas em pé"),
    exercise("Panturrilha em pé", "Máquina ou step", ["Apoie a ponta dos pés", "Mantenha joelhos levemente destravados", "Suba ficando na ponta dos pés", "Desça devagar até alongar a panturrilha"], "3x15", "45 segundos", "Fazer o movimento curto", "Panturrilha no degrau"),
  ],
  "Ombros e Core": [
    exercise("Desenvolvimento na máquina", "Máquina de ombros", ["Sente com as costas apoiadas", "Segure as alças na linha dos ombros", "Empurre para cima sem travar os cotovelos", "Desça controlando até a posição inicial"], "3x12", "60 segundos", "Arquear a lombar", "Desenvolvimento com halteres leves"),
    exercise("Elevação lateral", "Halteres", ["Fique em pé com halteres ao lado do corpo", "Mantenha cotovelos levemente dobrados", "Eleve os braços até a linha dos ombros", "Desça devagar sem relaxar tudo"], "3x12", "45 segundos", "Subir acima dos ombros com impulso", "Elevação lateral sem carga"),
    exercise("Face pull", "Polia com corda", ["Ajuste a polia na altura do rosto", "Puxe a corda em direção à testa", "Abra os cotovelos para fora", "Volte controlando sem perder a postura"], "3x12", "45 segundos", "Puxar para baixo em vez do rosto", "Remada alta leve"),
    exercise("Prancha", "Colchonete", ["Apoie antebraços e pontas dos pés", "Mantenha corpo alinhado da cabeça ao calcanhar", "Contraia abdômen e glúteos", "Respire sem deixar o quadril cair"], "3x30 segundos", "30 segundos", "Deixar o quadril afundar", "Prancha com joelhos apoiados"),
  ],
  "Full Body": [
    exercise("Agachamento no smith", "Smith machine", ["Posicione a barra no alto das costas", "Pés na largura dos ombros", "Desça como se fosse sentar", "Suba empurrando o chão e mantendo joelhos alinhados"], "3x12", "75 segundos", "Joelhos caírem para dentro", "Agachamento livre"),
    exercise("Supino reto na máquina", "Máquina de supino", ["Apoie bem as costas", "Segure as alças na linha do peito", "Empurre para frente com controle", "Volte devagar sem bater a carga"], "3x12", "60 segundos", "Subir os ombros", "Flexão inclinada"),
    exercise("Puxada frontal", "Polia alta", ["Segure a barra aberta", "Puxe para o peito com costas ativas", "Mantenha peito aberto", "Volte controlando até alongar"], "3x12", "60 segundos", "Inclinar demais para trás", "Remada com elástico"),
    exercise("Abdominal na máquina", "Máquina abdominal", ["Ajuste o assento", "Trave os pés", "Flexione o tronco usando o abdômen", "Volte devagar sem relaxar totalmente"], "3x15", "45 segundos", "Puxar com braços ou pescoço", "Abdominal curto no solo"),
  ],
  "Posterior e Glúteos": [
    exercise("Stiff com halteres", "Par de halteres", ["Segure os halteres à frente das coxas", "Mantenha joelhos levemente flexionados", "Incline o tronco jogando o quadril para trás", "Volte contraindo posterior e glúteos"], "3x12", "60 segundos", "Arredondar as costas", "Bom dia sem carga"),
    exercise("Elevação pélvica", "Banco + barra ou máquina", ["Apoie a parte alta das costas no banco", "Pés firmes no chão", "Suba o quadril contraindo os glúteos", "Desça controlando sem perder alinhamento"], "3x12", "60 segundos", "Hiperestender a lombar", "Ponte de glúteos no chão"),
    exercise("Cadeira flexora", "Máquina flexora sentada", ["Ajuste o encosto e a almofada", "Dobre os joelhos puxando a carga para baixo", "Segure um segundo na contração", "Volte devagar"], "3x12", "60 segundos", "Soltar a carga rápido", "Flexão com bola"),
    exercise("Abdução de quadril", "Máquina abdutora", ["Sente com costas apoiadas", "Ajuste as almofadas na lateral das pernas", "Abra as pernas controlando o movimento", "Feche devagar sem bater a carga"], "3x15", "45 segundos", "Inclinar o tronco para roubar", "Abdução deitado de lado"),
  ],
};

const homeExercises: Record<string, ExerciseTemplate[]> = {
  "Peito e Tríceps": [
    exercise("Flexão inclinada", "Banco, sofá ou parede", ["Apoie as mãos numa superfície firme", "Mantenha o corpo alinhado", "Desça o peito em direção ao apoio", "Suba empurrando sem perder a postura"], "3x10", "60 segundos", "Deixar o quadril cair", "Flexão na parede"),
    exercise("Flexão com joelhos", "Colchonete", ["Apoie mãos e joelhos no chão", "Alinhe ombros, quadril e joelhos", "Desça o peito com controle", "Suba empurrando o chão"], "3x10", "60 segundos", "Abrir demais os cotovelos", "Flexão na parede"),
    exercise("Tríceps no banco", "Cadeira firme", ["Apoie as mãos na borda da cadeira", "Mantenha quadril perto do apoio", "Desça dobrando os cotovelos", "Suba estendendo os braços"], "3x12", "45 segundos", "Descer rápido demais", "Tríceps sentado com garrafa"),
    exercise("Prancha com toque no ombro", "Colchonete", ["Fique em posição de prancha alta", "Afaste os pés para estabilidade", "Toque um ombro com a mão oposta", "Alterne os lados sem girar o quadril"], "3x20 toques", "45 segundos", "Balançar muito o quadril", "Prancha alta parada"),
  ],
  "Costas e Bíceps": [
    exercise("Remada com mochila", "Mochila com peso", ["Segure a mochila com uma ou duas mãos", "Incline o tronco com coluna neutra", "Puxe a carga em direção ao abdômen", "Desça controlando até estender os braços"], "3x12", "60 segundos", "Arredondar as costas", "Remada com elástico"),
    exercise("Superman", "Colchonete", ["Deite de barriga para baixo", "Estenda braços à frente", "Eleve braços e pernas ao mesmo tempo", "Segure um segundo e desça devagar"], "3x12", "45 segundos", "Levantar rápido sem controle", "Elevação só de braços"),
    exercise("Rosca com garrafas", "Duas garrafas cheias", ["Segure uma garrafa em cada mão", "Cole os cotovelos ao lado do corpo", "Suba dobrando os cotovelos", "Desça devagar até quase estender"], "3x12", "45 segundos", "Balançar o tronco", "Rosca alternada"),
    exercise("Remada isométrica com toalha", "Toalha firme", ["Sente com pernas estendidas", "Passe a toalha nos pés", "Puxe a toalha como se remasse", "Segure a contração das costas por alguns segundos"], "3x20 segundos", "45 segundos", "Curvar a coluna", "Remada com mochila"),
  ],
  Pernas: [
    exercise("Agachamento livre", "Peso corporal", ["Pés na largura dos ombros", "Jogue o quadril para trás", "Desça mantendo joelhos alinhados", "Suba apertando pernas e glúteos"], "3x15", "60 segundos", "Joelhos entrarem para dentro", "Agachamento na cadeira"),
    exercise("Afundo alternado", "Peso corporal", ["Dê um passo grande à frente", "Desça até formar dois ângulos de 90 graus", "Empurre o chão para voltar", "Alterne as pernas com controle"], "3x10 cada perna", "60 segundos", "Passo curto demais", "Afundo segurando na parede"),
    exercise("Elevação de quadril", "Colchonete", ["Deite com joelhos dobrados", "Apoie os pés no chão", "Suba o quadril apertando glúteos", "Desça devagar sem relaxar completamente"], "3x15", "45 segundos", "Usar a lombar em vez do glúteo", "Ponte curta"),
    exercise("Panturrilha no degrau", "Degrau ou chão", ["Apoie a ponta dos pés", "Suba ficando na ponta dos pés", "Segure um segundo no topo", "Desça devagar até alongar"], "3x18", "30 segundos", "Fazer rápido e curto", "Panturrilha no chão"),
  ],
  "Ombros e Core": [
    exercise("Desenvolvimento com garrafas", "Duas garrafas cheias", ["Segure as garrafas na altura dos ombros", "Mantenha abdômen firme", "Empurre acima da cabeça", "Desça devagar até os ombros"], "3x12", "60 segundos", "Arquear a lombar", "Elevação frontal leve"),
    exercise("Elevação lateral com garrafas", "Duas garrafas", ["Braços ao lado do corpo", "Cotovelos levemente dobrados", "Eleve até a linha dos ombros", "Desça controlando"], "3x12", "45 segundos", "Subir com impulso", "Elevação sem peso"),
    exercise("Prancha", "Colchonete", ["Apoie antebraços e pontas dos pés", "Alinhe cabeça, tronco e pernas", "Contraia abdômen", "Respire mantendo firmeza"], "3x30 segundos", "30 segundos", "Quadril cair", "Prancha com joelhos"),
    exercise("Abdominal curto", "Colchonete", ["Deite com joelhos dobrados", "Mãos leves atrás da cabeça", "Suba só os ombros do chão", "Desça controlando sem puxar o pescoço"], "3x15", "30 segundos", "Puxar o pescoço", "Abdominal com mãos no peito"),
  ],
  "Full Body": [
    exercise("Agachamento na cadeira", "Cadeira firme", ["Fique em pé à frente da cadeira", "Desça até encostar levemente", "Mantenha joelhos alinhados", "Suba empurrando o chão"], "3x12", "60 segundos", "Sentar e relaxar totalmente", "Agachamento livre"),
    exercise("Flexão inclinada", "Banco, sofá ou parede", ["Apoie as mãos numa superfície firme", "Corpo alinhado", "Desça com controle", "Suba empurrando a superfície"], "3x10", "60 segundos", "Quadril cair", "Flexão na parede"),
    exercise("Remada com mochila", "Mochila com peso", ["Incline o tronco com coluna neutra", "Segure a mochila", "Puxe para o abdômen", "Volte devagar"], "3x12", "60 segundos", "Arredondar as costas", "Remada com toalha"),
    exercise("Prancha", "Colchonete", ["Apoie antebraços e pés", "Contraia abdômen e glúteos", "Mantenha o corpo reto", "Respire durante todo o tempo"], "3x30 segundos", "30 segundos", "Segurar o ar", "Prancha com joelhos"),
  ],
  "Posterior e Glúteos": [
    exercise("Stiff com mochila", "Mochila com peso", ["Segure a mochila à frente do corpo", "Leve o quadril para trás", "Desça com coluna neutra e joelhos semi-flexionados", "Suba contraindo posterior e glúteos"], "3x12", "60 segundos", "Arredondar as costas", "Bom dia sem carga"),
    exercise("Elevação de quadril unilateral", "Colchonete", ["Deite com um pé no chão", "Estenda a outra perna", "Suba o quadril contraindo o glúteo", "Desça devagar e troque o lado"], "3x10 cada perna", "45 segundos", "Girar o quadril", "Elevação de quadril com dois pés"),
    exercise("Mesa flexora no pano", "Pano no chão liso", ["Deite de barriga para cima com calcanhares no pano", "Suba o quadril", "Puxe os calcanhares em direção ao corpo", "Estenda devagar mantendo controle"], "3x10", "60 segundos", "Deixar o quadril cair", "Ponte de glúteos"),
    exercise("Abdução deitado", "Colchonete", ["Deite de lado", "Mantenha pernas alinhadas", "Eleve a perna de cima sem girar o quadril", "Desça devagar e repita"], "3x15 cada lado", "30 segundos", "Virar o tronco para trás", "Abdução em pé"),
  ],
};

function exercise(name: string, equipment: string, steps: string[], sets: string, rest: string, commonError: string, alternative: string): ExerciseTemplate {
  return { name, equipment, steps, sets, reps: sets, rest, commonError, alternative };
}

function normalizeDivision(division: string): string {
  if (division === "Superior") return "Peito e Tríceps";
  if (division === "Inferior") return "Pernas";
  if (division === "Push") return "Peito e Tríceps";
  if (division === "Pull") return "Costas e Bíceps";
  if (division === "Peito") return "Peito e Tríceps";
  if (division === "Costas") return "Costas e Bíceps";
  if (division === "Ombros") return "Ombros e Core";
  if (division === "Braços e Core") return "Ombros e Core";
  if (division === "Mobilidade e Cardio") return "Full Body";
  return division;
}

function objectiveFor(division: string, profile: UserProfile): string {
  const goal = profile.objetivo.toLowerCase();
  const base = goal.includes("emag") || goal.includes("perder") ? "queima de gordura com técnica" : goal.includes("massa") || goal.includes("ganhar") ? "hipertrofia segura" : "força, postura e condicionamento";
  return `${division} — ${base}`;
}

export function buildReliableWorkoutPlan(profile: UserProfile): ParsedWorkoutDay[] {
  const selectedDays = (profile.diasEspecificos.length ? profile.diasEspecificos : ORDERED_WEEKDAYS.slice(0, Number(profile.diasSemana) || 3))
    .filter((day) => ORDERED_WEEKDAYS.includes(day))
    .sort((a, b) => ORDERED_WEEKDAYS.indexOf(a) - ORDERED_WEEKDAYS.indexOf(b));

  const count = Math.min(Math.max(selectedDays.length || 3, 1), 7);
  const divisions = DIVISIONS_BY_COUNT[count] || DIVISIONS_BY_COUNT[3];
  const source = profile.local === "casa" ? homeExercises : gymExercises;

  return selectedDays.map((dayCode, index) => {
    const division = divisions[index] || divisions[index % divisions.length];
    const templateKey = normalizeDivision(division);
    const exercises = source[templateKey] || source["Full Body"];

    return {
      dayName: DAY_LABELS[dayCode],
      muscleGroup: objectiveFor(division, profile),
      exercises,
    };
  });
}