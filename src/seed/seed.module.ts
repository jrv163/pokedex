import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { PokemonModule } from 'src/pokemon/pokemon.module';


@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    PokemonModule  // importamos el Pokemon Module
  ]
})
export class SeedModule {}
