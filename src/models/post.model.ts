import {
    IsString,
} from 'class-validator';

export default class PostModel {
    @IsString()
    title: string;

    @IsString()
    subtitle: string;

    @IsString()
    text: string;

    @IsString()
    bloggerId: number;

    constructor(source: Partial<PostModel>) {
        Object.assign(this, source);
    }
}
