import {
    IsEmail,
    IsArray,
    ArrayMaxSize,
    ArrayNotEmpty,
    Length,
} from 'class-validator';

export class UserModel {
    @Length(3, 16, {
        message: 'Name needs to have $constraint1 - $constraint2 characters.',
    })
    name: string;

    @IsEmail({}, {
        message: 'Your email is\'nt valid.',
    })
    email: string;

    @Length(6, 16, {
        message: 'Password needs to have $constraint1 - $constraint2 characters.',
    })
    password: string;

    @IsArray()
    @ArrayMaxSize(2)
    @ArrayNotEmpty()
    roles: [];

    constructor(source: Partial<UserModel>) {
        Object.assign(this, source);
    }
}
