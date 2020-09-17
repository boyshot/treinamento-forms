import { VerificaEmailService } from './services/verifica-email.service';
import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DropdowService } from '../shared/services/dropdow.service';
import { IEstadoBr } from '../shared/models/estado.br';
import { FormValidations } from '../shared/form-validation';
import { map, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade';
import { empty } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent {

  //formulario: FormGroup;
  estados: IEstadoBr[] = [];
  cidades: Cidade[] = [];
  cargos: any[];
  tecnologias: any[];
  newsLetterOp: any[];

  frameworks = ['Angular', 'React', 'Vue', 'Flutter'];


  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private dropDownService: DropdowService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService) {
    super();
  }

  ngOnInit(): void {

    //this.verificaEmailService.verificarEmail('').subscribe();

    this.cargos = this.dropDownService.getCargos();
    this.tecnologias = this.dropDownService.getTecnologias();

    this.dropDownService.getEstadoBr().subscribe(
      (estadosbr: IEstadoBr[]) => {
        this.estados = estadosbr;
      }
    )

    this.newsLetterOp = this.dropDownService.getNewsLetter();
    //this.dropDownService.getEstadoBr().subscribe((res: IEstadoBr)=>{     
    //  this.estados.push(res);   
    //});

    //console.log(this.estados);

    /*OLD
    this.dropDownService.getEstadosBr().
    subscribe(dados => {this.estados = dados});

    }); */


    /*
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    }); */

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.min(3), Validators.max(20)]],
      email: [null, [Validators.email, Validators.required], [this.validarEmail.bind(this)]],
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, [Validators.required]],
        complemento: [null],
        rua: [null, [Validators.required]],
        bairro: [null, [Validators.required]],
        cidade: [null, [Validators.required]],
        estado: [null, [Validators.required]]
      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.requiredTrue],
      frameworks: this.buildFrameworks()
    });


    /*
        this.formulario.get('endereco.cep').statusChanges
        .pipe(
          distinctUntilChanged(),
          tap(value => console.log('status CEP:', value))
        )
        .subscribe(
          status => {
            if(status === 'VALID'){
              this.consultaCEP()
            }
          }); */

    this.formulario.get('endereco.cep').statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(value => console.log('status CEP:', value)),
        switchMap(status => status === 'VALID' ?
          this.cepService.consultaCEP(this.formulario.get('endereco.cep').value) :
          empty())
      )
      .subscribe(
        dados => dados ? this.populaDadosForm(dados) : {});

    this.formulario.get('endereco.estado').valueChanges
      .pipe(
        tap(estado => console.log('Novo estado: ', estado)),
        map(estado => this.estados.filter(e => e.sigla === estado)),
        map(estados => estados && estados.length > 0 ? estados[0].id : empty()),
        switchMap((estadoId: number) => this.dropDownService.getCidades(estadoId))
      )
      .subscribe(
        (cidades: Cidade[]) => {
          this.cidades = cidades;
        }
      );
  }

  buildFrameworks() {

    const values = this.frameworks.map(v => new FormControl(false));

    //return this.formBuilder.array(values, this.requiredMinCheckbox(1));
    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));


    /*
     return [
       new FormControl(false),
       new FormControl(false),
       new FormControl(false),
       new FormControl(false),
     ]; */
  }


  submit() {

    let valueSubmit = Object.assign({}, this.formulario.value);
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v, i) => v ? this.frameworks[i] : null)
        .filter(v => v !== null)
    });

    console.log(this.formulario);

    this.http
      .post('https://httpbin.org/post',
        JSON.stringify(this.formulario.value))
      .subscribe(
        dados => {
          this.resetar();
        },
        (error: any) => alert('erro')
      );

    this.formulario.reset();
  }


  /*
    onSubmit() {
      //console.log(this.formulario);
  
      let valueSubmit = Object.assign({}, this.formulario.value);
      valueSubmit = Object.assign(valueSubmit, {
        frameworks: valueSubmit.frameworks
          .map((v, i) => v ? this.frameworks[i] : null)
          .filter(v => v !== null)
      });
  
      //console.log(valueSubmit);
  
      console.log(this.formulario);
  
  
      if (this.formulario.valid) {
        this.http
          .post('https://httpbin.org/post',
            JSON.stringify(this.formulario.value))
          .subscribe(
            dados => {
              //console.log(dados);
              // reseta o form
              // this.formulario.reset();
              this.resetar();
            },
            (error: any) => alert('erro')
          );
  
        this.formulario.reset();
      }
      else {
  
        this.verificarCamposIncorretos(this.formulario);
      }
    }
  
    verificarCamposIncorretos(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(campo => {
        //console.log(campo);
        const controle = formGroup.get(campo);
        controle.markAsTouched();
  
        if (controle instanceof FormGroup) {
          this.verificarCamposIncorretos(controle);
        }
      });
    } */

  verificaValidTouched(campo: string): Boolean {
    //console.log('Verificar obj campo');
    //console.log(this.formulario.get(campo));

    return !this.formulario.get(campo)?.valid &&
      this.formulario.get(campo)?.touched;
    //return !campo.valid && campo.touched;
  }

  aplicaCssErro(campo: string) {
    let campoValido: Boolean = this.verificaValidTouched(campo);
    return { 'has-error': campoValido, 'has-feedback': campoValido };
  }

  //resetar() {
  //  this.formulario.reset();
  //}

  verificaEmailInvalido() {

    let campoEmail = this.formulario.get('email');

    if (campoEmail.errors) {
      return campoEmail.errors['email'] &&
        campoEmail.touched;
    }
  }


  consultaCEP() {

    let cep = this.formulario.get('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep).
        subscribe(dados => this.populaDadosForm(dados));
    }

    /*
    // Nova variável "cep" somente com dígitos.
    let cep = this.formulario.get('endereco.cep').value;

    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {

      // Nova variável "cep" somente com dígitos.
      cep = cep.replace(/\D/g, '');

      // Verifica se campo cep possui valor informado.
      if (cep !== '') {
        // Expressão regular para validar o CEP.
        const validacep = /^[0-9]{8}$/;

        // Valida o formato do CEP.
        if (validacep.test(cep)) {
          //this.resetar();
          this.http.get(`//viacep.com.br/ws/${cep}/json`)
            .subscribe(dados => this.populaDadosForm(dados));
        }
      }
    }*/
  }

  populaDadosForm(dados) {

    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  SetarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pleno' };
    this.formulario.get('cargo').setValue(cargo);

  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2 ?
      (obj1.nome === obj2.nome && obj1.desc === obj2.desc) :
      obj1 === obj2;
  }

  SetarTecnologia() {
    this.formulario.get('tecnologias').setValue(
      ['java', 'javascript', 'ruby']
    );

  }

  requiredMinCheckbox(min = 1) {
    /*
    const validator = (formArray: FormArray) => {

      const values = formArray.controls;
      let totalChecked = 0;

      for (let i = 0; i < values.length; i++) {

        if (values[i].value)
          totalChecked++;
      }
      
      return totalChecked >= min ? null : { required: true };
    }; */

    const validator = (formArray: FormArray) => {

      const totalChecked = formArray.controls
        .map(v => v.value)
        .reduce((total, current) =>
          current ? total + current : total, 0);
      return totalChecked >= min ? null : { required: true };
    };

    return validator;
  }

  validarEmail(formControl: FormControl) {
    return this.verificaEmailService.verificarEmail(formControl.value).pipe(
      map(emailExiste => emailExiste ? { emailINvalido: true } : null)
    );
  }
}
