import { ModuleRef } from '@nestjs/core';
import { BookmarksService } from './../bookmarks/bookmarks.service';
import { MarksService } from './../marks/marks.service';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from './tag.interface';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TagService {
  private logger = new Logger('TagsService');
  private markService: MarksService;
  private bookmarkService: BookmarksService;

  constructor(
    @InjectModel('Tag') private tagModel: Model<Tag>,
    private readonly moduleRef: ModuleRef
  ) { }

  onModuleInit() {
    this.bookmarkService = this.moduleRef.get(BookmarksService, { strict: false });
    this.markService = this.moduleRef.get(MarksService, { strict: false });
  }

  async geTagsForUser(user: JwtPayload) {
    const tags = await this.tagModel.find({ _user: user._id }).exec();

    // This task can be done asynchronously so that we don´t have to wait for it
    this.removeTagsIfNoMarkOrBookmark(user, tags);

    return tags;
  }

  /**
   * Checks if tag has no marks or bookmarks anymore. If that´s the case, it will be deleted
   *
   * @param {JwtPayload} user
   * @param {Tag[]} tags
   * @memberof TagService
   */
  async removeTagsIfNoMarkOrBookmark(user: JwtPayload, tags: Tag[]) {
    const marks = await this.markService.getMarksForUser(user);
    const bookmarks = await this.bookmarkService.getBookmarksForUser(user);

    // Check if tag exists in any mark or bookmark. If not, it will be deleted
    for (const tag of tags) {
      if (
        !marks.some(mark => mark.tags.map(tag => tag.toLowerCase()).includes(tag.name.toLowerCase())) &&
        !bookmarks.some(bookmark => bookmark.tags.map(tag => tag.toLowerCase()).includes(tag.name.toLowerCase()))
      ) {
        const tagEntry = await this.findTagByName(user, tag.name);
        this.logger.warn(`Deleted tag ${tagEntry.name}`);
        await tagEntry.remove();
      }
    }

  }

  /**
   * Finds the tag case insensitively by name
   *
   * @param {JwtPayload} user
   * @param {string} tagName
   * @returns
   * @memberof TagService
   */
  async findTagByName(user: JwtPayload, tagName: string) {
    return await this.tagModel.findOne({
      _user: user._id, name:
        { $regex: new RegExp('^' + tagName.toLowerCase(), 'i') }
    });
  }

  async findTagById(user: JwtPayload, tagId: string) {
    return await this.tagModel.findOne({ _user: user._id, id: tagId });
  }

  async updateTag(user: JwtPayload, tag: Tag) {
    return await this.tagModel.updateOne({
      _user: user._id, name:
        { $regex: new RegExp('^' + tag.name.toLowerCase(), 'i') }
    }, tag);
  }

  async removeDirectoryFromTag(user: JwtPayload, tagName: string) {
    const tag = await this.findTagByName(user, tagName);
    tag._directory = undefined;
    await tag.save();
  }

  /**
   * Only create tag if it does not exist for user
   *
   * @param {JwtPayload} user
   * @param {string} tagName
   * @memberof TagService
   */
  async createTagIfNotExists(user: JwtPayload, tagName: string) {
    const existingTag = await this.findTagByName(user, tagName);
    if (!existingTag) {
      const newTag = {
        name: tagName,
        _user: user._id
      } as Tag;
      const createdTag = new this.tagModel(newTag);
      await createdTag.save();
      this.logger.log(`Created tag ${tagName} for user ${user.email}`);
    }
  }

}
