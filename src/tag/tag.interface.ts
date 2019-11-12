import { Document} from 'mongoose';
export interface Tag extends Document {
  name: string;
  _user?: string;
  _directory?: string;
}
