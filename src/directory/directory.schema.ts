import * as mongoose from 'mongoose';

export const DirectorySchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _directory: String,
    _parentDirectory: String,
    createdAt: Number,
    name: String
});
