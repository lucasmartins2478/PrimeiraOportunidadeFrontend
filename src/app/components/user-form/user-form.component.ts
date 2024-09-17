import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from "@angular/forms"

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit{

  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  onSubmit() {
    const formData = this.userForm.value;
    if( formData.password === formData.confirmPassword){
      window.alert("Senhas são iguais")
    }else if(formData.password !== formData.confirmPassword){
      window.alert("Senhas não conferem")
    }
    // window.alert(`dados do formulário : ${formData.name}, ${formData.phoneNumber}, ${formData.email}, ${formData.password}, ${formData.confirmPassword}`)
  }
}
