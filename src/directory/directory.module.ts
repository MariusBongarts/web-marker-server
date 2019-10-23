import { DirectorySchema } from './directory.schema';
import { DirectoryController } from './directory.controller';
import { UsersModule } from './../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { DirectoryService } from './directory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Directory', schema: DirectorySchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UsersModule
  ],
  exports: [DirectoryService],
  providers: [DirectoryService],
  controllers: [DirectoryController]
})
export class DirectoryModule {}
