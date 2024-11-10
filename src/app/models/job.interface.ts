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
}

export interface IQuestion{
  id: number
  question: string
  vacancyId: number
}
