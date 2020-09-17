import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent implements OnInit {

  formulario: FormGroup;

  constructor() { }

  ngOnInit(): void {}

  abstract submit();

  onSubmit() {
    if (this.formulario.valid){
      this.submit();
    } else {
      this.verificarCamposIncorretos(this.formulario);
    }
  }

  private verificarCamposIncorretos(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(campo => {
      //console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsTouched();
      controle.markAsTouched();

      if (controle instanceof FormGroup || controle instanceof FormArray ) {
        this.verificarCamposIncorretos(controle);
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }
}
