export interface IJob {
  id: number;
  title: string;
  modality: string;
  locality: string;
  uf: string;
  contact: string;
  salary: string;
  level: string;
  description: string;
  requirements: string;
  aboutCompany: string;
  benefits: string;
  companyId: number;
  companyName: string;
  isActive: boolean;
  isFilled: boolean;
}

export interface IQuestion {
  id: number;
  question: string;
  vacancyId: number;
}
export interface IAnswer {
  id: number;
  answer: string;
  questionId: number;
  userId: number;
}

export interface IQuestionWithAnswer {
  question: IQuestion;
  answer?: IAnswer; // Opcional caso não tenha resposta
}
