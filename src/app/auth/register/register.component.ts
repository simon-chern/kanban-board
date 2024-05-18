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
  selector: 'app-register',
  standalone: true,
  imports: [MatFormField, MatInputModule, RouterLink, FormsModule, ReactiveFormsModule, MatButtonModule, MatIcon, MatTooltipModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public hide = true;
  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  public errorMessage: string = 'Enter correct value';

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  public Submit(): void {
    const values = this.userForm.getRawValue();
    const email = values.email!;
    const username = values.username!;
    const password = values.password!;
    this.authService.register(email, username, password)
    .subscribe({next: () => {
      this.router.navigateByUrl('/board')
    }, error: (err) => {
      this.errorMessage = `Something went wrong ${err.message}`;
    }
    }
    )
  }
}

