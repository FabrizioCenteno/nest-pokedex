import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interace';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axiosAdapter:AxiosAdapter
  ) {}

  async generate() {
    const pokemonToInsert:{name:string,no:number}[] = [];

    await this.pokemonModel.deleteMany();

    const data  = await this.axiosAdapter.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );


    data.results.forEach( ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      
      // const pokemon = await this.pokemonModel.create({ name, no });

      pokemonToInsert.push(
        {name:name, no:no}
      )

    });
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'seed executed';
  }
}
