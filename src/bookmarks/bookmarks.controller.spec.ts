import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksController } from './bookmarks.controller';

describe('Bookmarks Controller', () => {
  let controller: BookmarksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
