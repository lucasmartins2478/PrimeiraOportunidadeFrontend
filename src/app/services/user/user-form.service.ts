import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../models/user.interface';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserFormService {
  private apiUrl: string = `http://localhost:3333/users`;

  private formData: any = {};

  users: IUser[] = [];

  constructor(private http: HttpClient) {}

  getUsersData(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl).pipe(
      catchError((error: any) => {
        console.error(`Erro ao buscar usuários: ${error}`);
        return throwError(error);
      })
    );
  }

  getUserData(id: number | undefined): Observable<IUser> {
    const url = `${this.apiUrl}/${id}`; // Cria a URL com o ID do usuário
    return this.http.get<IUser>(url).pipe(
      catchError((error: any) => {
        console.error(`Erro ao buscar o usuário com ID ${id}: ${error}`);
        return throwError(error);
      })
    );
  }
  deleteUserData(id: number | undefined): Observable<IUser> {
    const apiUrl = `http://localhost:3333/users/${id}`;
    return this.http.delete<IUser>(apiUrl).pipe(
      catchError((error: any) => {
        console.error(`Erro ao delerar usuário ${error}`);
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
}
