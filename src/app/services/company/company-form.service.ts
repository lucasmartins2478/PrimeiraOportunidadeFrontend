import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ICompany } from '../../models/company.interface';

@Injectable({
  providedIn: 'root'
})
export class companyFormService {


  private apiUrl: string = `https://backend-production-ff1f.up.railway.app/companies`;

  private formData: any = {};

  users: ICompany[] = [];

  constructor(private http: HttpClient) {}

  getUsersData(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(this.apiUrl).pipe(
      catchError((error: any) => {
        console.error(`Erro ao buscar usuários: ${error}`);
        return throwError(error);
      })
    );
  }



  getUserData(id: number| undefined): Observable<ICompany> {
    const url = `${this.apiUrl}/${id}`; // Cria a URL com o ID do usuário
    return this.http.get<ICompany>(url).pipe(
      catchError((error: any) => {
        console.error(`Erro ao buscar o usuário com ID ${id}: ${error}`);
        return throwError(error);
      })
    );
  }


  setFormData(data: any) {
    this.formData = { ...this.formData, ...data };
  }

  getFormData() {
    return this.formData;
  }

  getCompanies(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(this.apiUrl);
  }
}
