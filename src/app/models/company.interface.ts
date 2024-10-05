export interface ICompany{
  id:number,
  name:string,
  responsible:string,
  cnpj:string,
  segment:string,
  email:string,
  phoneNumber:string,
  password:string,
  url?:string,
  address:string,
  city:string,
  cep:number,
  addressNumber:number,
  uf:string,
  type: 'company';
}
