import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class companyFormService {

  private formData: any = {};

  setFormData(data: any) {
    this.formData = { ...this.formData, ...data };
  }

  getFormData() {
    return this.formData;
  }
}
