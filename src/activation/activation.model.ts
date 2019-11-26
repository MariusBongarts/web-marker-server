import { Document} from 'mongoose';

export interface Activation extends Document{
  email: string,
  token: string
}