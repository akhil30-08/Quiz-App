export interface IOption {
  id: number | string;
  name: string;
}

export interface IValue {
  value: string | number;
}

export interface IQuestion {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}
