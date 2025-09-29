import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { MatCommonModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { PostComponent } from './post/post.component';
import { AdminComponent } from './admin/admin.component';
import { StoryComponent } from './story/story.component';
import { NewspaperLandingComponent } from './newspaper-landing/newspaper-landing.component';
// Moved PostDetailComponent into dedicated `components` folder
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostExplorerComponent } from './post-explorer/post-explorer.component';
import { CodeSnippetDailyComponent } from './widgets/code-snippet-daily/code-snippet-daily.component';
import { GithubActivityComponent } from './widgets/github-activity/github-activity.component';
import { SpotifyActivityComponent } from './widgets/spotify-activity/spotify-activity.component';
import { PlantCareReminderComponent } from './widgets/plant-care-reminder/plant-care-reminder.component';
import { FormsModule } from '@angular/forms';
import { AdminEditorComponent } from './admin-editor/admin-editor.component';   // <-- Needed for ngModel in PostExplorer
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminManageComponent } from './admin-manage/admin-manage.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PostComponent,
    AdminComponent,
    StoryComponent,
    NewspaperLandingComponent,
    PostDetailComponent,
    PostExplorerComponent,
    CodeSnippetDailyComponent,
    GithubActivityComponent,
    SpotifyActivityComponent,
    PlantCareReminderComponent,
    AdminEditorComponent,
    AdminLoginComponent,
    AdminManageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatCommonModule,
    MatCardModule,
    FormsModule,          // <-- Two-way binding & template forms
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
