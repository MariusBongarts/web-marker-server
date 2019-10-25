import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { UserJwt } from './../users/decorators/email.decorator';
import { UsersService } from './../users/users.service';
import { BookmarksService } from './bookmarks.service';
import { Controller, Get, Post, Body, UseGuards, Req, Delete, Param, Put, Query, Logger } from '@nestjs/common';

@Controller('bookmarks')
export class BookmarksController {
  private logger = new Logger('BookmarksController');

  constructor(
    private bookmarkService: BookmarksService,
    private usersService: UsersService) {
  }

  @Get('')
  @UseGuards(AuthGuard())
  async getBookmarks(@UserJwt() userJwt: JwtPayload, @Req() req) {
    const bookmarks = await this.bookmarkService.getBookmarksForUser(userJwt);
    this.logger.log(`${userJwt.email} loaded ${bookmarks.length} bookmarks.`);
    return bookmarks;
  }

  @Get('/url')
  @UseGuards(AuthGuard())
  async getBookmarkForUrl(@UserJwt() userJwt: JwtPayload, @Query() query) {
    const bookmark = await this.bookmarkService.getBookmarkForUrl(userJwt, query.url);
    this.logger.log(`${userJwt.email} loaded ${bookmark} marks from ${query.url}.`);
    return bookmark;
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getBookmarkById(@UserJwt() userJwt: JwtPayload, @Param('id') bookmarkId, @Req() req) {
    const bookmark = await this.bookmarkService.findBookmarkById(userJwt, bookmarkId);
    this.logger.log(`${userJwt.email} loaded bookmark ${bookmark.id} from ${req.get('origin')}.`);
    return bookmark;
  }

  @Post('')
  @UseGuards(AuthGuard())
  async createBookmark(@UserJwt() userJwt: JwtPayload, @Body() bookmark, @Req() req) {
    const createdBookmark = await this.bookmarkService.createBookmarkIfNotExists(userJwt, bookmark);
    this.logger.log(`${userJwt.email} created bookmark ${bookmark.id}.`);
    return createdBookmark;
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteBookmark(@UserJwt() userJwt: JwtPayload, @Param('id') bookmarkId, @Req() req) {
    const deletedMark = await this.bookmarkService.deleteBookmark(userJwt, bookmarkId);
    this.logger.log(`${userJwt.email} deleted bookmark ${bookmarkId}.`);
    return deletedMark;
  }

  @Put('')
  @UseGuards(AuthGuard())
  async updateBookmark(@UserJwt() userJwt: JwtPayload, @Body() bookmark, @Req() req) {
    this.logger.log(`${userJwt.email} updated bookmark ${bookmark.id}.`);
    return await this.bookmarkService.updateBookmark(userJwt, bookmark);
  }

}
