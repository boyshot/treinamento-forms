
import { FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { identifierModuleUrl } from '@angular/compiler';

export class FormValidations {

  static requiredMinCheckbox(min = 1) {

    const validator = (formArray: FormArray) => {

      const totalChecked = formArray.controls
        .map(v => v.value)
        .reduce((total, current) =>
          current ? total + current : total, 0);
      return totalChecked >= min ? null : { required: true };
    };

    return validator;
  }

  static cepValidator(control: FormControl) {

    //const cep = control.value.replace(/\D/g, '');
    const cep = control.value;

    if (cep && cep !== '') {

      const cepSemDigito = cep.replace(/\D/g, '');

      const validacep = /^[0-9]{8}$/;
      return validacep.test(cepSemDigito) ? null : { cepInvalido: true };
    }
    return null;
  }

  static equalsTo(otherField: string) {
    const validator = (formControl: FormControl) => {

      if (otherField == null)
        throw new Error('É obrigatório informar um campo.');

      if (!formControl.root || !(<FormGroup>formControl.root).controls)
        return null;

      const field = (<FormGroup>formControl.root).get(otherField);

      if (!field)
        throw new Error('É obrigatório informar um campo valido.');

      if (field.value !== formControl.value)
        return { equalsTo: otherField }

      return null;
    };

    return validator;
  }


  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any){
    const config = {
      'required': `${fieldName} é Obrigatório.`,
      'minlength': `${fieldName} precisa ter no minimo ${validatorValue.requiredLength} caracteres.`,
      'maxlength': `${fieldName} precisa ter no maximo ${validatorValue.requiredLength} caracteres.`,
      'cepInvalido': 'CEP inválido.'
    };

    return config[validatorName];
  }
}