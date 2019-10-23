import { UsersModule } from './../users/users.module';
import { BookmarkSchema } from './bookmark.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BookmarksController } from './bookmarks.controller';
import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bookmark', schema: BookmarkSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UsersModule
  ],
  exports: [BookmarksService],
  providers: [BookmarksService],
  controllers: [BookmarksController]
})
export class BookmarksModule {}
