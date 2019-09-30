import treeops from './NodeTreeOps';
import getDocsMock from '../queries/GetLatestDocs.mock';
import docformat from './DocFormat';
const debug = true;

const deepClone = (arr) => {
    return JSON.parse(JSON.stringify(arr))
};

describe('NodeTreeOps module', () => {

    it('should parse docs', async () => {
        const docs = deepClone(getDocsMock.result.data.getLatestDocs.items);
        const nodetree = treeops.parseDocsToNodeTree(docs);
        expect(nodetree).not.toHaveProperty('nonesuch');
        // find instance via regions -> X -> services -> Y -> instances -> Z
        expect(nodetree).toHaveProperty('regions');
        const [firstreg] = Object.keys(nodetree.regions);
        expect(nodetree.regions).toHaveProperty(firstreg);
        const [firstserv] = Object.keys(nodetree.regions[firstreg].services);
        const [firstinst] = Object.keys(nodetree.regions[firstreg].services[firstserv].instances);
        expect(nodetree.regions[firstreg].services[firstserv].instances[firstinst]).toHaveProperty('subtype');
        expect(nodetree.regions[firstreg].services[firstserv].instances[firstinst].cloud).toBe('AWS');
    });

    it('should cope with identical instance names', async () => {
        const docs = deepClone(getDocsMock.result.data.getLatestDocs.items);
        // pick a document in the list for duplication
        const source_doc = docs[1];
        const new_region = 'made-up-1';
        const changed = source_doc.body.replace(/[eus]*-[weast]*-[123]/gi, new_region);
        const doc_ref = docs.length;
        // create a new document in the list by cloning another
        docs[doc_ref] = Object.assign({}, source_doc, {
            body: changed
        });
        const nodetree = treeops.parseDocsToNodeTree(docs);
        expect(nodetree).not.toHaveProperty('nonesuch');
        // check region got parsed correctly
        expect(nodetree.regions).toHaveProperty(new_region);
        // check for doc under instance
        expect(nodetree.instances).toHaveProperty(docformat.getResName(docs[doc_ref]));
        expect(nodetree.instances[docformat.getResName(docs[doc_ref])].docs).toHaveLength(1);
    });

    it('should properly escape malevolent DB/doc input', async () => {
        const docs = deepClone(getDocsMock.result.data.getLatestDocs.items);
        // @todo add bad input
        const nodetree = treeops.parseDocsToNodeTree(docs);
        expect(nodetree).not.toHaveProperty('nonesuch');
    });

});
