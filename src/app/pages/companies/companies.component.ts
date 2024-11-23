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
  filteredCompanies: ICompany[] = [];

  constructor(private companyService: companyFormService) {}

  onSearch(value: string) {
    const searchValue = this.removeAccents(value.toLowerCase());
    this.filteredCompanies = this.companies.filter(
      (company) =>
        this.removeAccents(company.name.toLowerCase()).includes(searchValue) // Compara sem acentos
    );
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  }

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe(
      (data) => {
        this.companies = data;
        this.filteredCompanies = data
      },
      (error) => {
        console.log(`Erro ao buscar empresas ${error}`);
      }
    );
  }
}
