import {
    IsEmail,
    Length,
} from 'class-validator';

export default class UserLoginModel {
    @IsEmail({}, {
        message: 'Your email is\'nt valid.',
    })
    email: string;

    @Length(6, 16, {
        message: 'Password needs to have $constraint1 - $constraint2 characters.',
    })
    password: string;

    constructor(source: Partial<UserLoginModel>) {
        Object.assign(this, source);
    }
}
