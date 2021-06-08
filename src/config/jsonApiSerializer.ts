import { Serializer } from 'jsonapi-serializer';

const UserSerializer = new Serializer('users', {
    attributes: ['name', 'email', 'access_token', 'refresh_token'],
});

export { UserSerializer };
