import { JwtPayload } from './../../dist/auth/interfaces/jwt-payload.interface.d';
import { UserJwt } from './../users/decorators/email.decorator';
import { AuthGuard } from '@nestjs/passport';
import { TagService } from './tag.service';
import { Controller, Logger, Get, UseGuards, Req, Put, Body } from '@nestjs/common';

@Controller('tags')
export class TagController {
  private logger = new Logger('TagController');

  constructor(
    private tagService: TagService) {
  }

  @Get('')
  @UseGuards(AuthGuard())
  async getTags(@UserJwt() userJwt: JwtPayload, @Req() req) {
    const tags = await this.tagService.geTagsForUser(userJwt);
    this.logger.log(`${userJwt.email} loaded ${tags.length} tags.`);
    return tags;
  }

  @Put('')
  @UseGuards(AuthGuard())
  async updateTag(@UserJwt() userJwt: JwtPayload, @Body() tag, @Req() req) {
    this.logger.log(`${userJwt.email} updated tag ${tag.name}.`);
    return await this.tagService.updateTag(userJwt, tag);
  }

}
