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

    async sendLinkForPasswordReset(email: string, token: string): Promise<any> {
        return nodemailerTransporter.sendMail({
            from: '"BLOG 👻" <foo@example.com>',
            to: email,
            subject: 'BLOG password reset ✔',
            html: `
                <p>Hello ✔, you make a request for password reset</p>
                <br>
                <b>
                    <a href="${process.env.FRONTEND_HOST}/auth/passwordReset?token=${token}">
                        Just click here to do it :)
                    </a>
                </b>
                <p>If you don't do it, just ignore this message.</p>`,
        });
    }
}
