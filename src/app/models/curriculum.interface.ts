export interface ICurriculum {
  id: number;
  name: string;
  dateOfBirth: string;
  age: number;
  phoneNumber: string;
  gender: string;
  race: string;
  email: string;
  city: string;
  uf: string;
  address: string;
  addressNumber: number;
  cep: string;
  description?: string;
  academicData?: IAcademicData[];
  coursesData?: ICoursesData[];
  competences?: ICompetences[];
}

export interface IAcademicData {
  name: string;
  semester: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  institutionName: string;
  degree: string;
  city: string;
}

export interface ICoursesData {
  name: string;
  modality: string;
  duration: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  institutionName: string;
}

export interface ICompetences {
  name: string;
}
