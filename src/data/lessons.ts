import type { MicroLesson } from '../types';

export const lessons: MicroLesson[] = [
  {
    id: 'co-je-obvod',
    subjectId: 'zaklady',
    topicId: 'stejnosmerny-proud',
    title: 'Co je elektrický obvod?',
    year: 1,
    durationMinutes: 7,
    difficulty: 'základní',
    goal:
      'Žák vysvětlí, že elektrický obvod musí být uzavřená cesta pro elektrický proud a pozná základní části jednoduchého obvodu.',
    hook: 'Žárovka je připojená ke zdroji, ale nesvítí. Co může být špatně?',
    explanation:
      'Elektrický proud může procházet jen uzavřeným obvodem. Základní obvod obsahuje zdroj, vodiče, spotřebič a často vypínač. Když je obvod přerušený — například otevřeným vypínačem nebo přerušeným vodičem — proud neteče a spotřebič nepracuje.',
    safetyNote:
      'Tato lekce je školní simulace. Ve skutečné elektrické instalaci se nesmí pracovat pod napětím bez odborného dohledu a dodržení bezpečnostních pravidel.',
    memorySentence: 'Elektrický proud teče jen tehdy, když má uzavřenou cestu.',
    typicalMistake:
      'Žáci často zapomínají, že obvod musí být uzavřený — stačí jedno přerušení a proud neteče.',
    activity: {
      circuitOrder: {
        type: 'circuit-order',
        instruction:
          'Klikni na prvky ve správném pořadí, jak proud prochází uzavřeným obvodem od zdroje zpět ke zdroji.',
        elements: [
          { id: 'zdroj', label: 'Zdroj' },
          { id: 'vodic1', label: 'Vodič (ze zdroje)' },
          { id: 'vypinac', label: 'Vypínač (zavřený)' },
          { id: 'spotrebic', label: 'Spotřebič' },
          { id: 'vodic2', label: 'Vodič (zpět ke zdroji)' },
          { id: 'uzavreny', label: 'Uzavřený obvod' },
        ],
        correctOrder: ['zdroj', 'vodic1', 'vypinac', 'spotrebic', 'vodic2', 'uzavreny'],
        xpReward: 15,
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Kdy může elektrickým obvodem téct proud?',
        options: [
          { id: 'a', text: 'Když je obvod uzavřený.' },
          { id: 'b', text: 'Když je vypínač rozpojený.' },
          { id: 'c', text: 'Když chybí zdroj.' },
          { id: 'd', text: 'Když je spotřebič odpojený.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Proud teče jen uzavřeným obvodem — musí existovat nepřerušená cesta od zdroje zpět ke zdroji.',
      },
      {
        id: 'q2',
        text: 'Co se stane, když je vypínač rozpojený?',
        options: [
          { id: 'a', text: 'Proud teče silněji.' },
          { id: 'b', text: 'Obvod je přerušený a proud neteče.' },
          { id: 'c', text: 'Zdroj se vybije okamžitě.' },
          { id: 'd', text: 'Spotřebič svítí jasněji.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Rozpojený vypínač přeruší obvod — proud nemá uzavřenou cestu a neteče.',
      },
      {
        id: 'q3',
        text: 'Která část dodává obvodu elektrickou energii?',
        options: [
          { id: 'a', text: 'Vypínač' },
          { id: 'b', text: 'Vodič' },
          { id: 'c', text: 'Zdroj' },
          { id: 'd', text: 'Spotřebič' },
        ],
        correctOptionId: 'c',
        explanation:
          'Zdroj (baterie, generátor, síť) dodává obvodu elektrickou energii.',
      },
    ],
    activityXp: 15,
    quizXp: 15,
    badgeId: 'prvni-zapojeni',
    mvpAvailable: true,
  },
];

export function getLessonById(id: string): MicroLesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getLessonsByTopic(topicId: string): MicroLesson[] {
  return lessons.filter((l) => l.topicId === topicId);
}
