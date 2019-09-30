import bucketops from './NodeBucketOps';
import rawDocs from '../queries/RawDocs.mock';
const debug = true;

describe('NodeBucketOps module', () => {

    it('should parse docs into buckets', async () => {
        const docs = rawDocs;
        const view = { bucket_count: 3, timeframe: 'all' };
        const resp = bucketops.parseDocs(docs, view);
        // check shape of returned object
        expect(resp).not.toHaveProperty('nonesuch');
        expect(resp).toHaveProperty('docs');
        expect(resp).toHaveProperty('bucketted_docs');
        const buckets = resp.bucketted_docs;
        // check we got back the same number of buckets we asked for
        expect(buckets.length).toBe(view.bucket_count);
        // check allocation of docs across buckets (7.9 pulls 4 docs up into bucket 0)
        expect(buckets[0].length).toBeGreaterThan(buckets[buckets.length-1].length);
    });

});
