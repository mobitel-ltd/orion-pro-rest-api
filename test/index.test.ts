// import * as faker from 'faker';
import { OrionApi } from '../src';
import { ok } from 'assert';

describe('Test api', () => {
    const fakeLib = {};
    // const url = faker.internet.url();
    const api = new OrionApi({url: 'djaj', lib: fakeLib} as OrionApi);

    it('Expect api exists', () => {
        ok(api);
    });
});
