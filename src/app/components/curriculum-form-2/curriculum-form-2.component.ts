import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IAcademicData, ICurriculum } from '../../models/curriculum.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { CurriculumService } from '../../services/curriculum/curriculum.service';

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

  constructor(
    private fb: FormBuilder,
    private userService: UserAuthService,
    private router: Router,
    private curriculumService: CurriculumService
  ) {}

  get institutions(): FormArray {
    return this.academicForm.get('institutions') as FormArray;
  }

  ngOnInit(): void {
    this.createForm();
    this.getCurriculumData();
    this.getAcademicData();
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
        this.updateFormWithAcademicData(response);
      },
      (error) => {
        console.log(`Erro ao buscar dados acadêmicos: ${error}`);
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
          institutionName: [academicData.institutionName || '', Validators.required],
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
    this.institutions.removeAt(index);
  }

  onSubmit() {
    // Lógica de envio do formulário
  }

  showAlertMessage(message: string, alertClass: string, title: string, icon: string) {
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
