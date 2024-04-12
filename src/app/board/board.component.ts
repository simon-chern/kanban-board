import { Component } from '@angular/core';
import { Task } from './task';
import { TaskComponent } from "../task/task.component";
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-board',
    standalone: true,
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [TaskComponent, DragDropModule, MatButtonModule, MatIconModule]
})
export class BoardComponent {
  done: Task[] = [];
  inProgress: Task[] = [];
  todo: Task[] = [
    {
      title: 'Buy milk',
      description: 'Go to the store and buy milk'
    },
    {
      title: 'Create a Kanban app',
      description: 'Using Firebase and Angular create a Kanban app!'
    }
  ];
  editTask(list: string, task: Task): void {};

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      
    }
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
