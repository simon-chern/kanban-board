import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './auth/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, MatToolbarModule, MatIconModule, RouterLink, MatTooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  public userName: string | null | undefined = '';
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!
        })
        this.userName = this.authService.currentUserSig()?.username
      } else {
        this.authService.currentUserSig.set(null);
      }
    })
  }
  constructor(readonly authService: AuthService) {}
  
  public logout() {
    this.authService.logout();
  }

  //code for dark and light themes

  //classSignal: string = 'theme-dark';
  public toggleTheme(event: any) {
    if (event.checked) {
      this.authService.classThemeSig.set('');
    } 
    else {
      this.authService.classThemeSig.set('theme-dark');
    }
  }
}
