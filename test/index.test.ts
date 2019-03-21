import * as faker from 'faker';
import { OrionApi } from '../src';
import { ok } from 'assert';

describe('Test api', () => {
    const url = faker.internet.url();
    const api = new OrionApi(url, console);

    it('Expect api exists', () => {
        ok(api);
    });
});
