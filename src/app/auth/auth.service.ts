import { Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$ = user(this.fireBaseAuth);
  public classThemeSig = signal<string>('theme-dark');
  public currentUserSig = signal<UserInterface | null | undefined>(undefined);
  
  constructor(private readonly fireBaseAuth: Auth) { }

  public register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.fireBaseAuth, email, password)
      .then(response => updateProfile(response.user, { displayName: username}));
    return from(promise);
  };
  public login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.fireBaseAuth, email, password).then(() => {})
    return from(promise);
  };
  public logout(): Observable<void> {
    const promise = signOut(this.fireBaseAuth);
    return from(promise);
  };
}
