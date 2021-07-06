import {
    IsString,
} from 'class-validator';

export default class CommentModel {
    @IsString()
    message: string;

    @IsString()
    userId: number;

    @IsString()
    postId: number;

    constructor(source: Partial<CommentModel>) {
        Object.assign(this, source);
    }
}
