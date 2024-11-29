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
  isLoading: boolean = true

  constructor(private companyService: companyFormService) {}

  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      await this.getCompanies()
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }

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

  async getCompanies():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.companyService.getCompanies().subscribe(
        (data) => {
          this.companies = data;
          this.filteredCompanies = data
          resolve()
        },
        (error) => {
          console.log(`Erro ao buscar empresas ${error}`);
          reject(error)
        }
      );
    })
  }
  ngOnInit(): void {
    this.loadData()
  }
}
