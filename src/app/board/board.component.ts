import { Component, OnInit } from '@angular/core';
import { Task } from './task';
import { TaskComponent } from "../task/task.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Observable, combineLatest, from } from 'rxjs';
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
export class BoardComponent implements OnInit {
  public todo: Task[] = [];
  public inProgress: Task[] = [];
  public done: Task[] = [];

  userId: string | undefined;
  ngOnInit(): void {
    this.fireBaseAuth.onAuthStateChanged(user => {
      if (user) {
        console.log("User logged in.")
        this.userId = user.uid;
        console.log(this.userId)
        this.fetchData();  
      } else {
        console.log('User is not authenticated.');
      }
    });
  }
  
  constructor(
    private dialog: MatDialog, 
    private store: Firestore,
    private fireBaseAuth: Auth) {}

  fetchData():void {
    if (!this.userId) {
      console.log('User ID is not available.');
      return;
    }

    // Fetch all types of data in parallel
    const todo$ = this.getData(`todo|${this.userId}`);
    const inProgress$ = this.getData(`inProgress|${this.userId}`);
    const done$ = this.getData(`done|${this.userId}`);
    // Combine all observables and subscribe once to update data
    combineLatest([todo$, inProgress$, done$]).subscribe(([todo, inProgress, done]) => {
      this.todo = todo;
      this.inProgress = inProgress;
      this.done = done;
    });
  }
  
  getData(collectionPath: string): Observable<Task[]> {
    const collectionRef = collection(this.store, collectionPath);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<Task[]>;
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
      const targetCollection = event.container.id;
      
      //console.log(item.id)
      //console.log(event.previousContainer.id, targetCollection, event.currentIndex)
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
        this.addTodo(result.task.title, result.task.description, "todo");
      });  
  }
  addTodo(title: string, description: string, coll: string): Observable<string> {
    const todoColRef = collection(this.store, `${coll}|${this.userId}`);
    const createTodo = { title, description };
    const promise = addDoc(todoColRef, createTodo).then((responce) => responce.id);
    return from(promise);
  }

  updateTask(todoId: string, dataToUpdate: {title: string, description: string}, coll: string): Observable<void> {
    const docRef = doc(this.store, `${coll}|${this.userId}`, todoId)
    const promise = setDoc(docRef, dataToUpdate)
    return from(promise);
  }

  removeTask(coll: string, todoId: string,): Observable<void> {
    const docRef = doc(this.store, `${coll}|${this.userId}`, todoId);
    const promise = deleteDoc(docRef);
    return from(promise);
  }
}

