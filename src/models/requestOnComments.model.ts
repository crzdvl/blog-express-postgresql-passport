import {
    IsString,
} from 'class-validator';

export default class RequestOnComments {
    @IsString()
    id: string;

    @IsString()
    page: string;

    @IsString()
    per: string;

    constructor(source: Partial<RequestOnComments>) {
        Object.assign(this, source);
    }
}
