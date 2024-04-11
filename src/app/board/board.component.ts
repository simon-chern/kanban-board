import { Component } from '@angular/core';
import { Task } from './task';
import { TaskComponent } from "../task/task.component";
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-board',
    standalone: true,
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [TaskComponent, DragDropModule]
})
export class BoardComponent {
  tasks: Task[] = [
    {
      title: 'Buy milk',
      description: 'Go to the store and buy milk'
    },
    {
      title: 'Create a Kanban app',
      description: 'Using Firebase and Angular create a Kanban app!'
    }
  ];
}
