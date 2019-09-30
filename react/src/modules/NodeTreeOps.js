import docformat from './DocFormat';
import {parseDocBody} from './Utils';

const debug = false;

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

/**
 * Search at most the top-10 docs for a status
 * @param instance
 * @returns {String} status
 */
const getInstanceStatus = (instance) => {
    // find the most recent doc in docs
    const len = instance.docs.length || 0;
    // protect against empty docs array
    if (len === 0) return 'unknown';
    // try to get status of first doc in list
    let recdoc_index = 0;
    let status = docformat.getStatus(instance.docs[recdoc_index]);
    const hardlimit = 10;
    // if we didn't get a non-unknown status, repeat on the rest of them (below hardlimit)
    while (status === 'status-unknown' && (instance.docs.length > (recdoc_index + 1)) && (recdoc_index < hardlimit)) {
        // try next doc
        recdoc_index++;
        status = docformat.getStatus(instance.docs[recdoc_index]);
    }
    return status;
};

/**
 * @param instance
 * @return float Instance cost in dollars per hour
 */
const getInstanceCostHourly = (instance) => {
    // for now just return a static cost for an instance, based on the assumptions:
    // 1. if it's EC2, it's a t2.nano
    // 2. if it's S3, usage is constant and equiv to some small hourly cost
    // 3. it's the same price across all regions
    // 4. no charges for any other services
    switch (instance.service) {
        default:
            break;
        case 'ec2' :
            switch (instance.subtype) {
                default:
                    break;
                case 'instance' :
                    // if (['pending', 'unknown', 'running', 'shutting-down'].includes(instance.status)) {
                    if (['pending', 'running', 'shutting-down'].includes(instance.status)) {
                        return 0.0066;
                    }
                    break;
                case 'volume' :
                    if (['available'].includes(instance.status)) {
                        return 0.001;
                    }
                    break;
            }
            break;
        case 's3' :
            if (['created'].includes(instance.status)) {
                return 0.001;
            }
            break;
    }
    return 0;
};

/**
 * Place a document in the appropriate part of a nested structure
 * @param target
 * @param doc
 * @param key_list
 * @param template
 * @returns {boolean}
 */
const nestDoc = (target, doc, key_list, template) => {
    let target_terminal = target;
    const key_list_len = key_list.length;
    // add an empty docs object to the template object, if not there already
    template['docs'] = template['docs'] || [];
    // loop through the key list
    for (let i = 0; i < key_list_len; ++i) {
        const key = key_list[i];
        // test each of the keys in the key list
        if (!key) {
            // if any key is undefined, don't attempt to create and push an object
            return false;
        }
        // if it's not been set, create the key using the template object
        target_terminal[key] = target_terminal[key] || template;
        // advance the terminal
        target_terminal = target_terminal[key];
    }
    return true;
};

/**
 * enrich tree with leaf node state
 * Updates tree in place
 * @param tree
 */
const enrichNodeTree = (tree) => {
    // parse single treelet to reach all instances
    for (let service_id in tree.services) {
        for (let region_id in tree.services[service_id].regions) {
            for (let instance_id in tree.services[service_id].regions[region_id].instances) {
                const instance = tree.services[service_id].regions[region_id].instances[instance_id];
                instance.status = instance.status || getInstanceStatus(instance);
                instance.costrate = instance.costrate || getInstanceCostHourly(instance);
            }
        }
    }
};

/**
 * use list of instances to compute cost rate per branch
 */
const costAggregateNodeTree = (tree) => {
    // parse tree to aggregate cost of instances into region groups, then aggregate those into service groups
    for (let service_id in tree.services) {
        let agg_services = 0;
        for (let region_id in tree.services[service_id].regions) {
            let agg_instances = 0;
            for (let instance_id in tree.services[service_id].regions[region_id].instances) {
                const instance = tree.services[service_id].regions[region_id].instances[instance_id];
                agg_instances += instance.costrate;
            }
            tree.services[service_id].regions[region_id].costrate = agg_instances;
            agg_services += agg_instances;
        }
        tree.services[service_id].costrate = agg_services;
    }
    // repeat for instances into services, then aggregate those into region groups, then aggregate total
    let agg_total = 0;
    for (let region_id in tree.regions) {
        let agg_regions = 0;
        for (let service_id in tree.regions[region_id].services) {
            let agg_instances = 0;
            for (let instance_id in tree.regions[region_id].services[service_id].instances) {
                const instance = tree.regions[region_id].services[service_id].instances[instance_id];
                agg_instances += instance.costrate;
            }
            tree.regions[region_id].services[service_id].costrate = agg_instances;
            agg_regions += agg_instances;
        }
        tree.regions[region_id].costrate = agg_regions;
        agg_total += agg_regions;
    }
    tree.costrate = agg_total;
    return tree;
};

