import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';
import { UtilService } from '../../core/services/util.service';

@Component({
  templateUrl: './user-profile.page.html',
  standalone: true,
  imports: [SharedModule],
})
export class UserProfileComponent implements OnInit {
  uid: string = '';
  user: AppUser | null = null;
  useTransparentToolbar = true;

  constructor(
    public _layout: LayoutService,
    public util: UtilService,
    public route: ActivatedRoute,
    public auth: AuthService
  ) {}

  async ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid') ?? '';

    this.user = await this.auth.getUser(this.uid);
  }
}
