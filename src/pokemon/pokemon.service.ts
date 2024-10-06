import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultlimit:number

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>,
    private readonly configService:ConfigService,

  ) {
    this.defaultlimit = this.configService.get<number>('defaultlimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try{

      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
   
    }catch(error){
      this.handleException(error);
    }

  }

  findAll( paginationDto:PaginationDto ) {
    const { limit = this.defaultlimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find().limit(limit).skip(offset).sort({ no:1 }).select('-__v');
  }

  async findOne(term: string) {
    let pokemon:Pokemon;

    if(!isNaN(+term)) pokemon = await this.pokemonModel.findOne({no: term});

    // mongoid
    if (isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term);

    //name
    if(!pokemon) pokemon = await this.pokemonModel.findOne({name: term});

    if(!pokemon) throw new NotFoundException(`pokemon with id, name or no ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if( updatePokemonDto.name ) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try{
      await pokemon.updateOne( updatePokemonDto );
      return {...pokemon.toJSON(), ...updatePokemonDto };
    }catch(error){
      this.handleException(error);
    }

  }

  async remove(id: string) {
    // const pokemon  = await this.findOne(term);
    // await pokemon.deleteOne();
    const {deletedCount, acknowledged} =  await this.pokemonModel.deleteOne( {_id: id } );
    if( deletedCount === 0 ) throw new BadRequestException(`pokemon with id "${ id }" not found`);
    return {deletedCount, acknowledged};
  }

  private handleException(error:any){
    if(error.code === 11000) throw new BadRequestException(`pokemon exists in db ${JSON.stringify(error.keyValue)}`)
      console.log(error);
    throw new InternalServerErrorException('cant create pokedex - check server logs');
  }
}
