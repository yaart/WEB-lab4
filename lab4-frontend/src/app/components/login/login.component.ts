import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authForm!: FormGroup;
  isLoginMode = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]]
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      return;
    }

    this.loading = true;
    const request = this.authForm.value;

    const authObservable = this.isLoginMode
      ? this.authService.login(request)
      : this.authService.register(request);

    authObservable.subscribe({
      next: (response) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Успешно',
          detail: response.message
        });
        this.router.navigate(['/main']);
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || error.error?.messages?.[0] || 'Произошла ошибка';
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: message
        });
      }
    });
  }
}
