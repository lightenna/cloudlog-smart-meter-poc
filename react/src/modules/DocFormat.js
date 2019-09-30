import utils from "./Utils";
// const debug = false;

//
// AWS stuff
//

export const checkArn = (doc) => {
    return (doc && doc.body && doc.body.resources && doc.body.resources.length > 0) && doc.body.resources[0];
};

/**
 * Pull apart AWS Resource Name strings
 * https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
 */

/**
 * get instance name
 * @param arn
 * @returns {string} Instance or unparseable ARN
 */
const getInstanceByArn = (arn) => {
    // GIGO protection
    if (!arn || !arn.length) return arn;
    // find source component
    const components = arn.split(':');
    if (components && components.length && components.length>5) {
        const leaf = components[5];
        /**
         * Leaf could take one of these formats
         *   resource
         *   resourcetype/resource
         *   resourcetype/resource/qualifier
         * but we can ignore these because of split(':') above
         *   resourcetype/resource:qualifier
         * and can't disambiguate with these without a resourcetype grammar
         *   resourcetype:resource
         *   resourcetype:resource:qualifier
         */
        const leafpart = leaf.split('/');
        if (leafpart && leafpart.length && leafpart.length>0) {
            switch (leafpart.length) {
                case 1:
                    return leafpart[0];
                case 2:
                case 3:
                default:
                    return leafpart[1];
                case 4:
                    if (leafpart[0] === 'loadbalancer' && leafpart[1] === 'app') {
                        return leafpart[2];
                    }
                    return leafpart[1];
            }
        }
        return leaf;
    }
    return arn;
};

const getSubtypeByArn = (arn) => {
    // GIGO protection
    const miss = 'subtype-unknown';
    if (!arn || !arn.length) return miss;
    // find source component
    const components = arn.split(':');
    if (components && components.length && components.length>5) {
        const leaf = components[5];
        const leafpart = leaf.split('/');
        if (leafpart && leafpart.length && leafpart.length>0) {
            switch (leafpart.length) {
                case 1:
                    return miss;
                case 2:
                case 3:
                default:
                    return leafpart[0];
            }
        }
        return miss;
    }
    return miss;
};

const getServiceByArn = (arn) => {
    // GIGO protection
    if (!arn || !arn.length) return 'service-unknown';
    // find source component
    const components = arn.split(':');
    if (components && components.length && components.length>2) {
        return components[2];
    }
    return 'service-unknown';
};

const getStatusByAWSDoc = (doc) => {
    const miss = 'status-unknown';
    // make sure we've got a well-formed object
    if (!checkArn(doc) || !doc.body || !doc.body.detail) return 'unknown';
    switch (getService(doc)) {
        default :
            // for now count tags
            if (doc.body.detail.tags) {
                if (Object.keys(doc.body.detail.tags).length > 0) {
                    return 'created';
                } else {
                    return 'destroyed';
                }
            }
            break;
        case 'ec2' :
            switch (getSubtype(doc)) {
                case 'instance' :
                    if (doc.body.detail['state']) {
                        return doc.body.detail['state'];
                    }
                    break;
                case 'volume' :
                    if (doc.body.detail['result']) {
                        return doc.body.detail['result'];
                    }
                    break;
                default :
                    return (doc.body.detail.tags && (Object.keys(doc.body.detail.tags).length + ' tags')) || miss;
            }
            break;
    }
    return miss;
};

//
// Azure stuff
//

export const checkResourceUri = (doc) => {
    return (doc && doc.body && doc.body.data && doc.body.data.resourceUri && doc.body.data.resourceUri.length > 0) && doc.body.data.resourceUri;
};

const getInstanceByResourceUri = (resuri) => {
    // GIGO protection
    if (!resuri || !resuri.length) return 'instance-unknown';
    const components = resuri.split('/');
    if (components && components.length && components.length>8) {
        return components[8];
    }
    if (components && components.length && components.length === 5) {
        return components[4];
    }
    return 'instance-unknown';
};

