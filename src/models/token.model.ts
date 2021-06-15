import {
    IsJWT,
    IsNotEmpty,
} from 'class-validator';

export class RefreshTokenModel {
    @IsNotEmpty()
    @IsJWT({
        message: 'Jwt isn\'t valid.',
    })
    refresh_token: string;

    constructor(source: Partial<RefreshTokenModel>) {
        Object.assign(this, source);
    }
}
