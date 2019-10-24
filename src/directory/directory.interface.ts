import { Document} from 'mongoose';
export interface Directory extends Document {
  id: string;
  createdAt: number;
  _user?: string;
  _directory?: string;
  _parentDirectory?: string;
  name: string;
}
