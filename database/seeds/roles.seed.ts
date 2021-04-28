import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Roles } from '../../src/entities/roles';

export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Roles)
      .values([{ role: 'ADMIN' }, { role: 'BLOGGER' }, { role: 'USER' }])
      .execute();
  }
}
