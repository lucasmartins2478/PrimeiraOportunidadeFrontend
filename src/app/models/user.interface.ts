export interface IUser{
  id: number,
  name:string,
  email:string,
  cpf:string,
  phoneNumber:string,
  password:string,
  idCurriculo?:number
  type: 'user',
}
