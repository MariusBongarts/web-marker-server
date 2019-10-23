import { Directory } from './directory.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';

@Injectable()
export class DirectoryService {
  constructor(
    @InjectModel('Directory') private directoryModel: Model<Directory>
    ) { }

  async getDirectoriesForUser(user: JwtPayload) {
    return await this.directoryModel.find({ _user: user._id }).exec();
  }

  async getDirectoryById(user: JwtPayload, directoryId: string) {
    return await this.directoryModel.findOne({ _user: user._id, id: directoryId }).exec();
  }

  // Creates a bookmark if no bookmark for url exists
  async createDirectory(user: JwtPayload, directory: Directory) {
    const createdDirectory = new this.directoryModel(directory);
    createdDirectory._user = user._id;
    return await createdDirectory.save();
  }

  async deleteDirectory(user: JwtPayload, directoryId: string) {
    return await this.directoryModel.deleteOne({ _user: user._id, id: directoryId });
  }

  async updateDirectory(user: JwtPayload, directory: Directory) {
    return await this.directoryModel.updateOne({ _user: user._id, id: directory.id }, directory);
  }
}
