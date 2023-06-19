import { beforeAll, afterAll, describe, it } from '@jest/globals';
import { db } from '../config';
import Container from 'typedi';
import { UserService } from '../services/user-service';
import { expect } from 'chai';

const userService = Container.get(UserService);

beforeAll(async () => {
    await db.initialize();
});

describe('Test suite for user service', () => {
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
});

afterAll(async () => {
    await db.destroy();
});