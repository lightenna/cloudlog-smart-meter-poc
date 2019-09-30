// const debug = false;

const findSuitableIcon = (node) => {
    let icon = "icon-aws-unknown";
    // match the type to an icon (by class) and subtype if set
    if (node.type) {
        icon = "icon icon-" + node.type.toLowerCase() + '-' + node.cloud.toLowerCase();
        if (node.subtype) {
            icon += " icon-" + node.type.toLowerCase() + '-' + node.cloud.toLowerCase() + '-' + node.subtype.toLowerCase();
        }
    }
    return icon;
};

const getNodeHash = (node) => {
    return node.key;
};

const buildJSTreeList = (element, jstree_std_node) => {
    let jstree_list = [];
    // loop through all keys in element to create jsTree nodes
    Object.keys(element).forEach(function (key) {
        const subobj = element[key];
        let jstree_node = Object.assign({
            text: key,
            id: getNodeHash(subobj),
            state: {
                // @todo store in state; for now force every element to open
                opened: true,
                // @todo review; for now disable all selections
                selected: false,
                disabled: true
            }
        }, jstree_std_node);
        // search for sub-elements
        if (typeof subobj === 'object') {
            jstree_node.children = [];
            jstree_node.icon = findSuitableIcon(subobj);
            // use alias in preference to key
            if (subobj.alias) jstree_node.text = `<span class="instance">${subobj.alias}</span>`;
            // show status in text (for now)
            if (subobj.status) jstree_node.text += ' ' + subobj.status;
            // recurse on nested sub-elements
            ['instances', 'services', 'regions'].forEach(function (subkey) {
                if (!subobj[subkey]) return;
                const sublist = buildJSTreeList(subobj[subkey], jstree_std_node);
                // merge results into single parent's children field
                jstree_node.children = jstree_node.children.concat(sublist);
                // put count back into tree title
                jstree_node.text += " (" + jstree_node.children.length + ")";
            });
        }
        // add node to list
        jstree_list.push(jstree_node);
    });
    return jstree_list;
};

const convertToJSTree = (tree, jstree_std_node) => {
    // top branch gets nested into output tree
    return {
        tree: {
            core: {
                "themes": {
                    // no connecting dots between nodes
                    // "dots": false
                },
                "data": buildJSTreeList(tree, jstree_std_node)
            }
        }
    };
};

export default {
    convertToJSTree
};
