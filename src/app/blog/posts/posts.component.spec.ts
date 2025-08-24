import { CommonModule } from '@angular/common';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PostsComponent } from './posts.component';
import { firebaseConfig } from '../../../environments/firebase-config';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,

        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [PostsComponent],
      providers: [
        AuthService,
        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}), queryParams: of({}) } },
        { provide: AngularFirestore, useValue: { collection: () => ({ valueChanges: () => of([]) }) } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
