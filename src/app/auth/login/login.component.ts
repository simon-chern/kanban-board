import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormField, MatInputModule,
    FormsModule, ReactiveFormsModule, MatButtonModule, MatIcon, MatTooltipModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hide = true;
  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  errorMessage = 'Enter correct value';

  constructor(private authService: AuthService, private router: Router) {
  }
  Submit(): void {
    const values = this.userForm.getRawValue();
    const email = values.email!;
    const username = values.username!;
    const password = values.password!;
    this.authService.register(email, username, password)
    .subscribe(() => {
      this.router.navigateByUrl('/board');
    })
  }
}

