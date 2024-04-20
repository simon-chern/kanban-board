import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireBaseAuth: Auth) { }
  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.fireBaseAuth, email, password)
      .then(response => updateProfile(response.user, { displayName: username}));
    return from(promise);
  }
  //login(email: string, password: string): Observable<void> {
  //   const promise = 
  // }
}
