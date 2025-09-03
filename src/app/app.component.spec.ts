import { CommonModule } from '@angular/common';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { FCMBaseService } from './core/services/fcm.service';
import { firebaseConfig } from '../environments/firebase-config';
import { Analytics } from '@angular/fire/analytics';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CommonModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
      declarations: [AppComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(() => {
          const auth = getAuth();
          if (environment.useEmulators) {
            connectAuthEmulator(auth, 'http://localhost:9099');
          }
          return auth;
        }),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),

        { provide: Analytics, useValue: { logEvent: () => {} } },
        AuthService,
        FCMBaseService,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'WiseGuy Investor'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('WiseGuy Investor');
  });

  it('should render title in a footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('WiseGuy Investor');
  });
});
