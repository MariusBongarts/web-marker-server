import { Bookmark } from './../bookmarks/bookmark.interface';
import * as mongoose from 'mongoose';

export const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // Reference of mongoose throws error when deleting ref
  _directory: String,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
