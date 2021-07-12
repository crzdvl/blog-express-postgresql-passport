import {
    IsString,
} from 'class-validator';

export default class FollowModel {
    @IsString()
    userId: string;

    @IsString()
    bloggerId: string;

    constructor(source: Partial<FollowModel>) {
        Object.assign(this, source);
    }
}
