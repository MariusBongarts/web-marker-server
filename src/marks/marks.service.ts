import { BookmarksService } from './../bookmarks/bookmarks.service';
import { MarkGateway } from './mark.gateway';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { User } from './../users/user.interface';
import { Mark } from './mark.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class MarksService {
  constructor(
    @InjectModel('Mark') private markModel: Model<Mark>,
    private bookmarkService: BookmarksService,
    private markGateway: MarkGateway
    ) { }

  async getMarksForUser(user: JwtPayload) {
    return await this.markModel.find({ _user: user._id }).exec();
  }

  async getMarksForUrl(user: JwtPayload, url: string) {
    return await this.markModel.find({ _user: user._id, url: url }).exec();
  }

  async findMarkById(user: JwtPayload, markId: string) {
    return await this.markModel.findOne({ _user: user._id, id: markId });
  }

  /**
   * Creates Mark and a bookmark if it does not exist.
   * Saves the bookmark as a foreign key in mark
   *
   * @param {JwtPayload} user
   * @param {Mark} mark
   * @returns
   * @memberof MarksService
   */
  async createMark(user: JwtPayload, mark: Mark) {
    const createdMark = new this.markModel(mark);
    createdMark._user = user._id;
    const bookmark = await this.bookmarkService.createBookmarkIfNotExists(user, mark.bookmark);
    createdMark._bookmark = bookmark._id;
    return await createdMark.save();
  }

  async deleteMark(user: JwtPayload, markId: string) {
    return await this.markModel.deleteOne({ _user: user._id, id: markId });
  }

  async updateMark(user: JwtPayload, mark: Mark) {
    return await this.markModel.updateOne({ _user: user._id, id: mark.id }, mark);
  }
}
