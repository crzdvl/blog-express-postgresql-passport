import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Users } from '../../src/entities/users';
import { Roles } from '../../src/entities/roles';

define(Users, (
  faker: typeof Faker,
  context: { roles: Roles[]; email: string; password: string; name: string; is_confirmed_email: boolean } | undefined,
) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  const user = new Users();
  user.name = context!.name || `${firstName} ${lastName}`;
  user.email = context!.email || faker.internet.email(firstName, lastName);
  user.password = context!.password || faker.internet.password(8);
  user.is_confirmed_email = context!.is_confirmed_email || faker.random.arrayElement([true, false]);
  user.role = faker.random.arrayElement([...context!.roles]);

  return user;
});
