const faker = require('faker');
const assert = require('assert');
const OrionApi = require('../src');

describe('Test api', () => {
    const fakeLib = {};
    const url = faker.internet.url();
    const api = new OrionApi({url, lib: fakeLib});

    it('Expect api exists', () => {
        assert.ok(api);
    });
});
