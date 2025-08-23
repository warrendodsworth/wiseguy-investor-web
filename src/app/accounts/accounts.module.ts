import { NgModule } from '@angular/core';

import { AccountsRoutingModule } from './accounts-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, AccountsRoutingModule],
})
export class AccountsModule {}
