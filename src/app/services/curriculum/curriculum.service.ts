import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  IAcademicData,
  ICompetences,
  ICoursesData,
  ICurriculum,
} from '../../models/curriculum.interface';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  constructor(private http: HttpClient) {}

  getCurriculumData(id: number | undefined): Observable<ICurriculum> {
    const apiUrl = `http://localhost:3333/curriculum/${id}`;
    return this.http.get<ICurriculum>(apiUrl).pipe(
      catchError((error: any) => {
        console.error(`Erro ao buscar currículo ${error}`);
        return throwError(error);
      })
    );
  }

  getAcademicData(id: number | undefined): Observable<IAcademicData[]> {
    const apiUrl = `http://localhost:3333/academicData/${id}`;
    return this.http.get<IAcademicData[]>(apiUrl).pipe(
      catchError((error: any) => {
        console.error(`Erro ao buscar dados acadêmicos ${error}`);
        return throwError(error);
      })
    );
  }

  getCoursesData(id: number | undefined): Observable<ICoursesData[]> {
    const apiUrl = `http://localhost:3333/coursesData/${id}`;
    return this.http.get<ICoursesData[]>(apiUrl).pipe(
      catchError((error: any) => {
        console.error(`Erro ao buscar cursos ${error}`);
        return throwError(error);
      })
    );
  }

  getCompetences(id: number | undefined): Observable<ICompetences[]> {
    const apiUrl = `http://localhost:3333/competences/${id}`;
    return this.http.get<ICompetences[]>(apiUrl).pipe(
      catchError((error: any) => {
        console.error(`Erro ao buscar competências ${error}`);
        return throwError(error);
      })
    );
  }
  deleteCurriculum(id: number | undefined): Observable<ICurriculum> {
    const apiUrl = `http://localhost:3333/userdata/${id}/${id}`;

    return this.http.delete<ICurriculum>(apiUrl).pipe(
      catchError((error: any) => {
        console.error(`Erro ao deletar curriculo ${error}`);
        return throwError(error);
      })
    );
  }
}
