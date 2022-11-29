import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//INICIO Servicios

import { CargarScriptsService } from "./services/cargar-scripts.service";

//FIN Servicios

import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { ResultFormComponent } from './components/result-form/result-form.component';
import { FormComponent } from './components/form/form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const rutas: Routes = [
  {
    path: '', 
    component: FormComponent
  },
  {
    path: 'result-form',
    component: ResultFormComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    ResultFormComponent,
    SafeUrlPipe,
    FormComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(rutas),
    NgbModule
  ],
  providers: [
    CargarScriptsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
