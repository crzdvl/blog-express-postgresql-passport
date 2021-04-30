import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Roles } from '../../src/entities/roles';

define(Roles, (faker: typeof Faker, context: { role: string } | undefined) => {
  const role: Roles = new Roles();
  role.role = context!.role;

  return role;
});
