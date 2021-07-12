import {
    IsString, ValidateIf,
} from 'class-validator';

export default class LikeModel {
    @IsString()
    userId: number;

    @IsString()
    @ValidateIf((o) => !o.postId)
    commentId: number;

    @IsString()
    @ValidateIf((o) => !o.commentId)
    postId: number;

    constructor(source: Partial<LikeModel>) {
        Object.assign(this, source);
    }
}
