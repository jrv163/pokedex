import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios; // creamos una dependencia en el servicio


  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    data.results.forEach( ({ name, url }) => {
          // console.log({ name, url })
           const segments = url.split('/');    // console.log(segments) //cortamos la URL o lo separamos por el slash
           const no = +segments[ segments.length  - 2 ]; // selecionamos la penultima posición
           
           console.log({ name, no })
       
    })
    
    return data.results;
  }
  
}
