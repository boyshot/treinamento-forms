import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEstadoBr } from '../models/estado.br';
import { Cidade } from '../models/cidade';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DropdowService {

  constructor(private http: HttpClient) { }

  getEstadosBr_Old() {
    return this.http.get('assets/dados/estados.br.json')
      .subscribe((res: Response) => res.json());
  }

  getEstadoBr_old2() {
    return this.http.get<IEstadoBr>('assets/dados/estados.br.json').pipe();
  }


  getEstadoBr(): Observable<IEstadoBr[]> {
    return this.http.get<IEstadoBr[]>('assets/dados/estados.br.json');
  }

  getCargos() {
    return [
      { nome: 'Dev', nivel: 'Junior', desc: 'Dev Jr' },
      { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pleno' },
      { nome: 'Dev', nivel: 'Senior', desc: 'Dev Senior' },
    ];
  }

  getTecnologias(){
    return [
      {nome: 'java', desc: 'Java'},
      {nome: 'javascript', desc: 'JavaScript'},
      {nome: 'php', desc: 'PHP'},
      {nome: 'ruby', desc: 'Ruby'}];
  }

  getNewsLetter(){
    return [
      { valor: '1', desc: 'Sim' },
      { valor: '0', desc: 'Não' }
    ];
  }

  getCidades(idEstado: number){
    return this.http.get<Cidade[]>('assets/dados/cidades.json')
    .pipe(
      // tsLint:disable-next-line:triple-equals
      map((cidades: Cidade[]) => cidades.filter(c => c.estado == idEstado))
    )
  }
}
