import { DirectoryModule } from './../directory/directory.module';
import { MarksModule } from './../marks/marks.module';
import { BookmarksModule } from './../bookmarks/bookmarks.module';
import { TagSchema } from './tag.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Module, forwardRef } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    forwardRef(() => BookmarksModule),
    forwardRef(() => MarksModule),
    forwardRef(() => DirectoryModule)
  ],
  exports: [TagService],
  providers: [TagService],
  controllers: [TagController]
})
export class TagModule {}
