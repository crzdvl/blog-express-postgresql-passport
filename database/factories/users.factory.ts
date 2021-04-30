import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Users } from '../../src/entities/users';

define(Users, (faker: typeof Faker, context: { roles: any[] } | undefined) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  const user = new Users();
  user.name = `${firstName} ${lastName}`;
  user.email = faker.internet.email(firstName, lastName);
  user.password = faker.internet.password(8);
  user.is_confirmed_email = faker.random.arrayElement([true, false]);
  user.role = faker.random.arrayElement([...context!.roles]);

  return user;
});
