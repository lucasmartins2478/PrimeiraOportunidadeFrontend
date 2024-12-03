import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IAcademicData, ICurriculum } from '../../models/curriculum.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { CurriculumService } from '../../services/curriculum/curriculum.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-curriculum-form-2',
  templateUrl: './curriculum-form-2.component.html',
  styleUrls: ['./curriculum-form-2.component.css'],
})
export class CurriculumForm2Component implements OnInit {
  // Atributos de exibição dos alertas

  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;

  // Atributos para operação de editar o currículo

  curriculumData!: ICurriculum;
  academicForm!: FormGroup;
  userData = this.userService.getUserData();
  hasCurriculum!: boolean;
  hasAcademicData!: boolean;

  // Controla a exibição do loading na tela

  isLoading: boolean = true; // Inicializada como true

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserAuthService,
    private router: Router,
    private curriculumService: CurriculumService
  ) {}

  // Inicia o array de dados academicos

  get institutions(): FormArray {
    return this.academicForm.get('institutions') as FormArray;
  }

  // Função que exibe um loading na tela enquanto os dados
  // são buscados no banco de dados e adicionados na tela

  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      await this.checkCurriculum();
      await this.getCurriculumData();
      await this.getAcademicData();
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

  checkCurriculum() {
    const id = this.userData?.id;
    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }

    this.curriculumService.getCurriculumData(id).subscribe(
      (response) => {
        this.hasCurriculum = response.schoolName != null;
      },
      (error) => {
        console.log('Erro ao fazer busca do usuário:', error);
      }
    );
  }

  // Função que cria os campos do formulário na tela

  createForm() {
    this.academicForm = this.fb.group({
      schoolName: ['', Validators.required],
      schoolYear: ['', Validators.required],
      schoolStartDate: ['', [Validators.required]],
      schoolEndDate: [''],
      currentlyStudying: [false],
      institutions: this.fb.array([]),
    });
  }

  // Função que busca dos dados do currículo do usuário no banco de dados

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
          this.updateFormWithCurriculumData();
          resolve();
        },
        (error) => {
          console.log(`Erro ao buscar currículo: ${error}`);
          reject(error);
        }
      );
    });
  }

  // Função que busca os dados academicos do usuário no banco de dados

  async getAcademicData(): Promise<void> {
    const id = this.userData?.id;
    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.curriculumService.getAcademicData(id).subscribe(
        (response: IAcademicData[]) => {
          this.hasAcademicData = Array.isArray(response) && response.length > 0;
          this.updateFormWithAcademicData(response);
          resolve();
        },
        (error) => {
          console.log(`Erro ao buscar dados acadêmicos: ${error}`);
          this.showAlertMessage(
            'Erro ao buscar dados acadêmicos.',
            'alert-danger',
            'Erro',
            'bi bi-x-circle'
          );
          reject(error);
        }
      );
    });
  }

  // Função que atualiza os dados do formulário com os
  // dados do banco de dados para a edição dos dados

  updateFormWithCurriculumData() {
    if (this.curriculumData) {
      this.academicForm.patchValue({
        schoolName: this.curriculumData.schoolName || '',
        schoolYear: this.curriculumData.schoolYear || '',
        schoolStartDate: this.curriculumData.schoolStartDate || '',
        schoolEndDate: this.curriculumData.schoolEndDate || '',
        currentlyStudying: this.curriculumData.currentlyStudying || false,
      });
    }
  }

  // Função que atualiza os campos do formulário de dados academicos para que
  // o usuário possa edita-los

  updateFormWithAcademicData(academicDataArray: IAcademicData[]) {
    if (academicDataArray && academicDataArray.length > 0) {
      academicDataArray.forEach((academicData) => {
        const institutionForm = this.fb.group({
          id: [academicData.id],
          institutionName: [
            academicData.institutionName || '',
            Validators.required,
          ],
          semester: [academicData.semester || '', Validators.required],
          startDate: [academicData.startDate || '', Validators.required],
          endDate: [academicData.endDate || ''],
          isCurrentlyStudying: [academicData.isCurrentlyStudying || false],
          name: [academicData.name || '', Validators.required],
          degree: [academicData.degree || '', Validators.required],
          city: [academicData.city || '', Validators.required],
        });
        this.institutions.push(institutionForm);
      });
    }
  }

  // Função que adiciona mais campos para adição
  // de mais dados institucionais no banco de dados

  addInstitution() {
    const institutionForm = this.fb.group({
      institutionName: ['', Validators.required],
      semester: ['', Validators.required],
      startDate: ['', [Validators.required]],
      endDate: [''],
      isCurrentlyStudying: [false],
      name: ['', Validators.required],
      degree: ['', Validators.required],
      city: ['', Validators.required],
    });
    this.institutions.push(institutionForm);
  }

  // Função que remove os campos de uma instituição da tela e também
  // do banco de dados se houver

  removeInstitution(index: number) {
    const institutionForm = this.institutions.at(index);
    const institutionId = institutionForm.get('id')?.value;

    if (institutionId) {
      // Realiza a exclusão no banco de dados
      this.http
        .delete(
          `https://backend-production-ff1f.up.railway.app/academicData/${institutionId}`
        )
        .subscribe(
          () => {
            this.institutions.removeAt(index);
            this.showAlertMessage(
              'Instituição deletada com sucesso!',
              'alert-success',
              'Sucesso',
              'bi bi-check-circle'
            );
          },
          (error) => {
            console.error('Erro ao deletar dados acadêmicos:', error);
            this.showAlertMessage(
              'Erro ao deletar dados acadêmicos.',
              'alert-danger',
              'Erro',
              'bi bi-x-circle'
            );
          }
        );
    } else {
      // Remove diretamente o formulário vazio
      this.institutions.removeAt(index);
    }
  }


  // Função que adiciona informações no currículo do usuário
  // e também os dados academicos preenhidos na tela

  onSubmit() {
    // Lógica de envio do formulário
    if (this.academicForm.valid) {
      const formData = this.academicForm.value;
      const id = this.userService.getUserData()?.id;
      const curriculumUrl = `https://backend-production-ff1f.up.railway.app/curriculum/${id}/addSchoolData`;

      const body = {
        schoolName: formData.schoolName,
        schoolYear: formData.schoolYear,
        schoolStartDate: formData.schoolStartDate,
        schoolEndDate: formData.schoolEndDate,
        isCurrentlyStudying: formData.currentlyStudying,
      };

      this.http.put<ICurriculum>(curriculumUrl, body).subscribe(
        (response) => {},
        (error) => {
          console.log(`Erro ao adicionar dados escolares: ${error}`);
        }
      );

      const institutionsData = this.institutions.value;
      const apiUrl =
        'https://backend-production-ff1f.up.railway.app/academicData';

      if (institutionsData && institutionsData.length > 0) {
        institutionsData.forEach((institution: IAcademicData) => {
          const body = {
            name: institution.name,
            semester: institution.semester,
            startDate: institution.startDate,
            endDate: institution.endDate,
            isCurrentlyStudying: institution.isCurrentlyStudying,
            institutionName: institution.institutionName,
            degree: institution.degree,
            city: institution.city,
            curriculumId: id,
          };
          this.http.post<IAcademicData[]>(apiUrl, body).subscribe(
            () => {
             
            },
            (error: any) => {
              window.alert(`Erro ao cadastrar currículo: ${error}`);
            }
          );
        });
      }
      setTimeout(() => {
        this.router.navigate(['/criar-curriculo/etapa3']);
      }, 2000);
    } else {
      this.showAlertMessage(
        'Preencha os dados corretamente!',
        'alert-danger',
        'Erro',
        'bi bi-x-circle'
      );
    }
  }

  // Função que atualiza os dados academicos do usuário no banco de dados

  onUpdate() {
    if (this.academicForm.valid) {
      const formData = this.academicForm.value;
      const id = this.userService.getUserData()?.id;
      const curriculumUrl = `https://backend-production-ff1f.up.railway.app/curriculum/${id}/addSchoolData`;

      const body = {
        schoolName: formData.schoolName,
        schoolYear: formData.schoolYear,
        schoolStartDate: formData.schoolStartDate,
        schoolEndDate: formData.schoolEndDate,
        isCurrentlyStudying: formData.currentlyStudying,
      };

      this.http.put<ICurriculum>(curriculumUrl, body).subscribe(
        (response) => {},
        (error) => {
          console.log(`Erro ao adicionar dados escolares: ${error}`);
        }
      );

      const institutionsData = this.institutions.value;
      const apiUrl =
        'https://backend-production-ff1f.up.railway.app/academicData';

      if (institutionsData && institutionsData.length > 0) {
        institutionsData.forEach((institution: IAcademicData) => {
          const institutionBody = {
            name: institution.name,
            semester: institution.semester,
            startDate: institution.startDate,
            endDate: institution.endDate,
            isCurrentlyStudying: institution.isCurrentlyStudying,
            institutionName: institution.institutionName,
            degree: institution.degree,
            city: institution.city,
            curriculumId: id,
          };

          if (institution.id) {
            // Atualiza a instituição existente
            this.http
              .put<IAcademicData>(
                `${apiUrl}/${institution.id}`,
                institutionBody
              )
              .subscribe(
                () => {
                  this.showAlertMessage(
                    'Dados acadêmicos atualizados!',
                    'alert-success',
                    'Sucesso',
                    'bi bi-check-circle'
                  );
                },
                (error: any) => {
                  window.alert(`Erro ao atualizar dados acadêmicos: ${error}`);
                }
              );
          } else {
            // Cria uma nova instituição se o ID não estiver presente
            this.http.post<IAcademicData>(apiUrl, institutionBody).subscribe(
              () => {
                this.showAlertMessage(
                  'Nova instituição adicionada!',
                  'alert-success',
                  'Sucesso',
                  'bi bi-check-circle'
                );
              },
              (error: any) => {
                window.alert(`Erro ao adicionar nova instituição: ${error}`);
              }
            );
          }
        });
      }
      this.showAlertMessage(
        'Nova instituição adicionada!',
        'alert-success',
        'Sucesso',
        'bi bi-check-circle'
      );
      setTimeout(() => {
        this.router.navigate(['/criar-curriculo/etapa3']);
      }, 2000);
    } else {
      this.showAlertMessage(
        'Preencha os dados corretamente!',
        'alert-danger',
        'Erro',
        'bi bi-x-circle'
      );
    }
  }

  // Função que exibe o alerta na tela

  showAlertMessage(
    message: string,
    alertClass: string,
    title: string,
    icon: string
  ) {
    this.alertMessage = message;
    this.alertClass = `alert ${alertClass}`;
    this.alertTitle = title;
    this.alertIconClass = icon;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }
}
