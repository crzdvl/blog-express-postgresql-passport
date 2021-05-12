import { Seeder, Factory } from 'typeorm-seeding';

import { Roles } from '../../src/entities/roles';
import { Users } from '../../src/entities/users';

export default class CreateUsersAndRoles implements Seeder {
    public async run(factory: Factory): Promise<void> {
        const adminRole = await factory(Roles)({ role: 'admin' }).create();
        const bloggerRole = await factory(Roles)({ role: 'blogger' }).create();
        const userRole = await factory(Roles)({ role: 'user' }).create();

        await factory(Users)({ roles: [bloggerRole, userRole] }).createMany(10);
        await factory(Users)({
            roles: [adminRole],
            email: 'admin@mail.com',
            password: 'password',
            name: 'admin',
            is_confirmed_email: true,
        }).create();
    }
}
