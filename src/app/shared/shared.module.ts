import { FormDebugComponent } from './form-debug/form-debug.component';
import { CampoControlErroComponent } from './campo-control-erro/campo-control-erro.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdowService } from './services/dropdow.service';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { BaseFormComponent } from './base-form/base-form.component';

@NgModule({
  declarations: [
    CampoControlErroComponent,
    FormDebugComponent,
    ErrorMsgComponent,
    InputFieldComponent
    //CampoControlErroComponent,
    //FormDebugComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CampoControlErroComponent,
    FormDebugComponent,
    ErrorMsgComponent,
    InputFieldComponent
  ],
  providers: [
    DropdowService
  ]
})
export class SharedModule { }
