import { Component, EventEmitter, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, MatToolbarModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kanban';
  class: string = '';
  isDark = false;
  toggleTheme(event: any) {
    if (event.checked) {
      this.class = 'theme-dark';
    } else {
      this.class = '';
    }
  }
}
