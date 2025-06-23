import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuctionDetailComponent } from './components/auction-detail/auction-detail.component';
import { AuctionListComponent } from './components/auction-list/auction-list.component';
import { NotFoundComponent } from './components/core/not-found/not-found.component';
import { UserAgreementComponent } from './components/core/user-agreement/user-agreement.component';
import { TermsOfServiceComponent } from './components/core/terms-of-service/terms-of-service.component';
import { ContactUsComponent } from './components/core/contact-us/contact-us.component';

const routes: Routes = [
  { path: '', redirectTo: 'product/latest', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () =>
      import('./components/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./components/product/product.module').then(
        (m) => m.ProductModule
      ),
  },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'user-agreement', component: UserAgreementComponent },
  { path: '**', component: NotFoundComponent },
  /* { path: '', component: AuctionListComponent },
  { path: 'auction/:id', component: AuctionDetailComponent },
  { path: '**', redirectTo: '' }, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
