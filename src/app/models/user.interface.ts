export interface IUser{
  id: number,
  name:string,
  cpf:string,
  email:string,
  phoneNumber:string,
  password:string,
  curriculumId:number
  vacancyId?:number
  type: 'user',
}
