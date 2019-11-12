import { JwtPayload } from './../../dist/auth/interfaces/jwt-payload.interface.d';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from './tag.interface';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TagService {
  private logger = new Logger('TagsService');

  constructor(
    @InjectModel('Tag') private tagModel: Model<Tag>,
  ) { }

  async geTagsForUser(user: JwtPayload) {
    return await this.tagModel.find({ _user: user._id }).exec();
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
