import { Serializer } from 'jsonapi-serializer';

const AuthSerializer = new Serializer('auth', {
    attributes: ['name', 'email', 'access_token', 'refresh_token', 'isConfirmedEmail'],
});

export { AuthSerializer };