const getSubtypeByResourceUri = (resuri) => {
    // GIGO protection
    if (!resuri || !resuri.length) return 'subtype-unknown';
    const components = resuri.split('/');
    if (components && components.length && components.length>7) {
        return components[7];
    }
    return 'subtype-unknown';
};

const translateAzureService = (service) => {
    if (service.startsWith('Microsoft.')) {
        return service.replace(/Microsoft\./, '');
    }
    switch (service) {
        case 'resourcegroups' :
            return 'ResourceGroups';
        default :
            return service;
    }
};

const getServiceByResourceUri = (resuri) => {
    // GIGO protection
    if (!resuri || !resuri.length) return 'service-unknown';
    const components = resuri.split('/');
    if (components && components.length && components.length>6) {
        return translateAzureService(components[6]);
    }
    if (components && components.length && components.length === 5) {
        return translateAzureService(components[3]);
    }
    return 'service-unknown';
};

const translateAzureStatus = (status) => {
    const components = status.split('/');
    switch (status) {
        case 'Microsoft.Authorization/policies/audit/action' :
        case 'Microsoft.Authorization/policies/auditIfNotExists/action' :
            return 'unknown';
        default :
            break;
    }
    if ((components.length === 3) || (components.length === 4)) {
        switch (components[components.length-1]) {
            case 'delete' :
                return 'terminated';
            case 'write' :
                return 'created';
            default:
                break;
        }
    }
    return status;
};

const getStatusByAzureDoc = (doc) => {
    return translateAzureStatus(doc.body.data.operationName);
};

//
// High level
//

export const getResName = (doc) => {
    let match;
    const cloud = doc.body.cloud;
    switch(cloud) {
        case 'aws' :
            match = checkArn(doc);
            if (match) return match;
            break;
        case 'azure' :
            match = checkResourceUri(doc);
            if (match) return match;
            break;
        default :
            break;
    }
    return 'arn:no-such-partition:no-such-service:no-such-region:no-such-account-id:no-such-resource';
};

export const getCloud = (doc) => {
    const cloud = doc.body.cloud;
    switch(cloud) {
        case 'aws' :
            return 'AWS';
        case 'azure' :
            return 'Azure';
        default :
            return utils.ucFirst(cloud);
    }
};

export const getRegion = (doc) => {
    const cloud = doc.body.cloud;
    switch(cloud) {
        case 'aws' :
            return doc.body.region;
        default :
            return cloud + '-region-unknown';
    }
};

/**
 * @param doc
 * @returns {String} status or 'unknown'
 */
export const getStatus = (doc) => {
    const cloud = doc.body.cloud;
    switch(cloud) {
        case 'aws' :
            return getStatusByAWSDoc(doc);
        case 'azure' :
            return getStatusByAzureDoc(doc);
        default :
            return 'status-unknown';
    }
};

export const getInstance = (doc) => {
    const cloud = doc.body.cloud;
    switch(cloud) {
        case 'aws' :
            return getInstanceByArn(getResName(doc));
        case 'azure' :
            return getInstanceByResourceUri(getResName(doc));
        default :
            return 'instance-unknown';
    }
};

export const getSubtype = (doc) => {
    const cloud = doc.body.cloud;
    switch(cloud) {
        case 'aws' :
            return getSubtypeByArn(getResName(doc));
        case 'azure' :
            return getSubtypeByResourceUri(getResName(doc));
        default :
            return 'subtype-unknown';
    }
};

export const getService = (doc) => {
    const cloud = doc.body.cloud;
    switch(cloud) {
        case 'aws' :
            return getServiceByArn(getResName(doc));
        case 'azure' :
            return getServiceByResourceUri(getResName(doc));
        default :
            return 'service-unknown';
    }
};

export default {
    checkArn,
    getResName,
    getCloud,
    getRegion,
    getStatus,
    getInstance,
    getSubtype,
    getService
};
