import { beforeAll, afterAll, describe, it } from '@jest/globals';
import { db } from '../config';
import Container from 'typedi';
import { UserService } from '../services/user-service';
import { expect } from 'chai';
import User from '../entities/user-entity';
import { createUser } from './utils';

const userService = Container.get(UserService);
const userRepository = db.getRepository(User);

beforeAll(async () => {
    await db.initialize();
});

describe('Test suite for user service', () => {

    afterEach(async () => {
        await userRepository.delete({});
    });

    it('should throw an error if the user with the same email already exists', async () => {
        const existingEmail = 'existing@email.com';
        
        await userRepository.save(createUser({
            email: existingEmail
        }));

        try {
            await userService.createUser({
                name: 'Test',
                email: existingEmail,
                password: 'password',
                passwordConfirm: 'password'
            });
        } catch (e) {
            expect(e.message).to.be.equal(`User with email ${existingEmail} already exists!`);
        }
    });

    it('should throw an error if passwords do not match', async () => {
        try {
            await userService.createUser({
                name: 'Test',
                email: 'test@test.com',
                password: 'password1',
                passwordConfirm: 'password2',
            });
        } catch (e) {
            expect(e.message).to.be.equal('Passwords do not match!');
        }
    });

    it('should successfully create a user', async () => {
        const userName = 'userName';
        const userEmail = 'user@email.com';
        
        const user = await userService.createUser({
            name: userName,
            email: userEmail,
            password: 'password',
            passwordConfirm: 'password'
        });

        expect(user.name).to.be.equal(userName);
        expect(user.email).to.be.equal(userEmail);
    });

    it('should throw an error if user being updated does not exist', async () => {
        const notExistingId = 1111;

        try {
            await userService.updateUser({
                id: notExistingId,
                name: 'Test name',
                email: 'test@email.com',
            });
        } catch (e) {
            expect(e.message).to.be.equal(`User ${notExistingId} does not exist!`);
        }
    });

    it('should throw an error if email is updated to the already existing one', async () => {
        const existingEmail = 'existing@email.com';

        await userRepository.save(createUser({
            email: existingEmail
        }));

        const userForUpdate = await userRepository.save(createUser({
            email: 'different@mail.com'
        }));

        try {
            await userService.updateUser({
                id: userForUpdate.id,
                name: 'Update Name',
                email: existingEmail
            });
        } catch (e) {
            expect(e.message).to.be.equal(`User with email ${existingEmail} already exists!`);
        }
    });

    it('should update user successfully', async () => {
        const userForUpdate = await userRepository.save(createUser(
            {
                email: 'update@mail.com'
            }
        ));

        const nameUpdated = 'Name updated';
        const emailUpdated = 'email@updated.com';

        const userUpdated = await userService.updateUser({
            id: userForUpdate.id,
            name: nameUpdated,
            email: emailUpdated
        });

        expect(userUpdated.name).to.be.equal(nameUpdated);
        expect(userUpdated.email).to.be.equal(emailUpdated);
    });

    it('should throw an error if user being deleted does not exist', async () => {
        const notExistingId = 1111;

        try {
            await userService.deleteUser(notExistingId);
        } catch (e) {
            expect(e.message).to.be.equal(`User ${notExistingId} does not exist!`);
        }
    });

    it('should successfully delete user', async () => {
        const userForDeletion = await userRepository.save(createUser({}));
        await userService.deleteUser(userForDeletion.id);
        const deletedUser = await userRepository.findOne({
            where: {
                id: userForDeletion.id
            }
        });

        expect(deletedUser).to.be.null;
    });

    it('should successfully list users', async () => {
        for (let i = 0; i < 30; i++) {
            await userRepository.save(createUser({
                name: `User ${i + 1}`,
                email: `email${i + 1}@email.com`
            }));
        }

        const users = await userService.list(1, 30);
        expect(users.items).length(30);
        expect(users.total).to.be.equal(30);
    });
});

afterAll(async () => {
    await db.destroy();
});