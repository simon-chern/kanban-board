import { Component } from '@angular/core';
import { Task } from './task';
import { TaskComponent } from "../task/task.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
    selector: 'app-board',
    standalone: true,
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [TaskComponent, DragDropModule, MatButtonModule, MatIconModule, MatDialogModule, AsyncPipe, CdkDropList]
})
export class BoardComponent {
  todo!: Task[];
  inProgress!: Task[];
  done!: Task[];
  constructor(private dialog: MatDialog, private store: Firestore) {
    this.getTodo().subscribe(data => {
      this.todo = data; // Assign the data to todo
    });
    this.getInprogress().subscribe(data => {
      this.inProgress = data; // Assign the data to todo
    });
    this.getDone().subscribe(data => {
      this.done = data; // Assign the data to todo
    });
  }

  // here we get all the tasks from Firebase
  todoCollection = collection(this.store, 'todo');
  getTodo(): Observable<Task[]> {
    return collectionData(this.todoCollection, {
      idField: 'id'
    }) as Observable<Task[]>;
  }
  inProgressCollection = collection(this.store, 'inProgress');
  getInprogress(): Observable<Task[]> {
    return collectionData(this.inProgressCollection, {
      idField: 'id'
    }) as Observable<Task[]>;
  }
  
  doneCollection = collection(this.store, 'done');
  getDone(): Observable<Task[]> {
    return collectionData(this.doneCollection, {
      idField: 'id'
    }) as Observable<Task[]>;
  }
  
  // editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
  //   const dialogRef = this.dialog.open(TaskDialogComponent, {
  //     width: '400px',
  //     data: {
  //       task,
  //       enableDelete: true,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result: TaskDialogResult | undefined) => {
  //     if (!result) {
  //       return;
  //     }
  //     const dataList = this[list];
  //     const taskIndex = dataList.indexOf(task);
  //     if (result.delete) {
  //       dataList.splice(taskIndex, 1);
  //     } else {
  //       dataList[taskIndex] = task;
  //     }
  //   });
  // }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      console.log(item.id)
      const targetCollection = event.container.id;
      
      console.log(event.previousContainer.id, targetCollection, event.currentIndex)
      this.addTodo(item.title, item.description, targetCollection);
      this.removeTodo(event.previousContainer.id, item.id);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
    )}
  }
  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        this.addTodo(result.task.title, result.task.description, 'todo');
      });
  }
  addTodo(title: string, description: string, coll: string): Observable<string> {
    const todoColRef = collection(this.store, coll);
    const createTodo = { title, description };
    const promise = addDoc(todoColRef, createTodo).then((responce) => responce.id);
    return from(promise);
  }

  removeTodo(coll: string, todoId: string,): Observable<void> {
    const docRef = doc(this.store, coll, todoId);
    const promise = deleteDoc(docRef);
    return from(promise);
  }
}

