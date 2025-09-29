import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';
import { AdminEditorComponent } from './admin-editor/admin-editor.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminManageComponent } from './admin-manage/admin-manage.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NewspaperLandingComponent } from './newspaper-landing/newspaper-landing.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostExplorerComponent } from './post-explorer/post-explorer.component';


const routes: Routes = [
    // main newspaper-style landing page
    { path: '', component: NewspaperLandingComponent },

    // individual post page
    { path: 'post/:id', component: PostDetailComponent },

    // post explorer / search
    { path: 'explore', component: PostExplorerComponent },

    // category landing (filtered by story type)
    { path: 'category/:story', component: PostExplorerComponent },

    // legacy landing page for comparison
    { path: 'legacy', component: LandingComponent },

    { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] },
    { path: 'admin/editor', component: AdminEditorComponent, canActivate: [AuthGuardService] },
    { path: 'admin/manage', component: AdminManageComponent, canActivate: [AuthGuardService] },
    { path: 'admin/login', component: AdminLoginComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }