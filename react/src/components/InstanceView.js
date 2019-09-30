/*!
 * InstanceView
 *   loadable component
 */
import React from 'react'
import treeops from '../modules/NodeTreeOps'
import InstanceViewButtons from './InstanceViewButtons'
import InstanceViewTree from "./InstanceViewTree";
import ViewNavbar from "./ViewNavbarCollapsing";
import 'bootstrap/dist/js/bootstrap.min.js';
import './InstanceView.scss';
// jstree needs an explicit reference to jquery
import jquery from 'jquery';
import 'popper.js';
// fix jstree references to jQuery
window.$ = window.jQuery = jquery;
const debug = true;

class InstanceView extends React.Component {

    state;

    constructor(props) {
        super(props);
        // setup defaults
        this.state = {
            regions: {},
            instances: {},
            services: {},
            docs: [],
            view: {
                nesting: 'firstreg', // region -> service
                onlylive: true // don't show terminated/deleted instances
            }
        };
        // bind local functions to this scope
        this.handleSelectedNesting = this.handleSelectedNesting.bind(this);
        this.handleCheckedOnlylive = this.handleCheckedOnlylive.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.docs !== prevState.docs) {
            return treeops.parseDocsToNodeTree(nextProps.docs);

        } else return null;
    }

    handleSelectedNesting(value) {
        // update field without destroying the rest of the view
        this.setState(prevState => ({
            view: {
                ...prevState.view,
                'nesting': value
            }
        }));
        if (debug && false) console.log('handleSelectedNesting', arguments);
    }

    handleCheckedOnlylive(value) {
        this.setState(prevState => ({
            view: {
                ...prevState.view,
                'onlylive': value
            }
        }));
    }

    render() {
        if (debug && false) console.log('InstanceView render', this.state, this.props);
        const render_tree = treeops.filterNodeTree(treeops.partialClone(this.state), this.state.view);
        const own_buttons = <InstanceViewButtons onSelectNesting={this.handleSelectedNesting} onCheckOnlylive={this.handleCheckedOnlylive} {...this.state.view}/>;
        const body = <InstanceViewTree tree={render_tree}/>;
        return <ViewNavbar permNav={this.props.sharedButtons} collapsingNav={own_buttons} body={body} scrollClassName="content-scrollable" />;
    }
}

export default InstanceView;