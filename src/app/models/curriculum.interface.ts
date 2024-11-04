export interface ICurriculum {
  id: number;
  dateOfBirth: string;
  age: number;
  gender: string;
  race: string;
  city: string;
  uf: string;
  address: string;
  addressNumber: number;
  cep: string;
  schoolName: string;
  schoolYear: string;
  schoolCity: string;
  schoolStartDate: string;
  schoolEndDate?: string;
  currentlyStudying: boolean;
  description?: string;
  academicData?: IAcademicData[];
  coursesData?: ICoursesData[];
  competences?: ICompetences[];
}

export interface IAcademicData {
  id:number
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
  id:number
  name: string;
  modality: string;
  duration: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  institutionName: string;
}

export interface ICompetences {
  id:number
  name: string;
}
