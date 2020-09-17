import { TemplateFormComponent } from './template-form.component';
import { SharedModule } from './../shared/shared.module';
//import { FormDebugComponent } from './../shared/form-debug/form-debug.component';
//import { CampoControlErroComponent } from './../shared/campo-control-erro/campo-control-erro.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormDebugComponent } from '../shared/form-debug/form-debug.component';

@NgModule({
  declarations: [
    TemplateFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class TemplateFormModule { }
