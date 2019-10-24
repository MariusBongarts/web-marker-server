import { BookmarksService } from './../bookmarks/bookmarks.service';
import { MarkGateway } from './mark.gateway';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { User } from './../users/user.interface';
import { Mark } from './mark.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class MarksService implements OnModuleInit {
  private bookmarkService: BookmarksService;

  constructor(
    @InjectModel('Mark') private markModel: Model<Mark>,
    private markGateway: MarkGateway,
    private readonly moduleRef: ModuleRef
  ) { }

  onModuleInit() {
    this.bookmarkService = this.moduleRef.get(BookmarksService, { strict: false });
  }

  async getMarksForUser(user: JwtPayload) {
    return await this.markModel.find({ _user: user._id }).exec();
  }

  async getMarksForUrl(user: JwtPayload, url: string) {
    return await this.markModel.find({ _user: user._id, url: url }).exec();
  }

  async getMarksForBookmarkId(user: JwtPayload, bookmarkId: string) {
    return await this.markModel.find({ _user: user._id, _bookmark: bookmarkId }).exec();
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
    const newBookmark = this.bookmarkService.createBookMarkFromMark(mark);
    const bookmark = await this.bookmarkService.createBookmarkIfNotExists(user, newBookmark);
    createdMark._bookmark = bookmark._id;
    return await createdMark.save();
  }

  /**
   * Deletes mark and checks if bookmark has to be deleted.
   * If bookmark has no marks anymore AND is not starred it can be deletes too.
   *
   * @param {JwtPayload} user
   * @param {string} markId
   * @returns
   * @memberof MarksService
   */
  async deleteMark(user: JwtPayload, markId: string) {
    const mark = await this.findMarkById(user, markId) as Mark;
    const deleteResult = await this.markModel.deleteOne({ _user: user._id, id: markId });
    await this.deleteBookmarkIfNoMarks(user, mark);
    return deleteResult;
  }

  async updateMark(user: JwtPayload, mark: Mark) {
    return await this.markModel.updateOne({ _user: user._id, id: mark.id }, mark);
  }

  /**
   *  Deletes a bookmark if there are no marks anymore, unless it is not starred
   *
   * @param {JwtPayload} user
   * @param {Mark} mark
   * @memberof MarksService
   */
  async deleteBookmarkIfNoMarks(user: JwtPayload, mark: Mark) {
    const marksForBookmark = await this.getMarksForBookmarkId(user, mark._bookmark);
    if (marksForBookmark.length === 0) {
      const bookmark = await this.bookmarkService.findBookmarkById(user, mark._bookmark);
      if (!bookmark.isStarred) {
        await this.bookmarkService.deleteBookmark(user, bookmark.id);
      }
    }
  }

}
