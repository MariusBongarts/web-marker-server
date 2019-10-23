import { UsersService } from './../users/users.service';
import { JwtPayload } from './../../dist/auth/interfaces/jwt-payload.interface.d';
import { UserJwt } from './../users/decorators/email.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Body, UseGuards, Req, Delete, Param, Put, Query, Logger } from '@nestjs/common';
import { DirectoryService } from './directory.service';

@Controller('directory')
export class DirectoryController {
  private logger = new Logger('BookmarksController');

  constructor(
    private directoryService: DirectoryService,
    private usersService: UsersService) {
  }

  @Get('')
  @UseGuards(AuthGuard())
  async getDirectories(@UserJwt() userJwt: JwtPayload, @Req() req) {
    const directories = await this.directoryService.getDirectoriesForUser(userJwt);
    this.logger.log(`${userJwt.email} loaded ${directories.length} directories.`);
    return directories;
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getDirectoryById(@UserJwt() userJwt: JwtPayload, @Param('id') directoryId, @Req() req) {
    const directory = await this.directoryService.getDirectoryById(userJwt, directoryId);
    this.logger.log(`${userJwt.email} loaded directory ${directory.name} from ${req.get('origin')}.`);
    return directory;
  }

  @Post('')
  @UseGuards(AuthGuard())
  async createDirectory(@UserJwt() userJwt: JwtPayload, @Body() directory, @Req() req) {
    const createdDirectory = await this.directoryService.createDirectory(userJwt, directory);
    this.logger.log(`${userJwt.email} created directory ${directory.name}.`);
    return createdDirectory;
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteDirectory(@UserJwt() userJwt: JwtPayload, @Param('id') directoryId, @Req() req) {
    const deletedDirectory = await this.directoryService.deleteDirectory(userJwt, directoryId);
    this.logger.log(`${userJwt.email} deleted bookmark ${deletedDirectory.name}.`);
    return deletedDirectory;
  }

  @Put('')
  @UseGuards(AuthGuard())
  async updateDirectory(@UserJwt() userJwt: JwtPayload, @Body() directory, @Req() req) {
    this.logger.log(`${userJwt.email} updated bookmark ${directory.name}.`);
    return await this.directoryService.updateDirectory(userJwt, directory);
  }

}
