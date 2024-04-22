import { Component, OnInit } from '@angular/core';
import { Task } from './task';
import { TaskComponent } from "../task/task.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';


@Component({
    selector: 'app-board',
    standalone: true,
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [TaskComponent, DragDropModule, MatButtonModule, MatIconModule, MatDialogModule, AsyncPipe, CdkDropList]
})
export class BoardComponent implements OnInit{
  todo!: Task[];
  inProgress!: Task[];
  done!: Task[];

  userId: string | undefined;
  ngOnInit(): void {
    this.fireBaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid;
        this.fetchData();
      } else {
        console.log('User is not authenticated.');
      }
    });
  }
  
  constructor(private dialog: MatDialog, private store: Firestore, private fireBaseAuth: Auth, private authService: AuthService) {
    // this.getTodo().subscribe(data => {
    //   this.todo = data; // Assign the data to todo
    //   console.log(data);
    //   console.log(this.userId);
    // });
    this.getInprogress().subscribe(data => {
      this.inProgress = data; // Assign the data to todo
    });
    this.getDone().subscribe(data => {
      this.done = data; // Assign the data to todo
    });
  }
  fetchData():void {
    this.getTodo().subscribe(data => {
      this.todo = data;
      console.log('Todo data:', data);
    });
  }
  // here we get all the tasks from Firebase
  getTodo(): Observable<Task[]> {
    const todoCollection = collection(this.store, `todo|${this.userId}`);
    return collectionData(todoCollection, {
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
  
  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult | undefined) => {
      const dataList = this[list];
      const taskIndex = dataList.indexOf(task);
      if (result?.delete) {
        this.removeTask(list, dataList[taskIndex].id)
      } 
      else {
        this.updateTask(dataList[taskIndex].id, dataList[taskIndex], list);
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      console.log(item.id)
      const targetCollection = event.container.id;
      
      console.log(event.previousContainer.id, targetCollection, event.currentIndex)
      this.addTodo(item.title, item.description, targetCollection);
      this.removeTask(event.previousContainer.id, item.id);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
    )}
  }
  newTask(): void {
    const userId: string | undefined = this.fireBaseAuth.currentUser?.uid;
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
        this.addTodo(result.task.title, result.task.description, `todo|${userId}`);
      });
  }
  addTodo(title: string, description: string, coll: string): Observable<string> {
    const todoColRef = collection(this.store, coll);
    const createTodo = { title, description };
    const promise = addDoc(todoColRef, createTodo).then((responce) => responce.id);
    return from(promise);
  }

  updateTask(todoId: string, dataToUpdate: {title: string, description: string}, coll: string): Observable<void> {
    const docRef = doc(this.store, coll, todoId)
    const promise = setDoc(docRef, dataToUpdate)
    return from(promise);
  }

  removeTask(coll: string, todoId: string,): Observable<void> {
    const docRef = doc(this.store, coll, todoId);
    const promise = deleteDoc(docRef);
    return from(promise);
  }
}

