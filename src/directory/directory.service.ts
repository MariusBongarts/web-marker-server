import { TagService } from './../tag/tag.service';
import { ModuleRef } from '@nestjs/core';
import { Directory } from './directory.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';

@Injectable()
export class DirectoryService {
  private logger = new Logger('DirectoryService');
  private tagsService: TagService;

  constructor(
    @InjectModel('Directory') private directoryModel: Model<Directory>,
    private readonly moduleRef: ModuleRef
  ) { }

  onModuleInit() {
    this.tagsService = this.moduleRef.get(TagService, { strict: false });
  }

  async getDirectoriesForUser(user: JwtPayload) {
    let directories = await this.directoryModel.find({ _user: user._id }).exec();
    directories = await this.removeParentDirectoryIfNotExists(user, directories);
    return directories;
  }

  async getDirectoryById(user: JwtPayload, directoryId: string) {
    return await this.directoryModel.findOne({ _user: user._id, _id: directoryId }).exec();
  }

  // Creates a bookmark if no bookmark for url exists
  async createDirectory(user: JwtPayload, directory: Directory) {
    const createdDirectory = new this.directoryModel(directory);
    createdDirectory._user = user._id;
    return await createdDirectory.save();
  }

  /**
   * Deletes directory and all subDirectories
   *
   * @param {JwtPayload} user
   * @param {string} directoryId
   * @returns
   * @memberof DirectoryService
   */
  async deleteDirectory(user: JwtPayload, directoryId: string) {
    const subDirectories = await this.directoryModel.find({ _user: user._id, _parentDirectory: directoryId }).exec();
    for (const directory of subDirectories) {
      await this.directoryModel.deleteOne({ _user: user._id, _id: directory._id });
    }

    // Update related tags. We don´t need to wait for this to finish.
    this.tagsService.removeDirectoryIfNotExists(user);

    return await this.directoryModel.deleteOne({ _user: user._id, _id: directoryId });
  }

  async updateDirectory(user: JwtPayload, directory: Directory) {
    // Directories must not have same id and parentId
    if (directory._parentDirectory === directory._id) {
      directory._parentDirectory = '';
    }
    return await this.directoryModel.updateOne({ _user: user._id, id: directory.id }, directory);
  }

  /**
   * Checks if directory has parent directory which is not existing anymore
   *
   * @param {JwtPayload} user
   * @param {Directory[]} directories
   * @memberof DirectoryService
   */
  async removeParentDirectoryIfNotExists(user: JwtPayload, directories: Directory[]) {
    try {

      // Check if directory´s parent directory is still existing, if not it will be deleted
      for (const directory of directories) {
        if (directory._parentDirectory) {

          const directoryExists = await this.getDirectoryById(user, directory._parentDirectory);

          // tslint:disable-next-line: triple-equals
          if (!directoryExists || directory._id == directory._parentDirectory) {
            directory._parentDirectory = '';
            await this.updateDirectory(user, directory);
            this.logger.warn(`Deleted parent directory for ${directory.name} because it did not exist anymore.`);
          }
        }
      }

    } catch (error) {
      //
    }
    return directories;
  }
}
