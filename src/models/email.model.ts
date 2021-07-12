import {
    IsEmail,
} from 'class-validator';

export default class EmailModel {
    @IsEmail({}, {
        message: 'Your email is\'nt valid.',
    })
    email: string;

    constructor(source: Partial<EmailModel>) {
        Object.assign(this, source);
    }
}
