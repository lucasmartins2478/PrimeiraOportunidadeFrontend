import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { companyFormService } from '../../services/company/company-form.service';
import { Router } from '@angular/router';
import { ICompany } from '../../models/company.interface';
import { UserAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'], // Corrigi a propriedade 'styleUrl' para 'styleUrls'
})
export class CompanyFormComponent implements OnInit {
  // Atributos de exibição do alerta

  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;

  // Atributos usados nas validações de informações
  // Para definir se a operação será de cadastrar ou atualizar

  company!: ICompany;
  companyForm!: FormGroup;
  companyData = this.authService.getCompanyData();

  // Atributos usados para a validação da empresa caso
  // esteja na operação de atualizar os dados

  confirmedPassword!: string;
  isModalPasswordOpen!: boolean;

  // Atributos para chamar a função após a verificação de senha
  // e a contagem de tentativas para caso digite a senha errada

  actionToPerform!: () => void;
  attemptCount: number = 0;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private companyFormService: companyFormService,
    private authService: UserAuthService
  ) {}

  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      await this.getCompanyData();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      // Exiba uma mensagem de erro na UI se necessário
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }

  // Função que busca os dados da empresa no banco de dados se houver

  async getCompanyData(): Promise<void> {
    const id = this.companyData?.id;
    if (!id) {
      console.error('ID do usuário não encontrado.');
      return Promise.reject('ID do usuário não encontrado.');
    }
    return new Promise<void>((resolve, reject) => {
      this.companyFormService.getUserData(id).subscribe(
        (response: ICompany) => {
          this.company = response;
          this.createCompanyForm(this.company);
          resolve();
        },
        (error) => {
          console.log(`Erro ao buscar a empresa com ID ${id}: ${error}`);
          reject(error);
        }
      );
    });
  }

  // Função que gerencia a criação dos campos do formulário de cadastro
  // ou atualização da empresa na tela

  createCompanyForm(company: ICompany) {
    this.companyForm = this.fb.group({
      name: [this.company?.name || '', [Validators.required]],
      cnpj: [this.company?.cnpj || '', [Validators.required]],
      segment: [this.company?.segment || '', [Validators.required]],
      phoneNumber: [this.company?.phoneNumber || '', [Validators.required]],
      email: [this.company?.email || '', [Validators.required]],
      responsible: [this.company?.responsible || '', [Validators.required]],
      url: [this.company?.url || ''],
      password: [this.company?.password || '', [Validators.required]],
      confirmPassword: [this.company?.password || '', [Validators.required]],
      city: [this.company?.city || '', [Validators.required]],
      cep: [this.company?.cep || '', [Validators.required]],
      address: [this.company?.address || '', [Validators.required]],
      addressNumber: [this.company?.addressNumber || '', [Validators.required]],
      uf: [this.company?.uf || '', [Validators.required]],
      logo: [''],
    });
  }

  // Função que executa no momento da inicialização do componente que
  // verifica se é um usuário logado ou não para determinar se deve buscar
  // os dados da empresa para exibir na tela ou se é uma operação de cadastro

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.loadData();
    } else {
      this.isLoading = false;
      this.createCompanyForm(this.company);
    }
  }

  // Verifica se o usuário esta logado ou não

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // Função que exibe o modal de confirmação de
  // senha na tela antes de fazer a atualização
  // dos dados para garantir a segurança da operação

  openModalPassword(action: () => void) {
    this.actionToPerform = action;
    this.isModalPasswordOpen = true;
  }

  // Função que fecha o modal após a confirmação de senha

  closeModalPassword() {
    this.isModalPasswordOpen = false;
    this.confirmedPassword = '';
  }

  // Função que confirma a senha da empresa no momento de
  // atualizar os dados e que possui um contador de 3 tentativas
  // se o usuário errar as tentativas o sistema chama a função de
  // logout e redireciona para a tela de fazer login

  confirmPassword() {
    if (this.company.password === this.confirmedPassword) {
      this.attemptCount = 0;
      this.actionToPerform();
      this.closeModalPassword();
    } else {
      this.attemptCount++; // Incrementa o contador de tentativas.
      this.alertMessage =
        'Cuidado, errar a senha mais de 3 vezes irá bloquear a tela!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Senha incorreta!';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();

      if (this.attemptCount >= 3) {
        // Fecha o modal e executa o logout após 3 tentativas falhas.
        this.router.navigate(['/realize-login']);
        this.closeModalPassword();
        this.authService.logout(); // Supondo que `logout` está no `authService`.
      }
    }
  }

  // Função que deleta os dados da empresa no banco de dados e
  // retorna para a tela inicial do sistema

  deleteCompany() {
    const id = this.company.id;
    this.companyFormService.deleteCompanyData(id).subscribe(
      (response) => {
        this.alertMessage = 'Dados excluídos com sucesso!';
        this.alertClass = 'alert alert-success';
        this.alertTitle = 'Concluído';
        this.alertIconClass = 'bi bi-check-circle';
        this.showAlert = true;
        this.resetAlertAfterDelay();
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/']);
        }, 2000);
      },
      (error) => {
        console.error(`Erro ao deletar empresa ${error}`);
      }
    );
  }

  // Função que cadastra uma nova empresa no sistemaobtendo
  // os dados do formulário e adicionando no banco de dados

  async onSubmit() {
    if (this.companyForm.valid) {
      const apiUrl = 'https://backend-production-ff1f.up.railway.app/companies';

      const formData = this.companyForm.value;

      if (formData.password === formData.confirmPassword) {
        const exists = await this.verifyCnpj(formData.cnpj);
        if (exists) {
          this.alertMessage =
            'O CNPJ informado já está vinculado a uma conta existente!';
          this.alertClass = 'alert alert-danger';
          this.alertTitle = 'Erro';
          this.alertIconClass = 'bi bi-x-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        } else {
          this.http.post<ICompany>(apiUrl, formData).subscribe(
            (response) => {
              this.companyFormService.setFormData(this.companyForm.value);
              this.alertMessage = 'Empresa cadastrado com sucesso!';
              this.alertClass = 'alert alert-success';
              this.alertTitle = 'Sucesso';
              this.alertIconClass = 'bi bi-check-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();
              setTimeout(() => {
                this.router.navigate(['/login/empresa']);
              }, 2000);
            },
            (error) => {
              window.alert(`Erro ao cadastrar usuário ${error}`);
            }
          );
        }
      } else {
        this.alertMessage = 'As senhas devem ser correspondentes!';
        this.alertClass = 'alert alert-danger';
        this.alertTitle = 'Erro';
        this.alertIconClass = 'bi bi-x-circle';
        this.showAlert = true;
        this.resetAlertAfterDelay();
      }
    } else {
      this.alertMessage = 'Preencha os dados corretamente!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }

  // Função que atualiza os dados na empresa no banco de dados

  async onUpdate() {
    if (this.companyForm.valid) {
      const id = this.companyData?.id;
      const apiUrl = `https://backend-production-ff1f.up.railway.app/companies/${id}`;
      const formData = this.companyForm.value;

      this.http.put<ICompany>(apiUrl, formData).subscribe(
        (response) => {
          this.companyFormService.setFormData(this.companyForm.value);
          this.alertMessage = 'Empresa atualizada com sucesso!';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Sucesso';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
          setTimeout(() => {
            this.router.navigate(['/minhas-vagas']);
          }, 2000);
        },
        (error) => {
          console.log(`Erro ao atualizar a empresa: ${error}`);
        }
      );
    } else {
      this.alertMessage = 'Preencha os dados corretamente!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }

  // Função que verifica se o cnpj não está cadastrado
  // em nenhuma outra empresa e se é um cnpj válido

  async verifyCnpj(cnpj: string): Promise<boolean> {
    if (!this.validateCnpj(cnpj)) {
      this.alertMessage = 'O CNPJ fornecido é inválido!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
      return false;
    }

    try {
      const response = await this.http
        .get<ICompany[]>(
          `https://backend-production-ff1f.up.railway.app/companies`
        )
        .toPromise();

      if (response && Array.isArray(response)) {
        return response.some((company) => company.cnpj === cnpj);
      } else {
        return false;
      }
    } catch (error) {
      console.log(`Erro ao buscar por cnpj cadastrados: ${error}`);
      return false;
    }
  }

  // Função que valida o cnpj fornecido pela empresa no momento do cadastro

  validateCnpj(cnpj: string): boolean {
    // Remove os caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');

    // CNPJ com 14 caracteres
    if (cnpj.length !== 14) return false;

    // Validação de CNPJ inválidos conhecidos
    const invalidCnpjs = [
      '00000000000000',
      '11111111111111',
      '22222222222222',
      '33333333333333',
      '44444444444444',
      '55555555555555',
      '66666666666666',
      '77777777777777',
      '88888888888888',
      '99999999999999',
    ];

    if (invalidCnpjs.includes(cnpj)) return false;

    // Valida o primeiro dígito verificador
    let sum = 0;
    let weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj[i]) * weights[i];
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;

    if (digit1 !== parseInt(cnpj[12])) return false;

    // Valida o segundo dígito verificador
    sum = 0;
    weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj[i]) * weights[i];
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;

    return digit2 === parseInt(cnpj[13]);
  }

  // Função que remove o alerta da tela após o timer de 3 segundos

  resetAlertAfterDelay() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  // Função que limpa os dados do alerta

  clearAlert() {
    this.alertMessage = '';
    this.showAlert = false;
  }
}
