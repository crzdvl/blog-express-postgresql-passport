import _ from 'lodash';
import { injectable } from 'inversify';
import { validate, ValidationError } from 'class-validator';

@injectable()
export class BaseService {
    async validateData(data: any): Promise<string | null> {
        const result: string | ValidationError[] = await validate(data, {
            validationError: {
                target: false,
            },
            stopAtFirstError: true,
        });

        return !_.isEmpty(result)
            ? _.find(result[0].constraints)!
            : null;
    }
}
