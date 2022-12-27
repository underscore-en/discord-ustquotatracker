import { assert } from 'chai';
import { UstHelper } from '../../src/helpers/UstHelper';

const Helper = UstHelper;

describe('UstHelper', () => {
    it('#getData()', async () => {
        const result = await Helper.getData(
            Helper.getSubjectUrl("MATH"),
        );

        assert.isNotEmpty(result);
        console.log(result);
    });
});
