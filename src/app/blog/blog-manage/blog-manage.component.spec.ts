import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { FacebookModule } from 'ngx-facebook';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from 'src/app/auth.service';
import { firebaseConfig } from 'src/environments/firebase.config';
import { BlogRoutingModule } from '../blog-routing.module';
import { BlogManageComponent } from './blog-manage.component';


describe('BlogManageComponent', () => {
  let component: BlogManageComponent;
  let fixture: ComponentFixture<BlogManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        ContentLoaderModule,
        ToastrModule.forRoot(),
        FacebookModule.forRoot(),

        CommonModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,

        BlogRoutingModule,
      ],
      declarations: [
        BlogManageComponent
      ],
      providers: [
        AuthService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