const deleteInstanceFromNodeTree = (tree, service_id, region_id, instance_id) => {
    let deleteQueue = [];
    // service->region->instance
    delete tree.services[service_id].regions[region_id].instances[instance_id];
    // region->service->instance
    delete tree.regions[region_id].services[service_id].instances[instance_id];
    // check parent categories are still useful
    if (isEmpty(tree.regions[region_id].services[service_id].instances)) {
        delete tree.regions[region_id].services[service_id];
        if (isEmpty(tree.regions[region_id].services)) {
            deleteQueue[deleteQueue.length] = () => {
                delete tree.regions[region_id];
            }
        }
    }
    if (isEmpty(tree.services[service_id].regions[region_id].instances)) {
        delete tree.services[service_id].regions[region_id];
        if (isEmpty(tree.services[service_id].regions)) {
            deleteQueue[deleteQueue.length] = () => {
                delete tree.services[service_id];
            }
        }
    }
    return deleteQueue;
};

/**
 * Reduce a full node tree to the viewable part based on filters
 * @param tree
 * @param filters
 * @returns object (Service|Region) tree branch
 */
const filterNodeTree = (tree, filters) => {
    let deleteQueue = [];
    for (let service_id in tree.services) {
        for (let region_id in tree.services[service_id].regions) {
            for (let instance_id in tree.services[service_id].regions[region_id].instances) {
                const instance = tree.services[service_id].regions[region_id].instances[instance_id];
                if (filters.onlylive === true) {
                    // don't show anything dead
                    switch (instance.status) {
                        case 'destroyed' :
                        case 'deleted' :
                        case 'unknown' :
                        case 'terminated' :
                            deleteQueue = deleteQueue.concat(deleteInstanceFromNodeTree(tree, service_id, region_id, instance_id));
                            break;
                        default:
                            break;
                    }
                    // exclude certain resources from named services
                    switch (instance.service) {
                        case 's3' :
                            break;
                        case 'ec2' :
                            switch (instance.subtype) {
                                case 'security-group' :
                                case 'subnet' :
                                case 'vpc' :
                                    deleteQueue = deleteQueue.concat(deleteInstanceFromNodeTree(tree, service_id, region_id, instance_id));
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                    // exclude all tag manager stuff
                    // if (instance.subtype === 'tags') {
                    //     deleteQueue.concat(deleteInstanceFromNodeTree(tree, service_id, region_id, instance_id));
                    // }
                }
            }
        }
    }
    // process delete queue; has to be outside of region/service loop
    deleteQueue.forEach(func => {
        func.call();
    });
    if (filters.nesting) {
        // return filtered branch of tree
        const selected_branch = (filters.nesting === 'firstreg' ? tree.regions : tree.services);
        return selected_branch;
    }
    // otherwise return whole filtered tree
    return tree;
};

const createEmptyTree = () => {
    return {
        regions: {},
        instances: {},
        services: {},
        docs: []
    };
};

const partialClone = (source) => {
    // @todo only need to create a partial copy, but for simplicity's sake, just deep clone the whole thing
    return JSON.parse(JSON.stringify(source));
};

/**
 * Parse list of documents to build semantic view of nested instances
 * @param docs
 * @param opts
 * @returns {{regions, docs: *, instances, services}}
 */
const parseDocsToNodeTree = (docs, opts) => {
    const output = createEmptyTree();
    output.docs = docs;
    // create tree organised as:
    for (let i = 0; i < docs.length; ++i) {
        const doc = docs[i];
        if (!doc) continue;
        // fallback in case we discover an unparsed doc body
        if (typeof doc.body !== 'object') {
            parseDocBody(doc);
        }
        if (!doc.body) continue;
        // share a single instance object across instance list, region->service->instance list and service->region->instance, but identify uniquely
        const instance_resname = docformat.getResName(doc);
        const region = docformat.getRegion(doc);
        const service = docformat.getService(doc);
        const cloud = docformat.getCloud(doc);
        // load shared instance if it exists already
        const instance_shared = output.instances[instance_resname] || {
            cloud: cloud,
            resname: instance_resname,
            alias: docformat.getInstance(doc),
            service: service,
            region: region,
            type: 'instance',
            subtype: docformat.getSubtype(doc),
        };
        // region [-> doc]
        nestDoc(output, doc, ['regions', region],
            {cloud: cloud, type: 'region', subtype: null, services: {}});
        // region -> service [-> doc]
        nestDoc(output, doc, ['regions', region, 'services', service],
            {cloud: cloud, type: 'service', subtype: service, instances: {}});
        // region -> service -> instance [-> doc]
        nestDoc(output, doc, ['regions', region, 'services', service, 'instances', instance_resname],
            instance_shared, doc);
        // service [-> doc]
        nestDoc(output, doc, ['services', service],
            {cloud: cloud, type: 'service', subtype: service, regions: {}});
        // service -> region [-> doc]
        nestDoc(output, doc, ['services', service, 'regions', region],
            {cloud: cloud, type: 'region', subtype: null, instances: {}});
        // service -> region -> instance [-> doc]
        nestDoc(output, doc, ['services', service, 'regions', region, 'instances', instance_resname],
            instance_shared);
        // instance -> doc
        nestDoc(output, doc, ['instances', instance_resname],
            instance_shared);
        instance_shared.docs.push(doc);
    }
    if (debug && false) console.log('parseDocsToNodeTree returned', output);
    // parse tree to enrich
    enrichNodeTree(output);
    return output;
};

export default {
    parseDocsToNodeTree,
    costAggregateNodeTree,
    filterNodeTree,
    partialClone
};
