import {
    IsJWT,
    IsNotEmpty,
    Length,
} from 'class-validator';

export default class UserPasswordResetModel {
    @IsNotEmpty()
    @IsJWT({
        message: 'Jwt isn\'t valid.',
    })
    token: string;

    @Length(6, 16, {
        message: 'Password needs to have $constraint1 - $constraint2 characters.',
    })
    password: string;

    constructor(source: Partial<UserPasswordResetModel>) {
        Object.assign(this, source);
    }
}
