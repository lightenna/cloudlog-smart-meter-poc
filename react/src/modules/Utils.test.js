import utils from './Utils';

const debug = true;

describe('Utils module', () => {

    it('should generate a nearly unique ID', async () => {
        const n = utils.getNuid();
        expect(n).toBeGreaterThan(-1);
    });

});
