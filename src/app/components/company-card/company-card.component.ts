import { Component, Input } from '@angular/core';
import { ICompany } from '../../models/company.interface';
import { UserAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrl: './company-card.component.css'
})
export class CompanyCardComponent {

  @Input() company!: ICompany

  companyName: string | undefined = "Teste"



}
