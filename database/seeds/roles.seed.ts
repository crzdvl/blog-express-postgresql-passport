import { Seeder, Factory } from 'typeorm-seeding';
import { Roles } from '../../src/entities/roles';

export default class CreateRoles implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Roles)({ role: 'ADMIN' }).create();
    await factory(Roles)({ role: 'BLOGGER' }).create();
    await factory(Roles)({ role: 'USER' }).create();
  }
}
