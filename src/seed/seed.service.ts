import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios; // creamos una dependencia en el servicio

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}


  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // delete * from pokemons

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    // const insertPromisesArray = [];  // multiple inserción, pero son 650 insersiones

    // data.results.forEach(({ name, url }) => {
    //       // console.log({ name, url })
    //        const segments = url.split('/');    // console.log(segments) //cortamos la URL o lo separamos por el slash
    //        const no = +segments[ segments.length  - 2 ]; // selecionamos la penultima posición
    //       //  console.log({ name, no });

    //       // const pokemon = await this.pokemonModel.create({ name, no });
    //       insertPromisesArray.push(
    //          this.pokemonModel.create({ name, no })
    //       )
      
    // });

    // await Promise.all( insertPromisesArray );

    const PokemonToInsert: { name: string, no: number }[] = [];  // en una sola inserción se obtiene toda la data

    data.results.forEach(({ name, url }) => {
          // console.log({ name, url })
           const segments = url.split('/');    // console.log(segments) //cortamos la URL o lo separamos por el slash
           const no = +segments[ segments.length  - 2 ]; // selecionamos la penultima posición
          //  console.log({ name, no });

          // const pokemon = await this.pokemonModel.create({ name, no });
          PokemonToInsert.push(({ name, no }));  // tendríamos un arreglo [{ name: bulvasaur, no: 1 }]
      
    });

    await this.pokemonModel.insertMany( PokemonToInsert );
    
    return 'Seed Executed';
  }
  
}
