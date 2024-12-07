import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICurriculum } from '../../models/curriculum.interface';
import { IUser } from '../../models/user.interface';
import { CurriculumService } from '../../services/curriculum/curriculum.service';
import { UserFormService } from '../../services/user/user-form.service';

@Component({
  selector: 'app-curriculum-form-1',
  templateUrl: './curriculum-form-1.component.html',
  styleUrls: ['./curriculum-form-1.component.css'],
})
export class CurriculumForm1Component implements OnInit {
  // Atributos de exibição dos alertas

  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;

  // Pega os dados do usuário salvos em LocalStorage

  userData = this.authService.getUserData();

  // Atributos para operação de editar o currículo
  user!: IUser;
  curriculumData!: ICurriculum;
  curriculumForm!: FormGroup;
  hasCurriculum!: boolean;

  // Controla a exibição do loading na tela

  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: UserAuthService,
    private userFormService: UserFormService,
    private curriculumService: CurriculumService
  ) {}

  // Função que exibe um loading na tela enquanto os dados
  // são buscados no banco de dados e adicionados na tela

  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      await this.checkCurriculum();
      await this.getCurriculumData();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }

  // Inicializa o componente criando o formulário vazio e chamando a função de loading

  ngOnInit(): void {
    this.createForm();
    this.loadData();
  }

  // Verifica se o usuário já possui um currículo
  // cadastrado para definir se é uma operação de
  // criação de currículo ou de edição

  async checkCurriculum(): Promise<void> {
    const id = this.userData?.id;

    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.userFormService.getUserData(id).subscribe(
        (response) => {
          this.hasCurriculum = response.curriculumId != null;
          this.getUserData(); // Carrega os dados do usuário e chama createForm
          resolve();
        },
        (error) => {
          console.log('Erro ao fazer busca do usuário:', error);
          reject(error);
        }
      );
    });
  }

  // Função que busca os dados do usuário no banco de dados

  async getUserData(): Promise<void> {
    const id = this.userData?.id;

    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.userFormService.getUserData(id).subscribe(
        (response: IUser) => {
          this.user = response;
          if (this.hasCurriculum) {
            this.getCurriculumData(); // Se o currículo existe, carrega os dados
          } else {
            this.createForm(); // Caso contrário, cria o formulário vazio
          }
          resolve();
        },
        (error) => {
          console.log(`Erro ao buscar o usuário com ID ${id}: ${error}`);
          reject(error);
        }
      );
    });
  }

  // Função que busca os dados do currículo do usuário no banco de dados

  async getCurriculumData(): Promise<void> {
    const id = this.userData?.id;

    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.curriculumService.getCurriculumData(id).subscribe(
        (response: ICurriculum) => {
          this.curriculumData = response;
          this.createForm(); // Atualiza o formulário com os dados do currículo
          resolve();
        },
        (error) => {
          console.log(`Erro ao buscar currículo: ${error}`);
          reject(error);
        }
      );
    });
  }

  // Função que cria o formulário na tela

  createForm() {
    this.curriculumForm = this.fb.group({
      name: [this.user?.name || '', [Validators.required]],
      dateOfBirth: [
        this.curriculumData?.dateOfBirth || '',
        [Validators.required, this.validateDate.bind(this)], // Validador síncrono
      ],
      age: [this.curriculumData?.age || '', [Validators.required]],
      phoneNumber: [this.user?.phoneNumber || '', [Validators.required]],
      gender: [this.curriculumData?.gender || '', [Validators.required]],
      race: [this.curriculumData?.race || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      city: [this.curriculumData?.city || '', [Validators.required]],
      uf: [this.curriculumData?.uf || '', [Validators.required]],
      address: [this.curriculumData?.address || '', [Validators.required]],
      addressNumber: [
        this.curriculumData?.addressNumber || '',
        [Validators.required],
      ],
      cep: [this.curriculumData?.cep || '', [Validators.required]],
      currentlyStudying: [false],
    });
  }

  // Função que cadastra o currículo no banco de dados
  // pegando os dados fornecidos no formulário

  onSubmit() {
    this.curriculumForm.value;
    if (this.curriculumForm.valid) {
      const formData = this.curriculumForm.value;

      const apiUrl =
        'https://backend-production-ff1f.up.railway.app/curriculum';

      const body = {
        id: this.userData?.id,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        gender: formData.gender,
        race: formData.race,
        city: formData.city,
        address: formData.address,
        addressNumber: formData.addressNumber,
        cep: formData.cep,
        uf: formData.uf,
        userId: this.userData?.id,
      };
      this.http.post<ICurriculum>(apiUrl, body).subscribe(
        (response) => {
          this.addCurriculum(this.userData?.id);
          setTimeout(() => {
            this.router.navigate(['/criar-curriculo/etapa2']);
          }, 2000);
        },
        (error) => {
          window.alert(`Erro ao cadastrar currículo: ${error}`);
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

  // Função que atualiza o currículo do usuário no banco de dados

  onUpdate() {
    console.log(this.curriculumForm.value);
    if (this.curriculumForm.valid) {
      const formData = this.curriculumForm.value;
      const id = this.userData?.id; // Aqui você deve garantir que o ID do currículo correto está sendo utilizado

      const apiUrl = `https://backend-production-ff1f.up.railway.app/curriculum/${id}`; // Verifique se este ID é realmente o ID do currículo

      if (
        formData.name != this.user.name ||
        formData.phoneNumber != this.user.phoneNumber ||
        formData.email != this.user.email ||
        formData.dateOfBirth != this.curriculumData.dateOfBirth ||
        formData.age != this.curriculumData.age ||
        formData.gender != this.curriculumData.gender ||
        formData.race != this.curriculumData.race ||
        formData.city != this.curriculumData.city ||
        formData.address != this.curriculumData.address ||
        formData.addressNumber != this.curriculumData.addressNumber ||
        formData.cep != this.curriculumData.cep ||
        formData.uf != this.curriculumData.uf
      ) {
        const userBody = {
          name: formData.name,
          cpf: this.user.cpf,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: this.user.password,
          curriculumId: this.user.curriculumId,
        };
        const body = {
          dateOfBirth: formData.dateOfBirth,
          age: formData.age,
          gender: formData.gender,
          race: formData.race,
          city: formData.city,
          address: formData.address,
          addressNumber: formData.addressNumber,
          cep: formData.cep,
          uf: formData.uf,
        };
        this.http
          .put(
            `https://backend-production-ff1f.up.railway.app/users/${id}`,
            userBody
          )
          .subscribe(
            (response) => {},
            (error) => {
              console.error(`Erro ao atualizar o usuáario ${error}`);
            }
          );
        this.http.put<ICurriculum>(apiUrl, body).subscribe(
          (response) => {
            this.alertMessage = 'Curriculo Atualizado com sucesso!';
            this.alertClass = 'alert alert-success';
            this.alertTitle = 'Sucesso';
            this.alertIconClass = 'bi bi-check-circle';
            this.showAlert = true;
            this.resetAlertAfterDelay();
            setTimeout(() => {
              this.router.navigate(['/criar-curriculo/etapa2']);
            }, 2000);
          },
          (error) => {
            window.alert(`Erro ao atualizar currículo: ${error}`);
          }
        );
      } else {
        this.router.navigate(['/criar-curriculo/etapa2']);
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

  // Função responsável por adicionar o currículo recém criado
  // no usuário que já está cadastrado, fazendo assim a identificação
  // de que aquele usuário agora possui um currículo

  async addCurriculum(id: number | undefined) {
    const apiUrl = `https://backend-production-ff1f.up.railway.app/users/${id}/curriculum`;

    const body = {
      curriculumId: this.userData?.id,
    };

    try {
      const response = await this.http.put<IUser>(apiUrl, body).toPromise();
    } catch (error) {
      window.alert(`Erro ao fazer busca do currículo: ${error}`);
    }
  }

  // Função que deleta os dados completos do currículo do banco de dados
  // e junto com isso todas as candidaturas feitas pelo candidato

  deleteCurriculum() {
    const id = this.userData?.id;
    this.curriculumService.deleteCurriculum(id).subscribe(
      (response) => {
        this.alertMessage = 'Curriculo deletado!';
        this.alertClass = 'alert alert-danger';
        this.alertTitle = 'Erro';
        this.alertIconClass = 'bi bi-x-circle';
        this.showAlert = true;
        this.resetAlertAfterDelay();
        setTimeout(() => {
          this.router.navigate(['/vagas']);
        }, 2000);
      },
      (error) => {
        console.error(`Erro ao excluir curriculo ${error}`);
      }
    );
  }
  get dateOfBirthControl() {
    return this.curriculumForm.get('dateOfBirth');
  }

  validateDate(control: AbstractControl): ValidationErrors | null {
    

    const rawValue = control.value?.trim();
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!rawValue) {
      return null;
    }

    if (!dateRegex.test(rawValue)) {
      return { invalidDate: true };
    }

    const [day, month, year] = rawValue.split('/').map(Number);

    const date = new Date(year, month - 1, day);
    const isValidDate =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    if (!isValidDate) {
      return { invalidDate: true };
    }

    const today = new Date();
    let age = today.getFullYear() - year;

    const birthdayThisYear = new Date(today.getFullYear(), month - 1, day);
    if (today < birthdayThisYear) {
      age--;
    }

    const parent = control.parent;
    if (parent) {
      const ageControl = parent.get('age');
      if (ageControl) {
        ageControl.setValue(age, { emitEvent: false });
      }
    }

    return null;
  }

  // Função que remove o alerta da tela após 3 segundos

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
