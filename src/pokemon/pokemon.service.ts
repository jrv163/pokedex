import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      
      this.handleExceptions( error )

    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }



  async findOne(term: string) {

    let pokemon = null; // let pokemon va a ser de tipo entity o null si no encuentra el documento de mongoose

    if (!isNaN(+term)) { // si term es un número
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    // MONGO ID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // NAME
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }


    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no ${term} not found`)


    return pokemon;
  }



  // para hacer la actualización, primero se debe consultar si ya existe el pokemon. Y para eso tenemos el findOune que hace todas esas validaciones
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.pokemonModel.findById(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {

      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      // console.log(error)

      this.handleExceptions( error )

    }


  }

  async remove(id: string) {
    
    // const pokemon = await this.pokemonModel.findById( term ); // se deberia usar el findOne para usar las validaciones del s

    // try {
    //   await pokemon.deleteOne();
    // } catch (error) {
    //   throw new BadRequestException(`Pokemon with Id, name or no ${ term } does not exist in DB`)
    // }
    // return { term }
    // const deletedPokemon = await this.pokemonModel.findByIdAndDelete( term );

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 )
        throw new BadRequestException(`Pokemon with id ${ id } not found`)


    return ;
  }



  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists un db ${JSON.stringify(error.keyValue)}`);
    }

    console.log(error);
    throw new InternalServerErrorException('Error creating pokemon - check server logs');

  }
}
