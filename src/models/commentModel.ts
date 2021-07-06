import {
    IsString,
} from 'class-validator';

export default class CommentModel {
    @IsString()
    message: string;

    constructor(source: Partial<CommentModel>) {
        Object.assign(this, source);
    }
}
