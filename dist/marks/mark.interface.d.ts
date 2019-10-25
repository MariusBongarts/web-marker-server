import { Document } from 'mongoose';
export interface Mark extends Document {
    id: string;
    createdAt: number;
    url: string;
    origin: string;
    text: string;
    tags: string[];
    anchorOffset: number;
    nodeTagName: string;
    startOffset: number;
    endOffset: number;
    nodeData: string;
    startContainerText: string;
    endContainerText: string;
    completeText: string;
    title: string;
    _user?: string;
    _directory?: string;
    _bookmark?: string;
    scrollY: number;
}
