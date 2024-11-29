import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ICompetences,
  ICoursesData,
  ICurriculum,
} from '../../models/curriculum.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { CurriculumService } from '../../services/curriculum/curriculum.service';

@Component({
  selector: 'app-curriculum-form-3',
  templateUrl: './curriculum-form-3.component.html',
  styleUrls: ['./curriculum-form-3.component.css'],
})
export class CurriculumForm3Component implements OnInit {
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;
  competencesData!: ICompetences[];
  cousesData!: ICoursesData[];
  courseForm!: FormGroup;
  userData = this.userService.getUserData();
  hasCoursesData!: boolean;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserAuthService,
    private curriculumService: CurriculumService,
    private http: HttpClient
  ) {
    // Cria o FormGroup para o formulário
  }
  private async loadData(): Promise<void> {
    try {
      await this.getCousesData();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }

  async getCousesData(): Promise<void> {
    const id = this.userData?.id;
    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      this.curriculumService.getCoursesData(id).subscribe(
        (response: ICoursesData[]) => {
          this.hasCoursesData = response.length > 0;
          this.cousesData = response;

          this.updateFormWithCoursesData(response);

          if (!this.hasCoursesData) {
            this.addCourse();
          }

          // Aguarda o carregamento das competências
          this.getCompetencesData().then(resolve).catch(reject);
        },
        (error) => {
          console.log(`Erro ao buscar cursos: ${error}`);
          reject(error);
        }
      );
    });
  }

  async getCompetencesData(): Promise<void> {
    const id = this.userData?.id;
    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      this.curriculumService.getCompetences(id).subscribe(
        (response: ICompetences[]) => {
          this.competencesData = response;
          this.updateFormWithCompetencesData(response);
          resolve();
        },
        (error) => {
          console.log(`Erro ao buscar competências: ${error}`);
          reject(error);
        }
      );
    });
  }

  createForm() {
    this.courseForm = this.fb.group({
      courses: this.fb.array([]),
      competenceInput: [''], // FormArray para cursos
      competencies: this.fb.array([]), // FormArray para competências
    });
  }

  updateFormWithCoursesData(coursesData: ICoursesData[]) {
    this.cousesData.forEach((course) => {
      const courseGroup = this.fb.group({
        id: [course.id],
        name: [course.name, Validators.required],
        modality: [course.modality, Validators.required],
        duration: [course.duration, Validators.required],
        dateOfEnd: [course.endDate],
        isCurrentlyStudying: [course.isCurrentlyStudying],
        institutionName: [course.institutionName, Validators.required],
      });
      this.courses.push(courseGroup);
    });
  }

  updateFormWithCompetencesData(competenceData: ICompetences[]) {
    this.competencies.clear(); // Limpa as competências existentes no FormArray
    competenceData.forEach((competence) => {
      this.competencies.push(
        this.fb.group({
          id: [competence.id], // Adicione o ID ao formulário
          name: [competence.name],
        })
      );
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.loadData(); // Controla o carregamento dos dados
  }

  // Getter para o FormArray de courses
  get courses(): FormArray {
    return this.courseForm.get('courses') as FormArray;
  }

  // Método para adicionar um novo curso ao FormArray
  addCourse(): void {
    const courseGroup = this.fb.group({
      name: ['', Validators.required],
      modality: ['', Validators.required],
      duration: ['', Validators.required],
      dateOfEnd: [''],
      isCurrentlyStudying: [false],
      institutionName: ['', Validators.required],
    });

    this.courses.push(courseGroup);
  }

  // Método para remover um curso pelo índice
  removeCourse(index: number): void {
    const courseId = this.courses.at(index).get('id')?.value;
    if (!courseId) {
      this.courses.removeAt(index);
      return;
    }
    this.http
      .delete(
        `https://backend-production-ff1f.up.railway.app/courseData/${courseId}`
      )
      .subscribe(() => {
        this.courses.removeAt(index);
        this.showAlertMessage(
          'Curso deletada com sucesso!',
          'alert-success',
          'Sucesso',
          'bi bi-check-circle'
        );
      });
  }

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    // Disparar outra função ou lógica com base no valor
    if (isChecked) {
      this.removeCourse(0);
    } else {
      this.addCourse();
    }
  }

  // Getter para o FormArray de competencies
  get competencies(): FormArray {
    return this.courseForm.get('competencies') as FormArray;
  }

  // Adicionar uma competência ao FormArray
  // Adicionar uma competência ao FormArray
  addCompetence(): void {
    const competenceValue = this.courseForm.get('competenceInput')?.value;

    if (competenceValue) {
      // Adiciona a competência ao FormArray `competencies`
      this.competencies.push(this.fb.group({ name: competenceValue }));

      // Limpa o campo `competenceInput` após adicionar
      this.courseForm.get('competenceInput')?.reset();
    }
  }

  // Remover uma competência do FormArray
  removeCompetence(index: number): void {
    const competenceId = this.competencies.at(index).get('id')?.value;
    if (!competenceId) {
      this.competencies.removeAt(index);
      return;
    }
    this.http
      .delete(
        `https://backend-production-ff1f.up.railway.app/competences/${competenceId}`
      )
      .subscribe(() => {
        this.competencies.removeAt(index);
        this.showAlertMessage(
          'Competencia deletada com sucesso!',
          'alert-success',
          'Sucesso',
          'bi bi-check-circle'
        );
      });
  }

  // Método de submissão do formulário
  onSubmit(): void {
    if (this.courseForm.valid) {
      const coursesData = this.courses.value;
      const competenciesData = this.competencies.value;

      // Enviar dados dos cursos
      if (coursesData && coursesData.length > 0) {
        coursesData.forEach((course: ICoursesData) => {
          const apiUrl =
            'https://backend-production-ff1f.up.railway.app/courseData';

          const body = {
            name: course.name,
            modality: course.modality,
            duration: course.duration,
            endDate: course.endDate,
            isCurrentlyStudying: course.isCurrentlyStudying,
            institutionName: course.institutionName,
            curriculumId: this.userService.getUserData()?.id,
          };

          this.http.post<ICoursesData[]>(apiUrl, body).subscribe(
            (response) => {
              this.alertMessage = 'Curso cadastrado com sucesso!';
              this.alertClass = 'alert alert-success';
              this.alertTitle = 'Sucesso';
              this.alertIconClass = 'bi bi-check-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();
            },
            (error) => {
              window.alert(`Erro ao cadastrar curso: ${error}`);
            }
          );
        });
      }

      // Enviar dados das competências
      if (competenciesData && competenciesData.length > 0) {
        competenciesData.forEach((competence: ICompetences) => {
          const apiUrl =
            'https://backend-production-ff1f.up.railway.app/competences';

          const body = {
            name: competence.name,
            curriculumId: this.userService.getUserData()?.id,
          };

          this.http.post<ICompetences[]>(apiUrl, body).subscribe(
            (response) => {
              this.alertMessage = 'Competência cadastrada com sucesso!';
              this.alertClass = 'alert alert-success';
              this.alertTitle = 'Sucesso';
              this.alertIconClass = 'bi bi-check-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();
            },
            (error) => {
              window.alert(`Erro ao cadastrar competência: ${error}`);
            }
          );
        });
      }
      setTimeout(() => {
        this.router.navigate(['/criar-curriculo/etapa4']);
      }, 2000);
    } else {
      this.alertMessage = 'Preencha os dados corretamente!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }

  onUpdate() {
    if (this.courseForm.valid) {
      const coursesData = this.courses.value;
      const competenciesData = this.competencies.value;

      // Enviar dados dos cursos
      if (coursesData && coursesData.length > 0) {
        coursesData.forEach((course: ICoursesData) => {
          const apiUrl =
            'https://backend-production-ff1f.up.railway.app/courseData';

          const body = {
            name: course.name,
            modality: course.modality,
            duration: course.duration,
            endDate: course.endDate,
            isCurrentlyStudying: course.isCurrentlyStudying,
            institutionName: course.institutionName,
            curriculumId: this.userService.getUserData()?.id,
          };
          if (course.id) {
            this.http
              .put<ICoursesData[]>(`${apiUrl}/${course.id}`, body)
              .subscribe(
                (response) => {
                  this.alertMessage = 'Curso atualizado com sucesso!';
                  this.alertClass = 'alert alert-success';
                  this.alertTitle = 'Sucesso';
                  this.alertIconClass = 'bi bi-check-circle';
                  this.showAlert = true;
                  this.resetAlertAfterDelay();
                },
                (error) => {
                  window.alert(`Erro ao atualizar curso: ${error}`);
                }
              );
          } else {
            this.http.post<ICoursesData[]>(apiUrl, body).subscribe(
              (response) => {
                this.alertMessage = 'Curso cadastrado com sucesso!';
                this.alertClass = 'alert alert-success';
                this.alertTitle = 'Sucesso';
                this.alertIconClass = 'bi bi-check-circle';
                this.showAlert = true;
                this.resetAlertAfterDelay();
              },
              (error) => {
                window.alert(`Erro ao cadastrar curso: ${error}`);
              }
            );
          }
        });
      }

      // Enviar dados das competências
      if (competenciesData && competenciesData.length > 0) {
        competenciesData.forEach((competence: ICompetences) => {
          const apiUrl =
            'https://backend-production-ff1f.up.railway.app/competences';
          const body = {
            name: competence.name,
            curriculumId: this.userService.getUserData()?.id,
          };
          if (competence.id) {
            this.http
              .put<ICompetences[]>(`${apiUrl}/${competence.id}`, body)
              .subscribe(
                (response) => {
                  this.alertMessage = 'Competência atualizada com sucesso!';
                  this.alertClass = 'alert alert-success';
                  this.alertTitle = 'Sucesso';
                  this.alertIconClass = 'bi bi-check-circle';
                  this.showAlert = true;
                  this.resetAlertAfterDelay();
                },
                (error) => {
                  window.alert(`Erro ao atualizar competência: ${error}`);
                }
              );
          } else {
            this.http.post<ICompetences[]>(apiUrl, body).subscribe(
              (response) => {
                this.alertMessage = 'Competência cadastrada com sucesso!';
                this.alertClass = 'alert alert-success';
                this.alertTitle = 'Sucesso';
                this.alertIconClass = 'bi bi-check-circle';
                this.showAlert = true;
                this.resetAlertAfterDelay();
              },
              (error) => {
                window.alert(`Erro ao cadastrar competência: ${error}`);
              }
            );
          }
        });
      }

      setTimeout(() => {
        this.router.navigate(['/criar-curriculo/etapa4']);
      }, 2000);
    } else {
      this.alertMessage = 'Preencha os dados corretamente!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
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
  resetAlertAfterDelay() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  clearAlert() {
    this.alertMessage = '';
    this.showAlert = false;
  }
}
