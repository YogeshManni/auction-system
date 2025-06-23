import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuctionDetailComponent } from './components/auction-detail/auction-detail.component';
import { AuctionListComponent } from './components/auction-list/auction-list.component';

const routes: Routes = [
  { path: '', component: AuctionListComponent },
  { path: 'auction/:id', component: AuctionDetailComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
