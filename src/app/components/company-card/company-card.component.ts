import { Component, Input } from '@angular/core';
import { ICompany } from '../../models/company.interface';
import { UserAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrl: './company-card.component.css'
})
export class CompanyCardComponent {

  // Aqui o componente recebe os dados para
  // exibir na tela referente a uma empresa específica
  
  @Input() company!: ICompany
}
