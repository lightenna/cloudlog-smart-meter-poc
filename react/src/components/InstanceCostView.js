/*!
 * InstanceView
 *   loadable component
 */
import React from 'react'
import InstanceCostViewChart from './InstanceCostViewChart';
import InstanceCostViewButtons from './InstanceCostViewButtons';
import ViewNavbar from './ViewNavbarCollapsing';
import treeops from '../modules/NodeTreeOps'

const debug = true;

class InstanceCostView extends React.Component {

    state;

    constructor(props) {
        super(props);
        // setup defaults
        this.state = {
            docs: [],
            view: {
                'by': 'services',
                'per': 'month'
            }
        };
        // bind local functions to this scope
        this.handleSelectedBy = this.handleSelectedBy.bind(this);
        this.handleSelectedPer = this.handleSelectedPer.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.docs !== prevState.docs) {
            return treeops.costAggregateNodeTree(treeops.filterNodeTree(treeops.parseDocsToNodeTree(nextProps.docs), {onlylive: true}));
        } else return null;
    }

    handleSelectedBy(value) {
        this.setState(prevState => ({
            view: {
                ...prevState.view,
                'by': value
            }
        }));
    }

    handleSelectedPer(value) {
        this.setState(prevState => ({
            view: {
                ...prevState.view,
                'per': value
            }
        }));
    }

    render() {
        if (debug && false) console.log('InstanceCostView render', this.state, this.props);
        const own_buttons = <InstanceCostViewButtons {...this.state.view} onSelectBy={this.handleSelectedBy} onSelectPer={this.handleSelectedPer}/>;
        const body = <InstanceCostViewChart node_tree={this.state} {...this.state.view} />;
        return <ViewNavbar permNav={this.props.sharedButtons} collapsingNav={own_buttons} body={body}/>;
    }
}

export default InstanceCostView;