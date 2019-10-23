import { Entity } from './../models/entity';

export interface Bookmark extends Entity {
  _user?: string;
  isStarred: boolean;
  origin: string;
  tags: string[];
  title: string;
  url: string;
}
