export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Question {
  id: string;
  categoryId: CategoryId;
  question: string;
  explanation?: string;
  difficulty: Difficulty;
}

export interface AnswerRecord {
  question: Question;
  answer: string;
  status: "correct" | "incorrect" | "unanswered";
  elapsedSeconds: number;
  correctAnswer?: string;
  explanation?: string;
}
