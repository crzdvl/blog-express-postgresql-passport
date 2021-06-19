import { injectable } from 'inversify';
import nodemailerTransporter from '../config/nodemailerTransporter';

@injectable()
export class MailService {
    async sendEmail(to: string, subject: string, html: string): Promise<any> {
        return nodemailerTransporter.sendMail({
            from: '"BLOG 👻" <foo@example.com>',
            to,
            subject,
            html,
        });
    }
}
