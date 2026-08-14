import { Question } from "@/components/game/types";

export const normalizeAnswer = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,!?]/g, "");

export function answersMatch(answer: string, question: Question) {
  const response = normalizeAnswer(answer);
  const accepted = [question.answer, ...(question.acceptedAnswers ?? [])].map(normalizeAnswer);
  if (accepted.includes(response)) return true;
  const numericAnswer = Number(response.replace(/[$,%]/g, ""));
  return Number.isFinite(numericAnswer) && accepted.some((item) => Number.isFinite(Number(item)) && Number(item) === numericAnswer);
}

export function chooseQuestions(source: Question[], count: number) {
  return [...source].sort(() => Math.random() - 0.5).slice(0, count);
}
