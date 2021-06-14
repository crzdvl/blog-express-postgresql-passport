import { injectable } from 'inversify';
import nodemailerTransporter from '../config/nodemailerTransporter';

@injectable()
export class MailService {
    async sendEmailVerification(email: string, token: string): Promise<any> {
        return nodemailerTransporter.sendMail({
            from: '"BLOG 👻" <foo@example.com>',
            to: email,
            subject: 'BLOG email verification ✔',
            html: `
                <p>Hello ✔, please confirm your email</p>
                <br>
                <b>
                    <a href="${process.env.BACKEND_HOST}/auth/verificateEmail?token=${token}">
                        Just click here to do it :)
                    </a>
                </b>`,
        });
    }
}
