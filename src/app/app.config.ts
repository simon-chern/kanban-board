import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"kanban-7f8a0","appId":"1:690259389221:web:cc48e64fdf09fff24dc8cc","storageBucket":"kanban-7f8a0.appspot.com","apiKey":"AIzaSyBfyjxUxYLhMJKZy8GP9W_Yl87ZxQtBVvY","authDomain":"kanban-7f8a0.firebaseapp.com","messagingSenderId":"690259389221","measurementId":"G-0CS6E2XBBV"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideStorage(() => getStorage()))]
};
