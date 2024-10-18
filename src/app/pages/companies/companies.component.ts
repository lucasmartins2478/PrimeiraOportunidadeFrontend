import { Component, OnInit } from '@angular/core';
import { ICompany } from '../../models/company.interface';
import { companyFormService } from '../../services/company/company-form.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
})
export class CompaniesComponent implements OnInit {
  companies: ICompany[] = [];

  constructor(private companyService: companyFormService) {}

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe(
      (data) => {
        this.companies = data;
      },
      (error) => {
        console.log(`Erro ao buscar empresas ${error}`);
      }
    );
  }
}
