import { MarksModule } from './../marks/marks.module';
import { MarksService } from './../marks/marks.service';
import { UsersModule } from './../users/users.module';
import { BookmarkSchema } from './bookmark.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BookmarksController } from './bookmarks.controller';
import { Module, forwardRef } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bookmark', schema: BookmarkSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UsersModule,
    forwardRef(() => MarksModule)
  ],
  exports: [BookmarksService],
  providers: [BookmarksService],
  controllers: [BookmarksController]
})
export class BookmarksModule {}
