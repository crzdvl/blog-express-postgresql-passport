import _ from 'lodash';
import { injectable } from 'inversify';
import { validate, ValidationError } from 'class-validator';

import ValidationErrorCustom from '../error/ValidationError';

@injectable()
export class BaseService {
    async validateData(data: any): Promise<string | null> {
        const result: string | ValidationError[] = await validate(data, {
            validationError: {
                target: false,
            },
            stopAtFirstError: true,
        });

        if (!_.isEmpty(result)) throw new ValidationErrorCustom(_.find(result[0].constraints)!);

        return null;
    }
}
