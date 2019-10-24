import { Document} from 'mongoose';
export interface Bookmark extends Document {
  id: string;
  createdAt: number;
  _user?: string;
  _directory?: string;
  isStarred: boolean;
  origin: string;
  tags: string[];
  title: string;
  url: string;
}
