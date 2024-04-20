import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatFormField,
     MatInputModule, RouterLink, FormsModule, 
     ReactiveFormsModule, MatButtonModule, MatIcon, MatTooltipModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hide = true;
  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  errorMessage: string = 'Enter correct value';
  success: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
  }
  Submit(): void {
    const values = this.userForm.getRawValue();
    //const email = values.email!; can be deleted 
    //const password = values.password!;
    this.authService.login(values.email!, values.password!)
      .subscribe({
        next: () => {
          this.success = true;
          this.router.navigateByUrl('/board');
        }, error: (err) => {
          this.errorMessage = err.message;
        }
      }
      )
  }
}
