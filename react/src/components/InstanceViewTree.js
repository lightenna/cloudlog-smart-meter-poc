import React from 'react'
import $ from 'jquery';
import 'jstree/dist/jstree.min';
import 'jstree/dist/themes/default/style.css';
import jstreeops from '../modules/JSTreeOps';
import utils from '../modules/Utils';

const debug = true;

class InstanceViewTree extends React.Component {

    state;

    constructor(props) {
        super(props);
        this.state = {
            tree: {},
            componentId: 'jstree-' + utils.getNuid()
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.tree !== prevState.tree) {
            return jstreeops.convertToJSTree(nextProps.tree, {});
        } else return null;
    }

    componentDidMount() {
        if (debug && false) console.log('InstanceViewTree (' + this.state.componentId + ') componentDidMount');
        this.refreshTree();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (debug && false) console.log('InstanceViewTree (' + this.state.componentId + ') componentDidUpdate');
        this.refreshTree();
    }

    refreshTree() {
        const jqid = '#' + this.state.componentId;
        if (!$(jqid).jstree(true)) {
            // initialise tree if first render
            $(jqid).jstree(this.state.tree);
        } else {
            // otherwise update and force refresh
            $(jqid).jstree(true).settings = this.state.tree;
            $(jqid).jstree(true).refresh();
        }
    }

    render() {
        if (debug && false) console.log('InstanceViewTree (' + this.state.componentId + ') render: tree', this.state.tree);
        return [
            <div key={0} id={this.state.componentId}></div>
        ];
    }
}

export default InstanceViewTree;