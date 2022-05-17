import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'admin', component: AdminComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
