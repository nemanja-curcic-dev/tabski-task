/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
process.env.TESTING = true;

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 5000,
};
