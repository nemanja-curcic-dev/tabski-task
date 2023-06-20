import User from '../../entities/user-entity';

interface CreateUser {
    name?: string;
    email?: string;
    password?: string;
}

export function createUser(input: CreateUser): User {
    const user = new User();

    user.name = input.name || 'Test name';
    user.email = input.email || 'test@email.com';
    user.password = input.password || 'password';

    return user;
}
