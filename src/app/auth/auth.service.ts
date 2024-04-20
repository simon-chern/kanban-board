import { Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = user(this.fireBaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);
  constructor(private fireBaseAuth: Auth) { }
  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.fireBaseAuth, email, password)
      .then(response => updateProfile(response.user, { displayName: username}));
    return from(promise);
  }
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.fireBaseAuth, email, password).then(() => {})
    console.log(this.user$);
    return from(promise);
  };
}
