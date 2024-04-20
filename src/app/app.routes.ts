import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { BoardComponent } from './board/board.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    { path: "", component: LandingComponent},
    { path: "board", component: BoardComponent},
    { path: "register", component: RegisterComponent},
    { path: "login", component: LoginComponent}
];
