import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICompany } from '../../models/company.interface';

@Injectable({
  providedIn: 'root'
})
export class companyFormService {


  constructor(private http: HttpClient) {}

  private formData: any = {};

  setFormData(data: any) {
    this.formData = { ...this.formData, ...data };
  }

  getFormData() {
    return this.formData;
  }

  private apiUrl = 'http://localhost:3333/companies'; // Altere para a URL correta da sua API

  getCompanies(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(this.apiUrl);
  }
}
