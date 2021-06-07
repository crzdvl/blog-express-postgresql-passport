import {
    IsJWT,
    IsNotEmpty,
} from 'class-validator';

export class RefreshTokenModel {
    @IsNotEmpty({
        message: 'Name needs to have $constraint1 - $constraint2 characters.',
    })
    @IsJWT({
        message: 'Jwt isn\'t valid.',
    })
    refresh_token: string;

    constructor(source: Partial<RefreshTokenModel>) {
        Object.assign(this, source);
    }
}
