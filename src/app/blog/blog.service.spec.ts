import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
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
import { firebaseConfig } from 'src/environments/firebase.config';
import { AuthService } from '../auth.service';
import { PhotoService } from '../photo.service';
import { BlogManageComponent } from './blog-manage/blog-manage.component';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogService } from './blog.service';
import { BlogComponent } from './blog/blog.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostComponent } from './post/post.component';


describe('BlogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
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

      BlogRoutingModule
    ],
    declarations: [
      BlogManageComponent,
      BlogComponent,
      PostComponent,
      PostDetailComponent
    ],
    providers: [
      AuthService,
      BlogService,
      PhotoService
    ],
  }));

  it('should be created', () => {
    const service: BlogService = TestBed.get(BlogService);
    expect(service).toBeTruthy();
  });
});
