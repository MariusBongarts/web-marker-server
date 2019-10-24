import { Mark } from './../marks/mark.interface';
import { Bookmark } from './bookmark.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel('Bookmark') private bookmarkModel: Model<Bookmark>
  ) { }

  async getBookmarksForUser(user: JwtPayload) {
    return await this.bookmarkModel.find({ _user: user._id }).exec();
  }

  async getBookmarkForUrl(user: JwtPayload, url: string) {
    return await this.bookmarkModel.findOne({ _user: user._id, url: url }).exec();
  }

  async findBookmarkById(user: JwtPayload, bookmarkId: string) {
    return await this.bookmarkModel.findOne({ _user: user._id, _id: bookmarkId }).exec();
  }

  // Creates a bookmark if no bookmark for url exists
  async createBookmarkIfNotExists(user: JwtPayload, bookmark: Bookmark) {
    const existingBookmark = await this.getBookmarkForUrl(user, bookmark.url);
    if (!existingBookmark) {
      const createdBookmark = new this.bookmarkModel(bookmark);
      createdBookmark._user = user._id;
      return await createdBookmark.save();
    } else {
      return existingBookmark;
    }
  }

  async deleteBookmark(user: JwtPayload, markId: string) {
    return await this.bookmarkModel.deleteOne({ _user: user._id, id: markId });
  }

  async updateBookmark(user: JwtPayload, bookmark: Bookmark) {
    return await this.bookmarkModel.updateOne({ _user: user._id, id: bookmark.id }, bookmark);
  }

  /**
   * Creates a bookmark for the created mark
   *
   * @memberof BookmarksService
   */
  createBookMarkFromMark(mark: Mark) {
    return {
      id: uuid(),
      createdAt: mark.createdAt,
      url: mark.url,
      isStarred: false,
      tags: [],
      title: mark.title,
      origin: mark.origin
    } as Bookmark;
  }
}
