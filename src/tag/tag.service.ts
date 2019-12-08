import { Directory } from './../directory/directory.interface';
import { DirectoryService } from './../directory/directory.service';
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
  private directoryService: DirectoryService;

  constructor(
    @InjectModel('Tag') private tagModel: Model<Tag>,
    private readonly moduleRef: ModuleRef
  ) { }

  onModuleInit() {
    this.bookmarkService = this.moduleRef.get(BookmarksService, { strict: false });
    this.markService = this.moduleRef.get(MarksService, { strict: false });
    this.directoryService = this.moduleRef.get(DirectoryService, { strict: false });
  }

  async geTagsForUser(user: JwtPayload) {
    const tags = await this.tagModel.find({ _user: user._id }).exec();

    // This task can be done asynchronously so that we don´t have to wait for it
    this.removeTagsIfNoMarkOrBookmark(user);
    this.removeDirectoryIfNotExists(user);

    return tags;
  }

  /**
   * Checks if tag has directory which is not existing anymore
   *
   * @param {JwtPayload} user
   * @param {Tag[]} tags
   * @memberof TagService
   */
  async removeDirectoryIfNotExists(user: JwtPayload) {
    const tags = await this.tagModel.find({ _user: user._id }).exec();
    try {
      // Check if directory and parentDirectory is still existing of tag, if not they will be deleted
      for (const tag of tags) {
        if (tag._directory) {
          const directoryExists = await this.directoryService.getDirectoryById(user, tag._directory);
          if (!directoryExists) {
            const tagEntry = await this.findTagByName(user, tag.name);
            this.logger.warn(`Deleted directory ${tagEntry._directory} for tag ${tagEntry.name} because it´s not existing anymore.`);
            tagEntry._directory = '';
            await this.updateTag(user, tagEntry);
          }
        }
      }

    } catch (error) {
      //
    }
  }

  /**
   * Checks if tag has no marks or bookmarks anymore. If that´s the case, it will be deleted !except it is a tag for a directory
   *
   * @param {JwtPayload} user
   * @param {Tag[]} tags
   * @memberof TagService
   */
  async removeTagsIfNoMarkOrBookmark(user: JwtPayload) {
    const tags = await this.tagModel.find({ _user: user._id }).exec();
    try {
      const marks = await this.markService.getMarksForUser(user);
      const bookmarks = await this.bookmarkService.getBookmarksForUser(user);

      // Check if tag exists in any mark or bookmark. If not, it will be deleted
      for (const tag of tags) {
        if (
          !marks.some(mark => mark.tags.map(tag => tag.toLowerCase()).includes(tag.name.toLowerCase())) &&
          !bookmarks.some(bookmark => bookmark.tags.map(tag => tag.toLowerCase()).includes(tag.name.toLowerCase()))
        ) {
          const tagEntry = await this.findTagByName(user, tag.name);

          let directory;
          // Checks if it has a directory which name is the same of the name, then it will not be deleted
          if (tagEntry._directory) {
            directory = await this.directoryService.getDirectoryById(user, tagEntry._directory);
          }

          // Delete tag if directory is either not existing or name does not equal name, otherwise the tag should not be deleted
          if (!directory || directory.name !== tagEntry.name) {
            this.logger.log(`Deleted tag ${tagEntry.name} because there where no marks or bookmarks for this tag`);
            await tagEntry.remove();
          }
        }
      }

    } catch (error) {
      //
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


  /**
   * When a directory is created it will also be created a tag with the same name.
   * When the tag already exists, the directory of the tag will be set to directory
   *
   * @param {JwtPayload} user
   * @param {Directory} directory
   * @memberof TagService
   */
  async createTagForDirectory(user: JwtPayload, directory: Directory) {
    const existingTag = await this.findTagByName(user, directory.name);

    // Update directory of exisiting tag
    if (existingTag) {
      existingTag._directory = directory._id;
      await existingTag.save();
    }

    // Create a new tag if not existing yet
    if (!existingTag) {
      const newTag = {
        name: directory.name,
        _directory: directory._id,
        _user: user._id
      } as Tag;
      const createdTag = new this.tagModel(newTag);
      await createdTag.save();
      this.logger.log(`Created tag ${createdTag.name} for directory ${directory.name} and user ${user.email}`);
    }

  }

}
