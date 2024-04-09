import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { BoardComponent } from './board/board.component';

export const routes: Routes = [
    { path: "", component: LandingComponent},
    { path: "board", component: BoardComponent}
];
