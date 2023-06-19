import { beforeAll, afterAll, afterEach, describe, it } from '@jest/globals';
import { db } from '../config';

beforeAll(async () => {
    await db.initialize();
});

describe('Test suite for post service', () => {
    it('i', async () => {
        console.log('test');
    });
});

afterAll(async () => {
    await db.destroy();
});
