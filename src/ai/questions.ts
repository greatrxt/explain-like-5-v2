export type Question = {
  title: string;
  label: string;
  full: string;
};

export const suggestedQuestions: Question[] = [
  {
    title: "What's beyond the edge of the",
    label: "universe?",
    full: "What's beyond the edge of the universe?",
  },
  {
    title: "Why can't we time travel to the",
    label: "past?",
    full: "Why can't we time travel to the past?",
  },
  {
    title: "If you dug a hole through Earth and",
    label: "jumped in?",
    full: "If you dug a hole through the Earth and jumped in, where would you come out?",
  },
  {
    title: "How does Google know what I'm going to",
    label: "search for?",
    full: "How does Google know what I'm going to search for before I finish typing?",
  },
  {
    title: "Can you actually weigh a",
    label: "cloud?",
    full: "Can you weigh a cloud? How heavy is it?",
  },
  {
    title: "Why don't birds get electrocuted on",
    label: "power lines?",
    full: "Why don't birds get electrocuted on power lines?",
  },
  {
    title: "What really happens when you hit",
    label: "delete?",
    full: "What happens when you hit delete on a file? Is it really gone?",
  },
  {
    title: "Why does ice cream give you a",
    label: "brain freeze?",
    full: "Why does ice cream give you a brain freeze?",
  },
  {
    title: "Why can't we tickle",
    label: "ourselves?",
    full: "Why can't we tickle ourselves?",
  },
  {
    title: "How do planes actually stay in",
    label: "the air?",
    full: "How do planes actually stay in the air?",
  },
  {
    title: "What would happen if the Moon",
    label: "disappeared?",
    full: "What would happen if the Moon suddenly disappeared?",
  },
  {
    title: "Why is the sky blue but sunsets are",
    label: "red?",
    full: "Why is the sky blue during the day but red during sunsets?",
  },
];

export function getRandomQuestions(count: number = 2) {
  const shuffled = [...suggestedQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
