import { ModuleRef } from '@nestjs/core';
import { MarksService } from './../marks/marks.service';
import { Mark } from './../marks/mark.interface';
import { Bookmark } from './bookmark.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, forwardRef, Inject, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BookmarksService implements OnModuleInit {
  private markService: MarksService;
  constructor(
    @InjectModel('Bookmark') private bookmarkModel: Model<Bookmark>,
    private readonly moduleRef: ModuleRef
  ) { }

  onModuleInit() {
    this.markService = this.moduleRef.get(MarksService, { strict: false });
  }

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

  async deleteBookmark(user: JwtPayload, bookmarkId: string) {
    return await this.bookmarkModel.deleteOne({ _user: user._id, _id: bookmarkId });
  }

  /**
   * Updates bookmark unless isStarred attribute changed to false AND there are no marks for this bookmark
   *
   * @param {JwtPayload} user
   * @param {Bookmark} bookmark
   * @returns
   * @memberof BookmarksService
   */
  async updateBookmark(user: JwtPayload, bookmark: Bookmark) {

    // Secure that tags are distinct
    bookmark.tags = [...new Set([...bookmark.tags])];

    // Find bookmark in database to get ObjectId
    const oldBookmark = await this.bookmarkModel.findOne({ _user: user._id, id: bookmark.id }).exec();

    let marksForBookmark;

    if (oldBookmark) {
      marksForBookmark = await this.markService.getMarksForBookmarkId(user, oldBookmark._id);
    }

    // If no marks for bookmark and it is not starred, it will be deleted
    if (oldBookmark && (!marksForBookmark || marksForBookmark.length === 0) && !bookmark.isStarred) {
      await this.deleteBookmark(user, oldBookmark._id);
    } else {
      return await this.bookmarkModel.updateOne({ _user: user._id, id: bookmark.id }, bookmark);
    }
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
