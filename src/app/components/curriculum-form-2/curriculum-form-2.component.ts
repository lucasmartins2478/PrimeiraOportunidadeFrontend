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
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;
  curriculumData!: ICurriculum;
  academicForm!: FormGroup;
  userData = this.userService.getUserData();
  hasCurriculum!: boolean;
  hasAcademicData!: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserAuthService,
    private router: Router,
    private curriculumService: CurriculumService
  ) {}

  get institutions(): FormArray {
    return this.academicForm.get('institutions') as FormArray;
  }

  ngOnInit(): void {
    this.checkCurriculum();
  }

  checkCurriculum() {
    const id = this.userData?.id;
    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }

    this.curriculumService.getCurriculumData(id).subscribe(
      (response) => {
        this.hasCurriculum = response.schoolName != null;
        this.createForm(); // Mover para antes de chamar getAcademicData()
        this.getCurriculumData();
        this.getAcademicData();
      },
      (error) => {
        console.log('Erro ao fazer busca do usuário:', error);
      }
    );
  }

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

  getCurriculumData() {
    const id = this.userData?.id;
    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }
    this.curriculumService.getCurriculumData(id).subscribe(
      (response: ICurriculum) => {
        this.curriculumData = response;
        this.updateFormWithCurriculumData();
      },
      (error) => {
        console.log(`Erro ao buscar currículo: ${error}`);
      }
    );
  }

  getAcademicData() {
    const id = this.userData?.id;
    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }
    this.curriculumService.getAcademicData(id).subscribe(
      (response: IAcademicData[]) => {
        this.hasAcademicData = Array.isArray(response) && response.length > 0;
        this.updateFormWithAcademicData(response);
      },
      (error) => {
        console.log(`Erro ao buscar dados acadêmicos: ${error}`);
        this.showAlertMessage(
          'Erro ao buscar dados acadêmicos.',
          'alert-danger',
          'Erro',
          'bi bi-x-circle'
        );
      }
    );
  }

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

  removeInstitution(index: number) {
    const institutionId = this.institutions.at(index).get('id')?.value;

    if (!institutionId) {
      console.error('ID da instituição não encontrado.');
      return;
    }

    this.http
      .delete(`http://localhost:3333/academicData/${institutionId}`)
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
  }

  onSubmit() {
    // Lógica de envio do formulário
    if (this.academicForm.valid) {
      const formData = this.academicForm.value;
      const id = this.userService.getUserData()?.id;
      const curriculumUrl = `http://localhost:3333/curriculum/${id}/addSchoolData`;

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
      const apiUrl = 'http://localhost:3333/academicData';

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
              this.showAlertMessage(
                'Formulário válido!',
                'alert-success',
                'Sucesso',
                'bi bi-check-circle'
              );
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
  onUpdate() {
    if (this.academicForm.valid) {
      const formData = this.academicForm.value;
      const id = this.userService.getUserData()?.id;
      const curriculumUrl = `http://localhost:3333/curriculum/${id}/addSchoolData`;

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
      const apiUrl = 'http://localhost:3333/academicData';

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
