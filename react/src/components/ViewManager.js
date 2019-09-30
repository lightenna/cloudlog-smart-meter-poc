import React from 'react'
import {graphql} from 'react-apollo'
import update from 'immutability-helper';
import View from "./View";
import InitialiseViewList from "../queries/GetViews";
import GenericLazyLoad from './GenericLazyLoad';
import DocManager from './DocManager.js';
import Nav from './Nav';
import pkg from '../../package.json';
// AS 18/3/19: Enzyme doesn't support React 16.6 lazy loading.  Can't test, so disable
// const DocManager = React.lazy(() => import('./DocManager.js'));
const debug = true;

class ViewManager extends React.Component {

    constructor(props) {
        super(props);
        this.handleDocsChange = this.handleDocsChange.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        // initialise with empty lists in case render() call precedes load
        this.state = {
            docs: [],
            views: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // take [default] views from graphql props and store locally as state, first sight only
        if (prevState.views.length === 0) {
            // if there's a listener set, notify (used by tests)
            if (typeof nextProps.onViewsChanged === "function") {
                nextProps.onViewsChanged(nextProps.views);
            }
            return {
                ...prevState,
                views: nextProps.views
            };
        } else return null;
    }

    componentDidMount() {
        // set the page title
        document.title = pkg.name;
    };

    handleDocsChange(docs) {
        if (debug && false) console.log('handleDocsChange() called', docs);
        this.setState({'docs': docs});
    };

    static calculateViewChangeChain(view, updated_view) {
        // use seq to identify changed view within view tree
        const seqarr = view.seq.split('-');
        const seqlen = seqarr.length;
        if (debug && false) console.log('seqarr_before', seqarr);
        // compose state update tree as nested tree structure with '$merge' leaf node
        let chain = {}, chainlast = chain;
        seqarr.map((v, k) => {
            if (k + 1 === seqlen) {
                // last one, terminate chain with view to merge in
                chainlast[v] = {
                    '$merge': updated_view
                };
            } else {
                chainlast[v] = {
                    subViews: {}
                };
                chainlast = chainlast[v].subViews;
            }
            return v;
        });
        if (debug && false) console.log('chain_after', chain);
        return chain;
    };

    /**
     * all view updates processed by handleViewChange
     * merged into View tree state
     */
    handleViewChange(view, changed_attrib, new_value) {
        if (debug && false) console.log('handleViewChange', view, changed_attrib, new_value);
        // check that we've got a valid sequence number
        if (!view.seq.length) {
            console.error('Received an invalid sequence number, aborting handleViewChange');
            return;
        }
        // compose state update leaf
        const updated_view = {};
        updated_view[changed_attrib] = new_value;
        const chain = ViewManager.calculateViewChangeChain(view, updated_view);
        // use immutability-helper to create an update copy of the state then apply to state
        const new_state = {views: update(this.state.views, chain)};
        this.setState(new_state);
    }

    render_subviews() {
        if (this.props.testOnlyManager) {
            return [];
        }
        const views = this.state.views;
        return [].concat(views).map((c, index) =>
            <View key={index} {...c} onViewChange={this.handleViewChange} docs={this.state.docs}/>);
    }

    render() {
        const dm = <DocManager creatorCloudId={this.props.creatorCloudId} docs={this.state.docs}
                               onDocsChange={this.handleDocsChange} client={this.props.appconfig.client}
                               appDebug={false} />;
        const buttons = <GenericLazyLoad target={dm} detectIfLazy={DocManager}/>;
        const views = this.render_subviews();
        return (
            <div id="view-manager" className={"view container-fluid"} data-userid={this.props.creatorUserId}>
                <div className={"content"}>
                    <Nav sharedButtons={buttons}/>
                </div>
                <div className={"subviews row"}>{views}</div>
            </div>
        );
    }
}

const ingestInitialGraphQL = function (graphql_props) {
    const views = graphql_props.data.getViews || [];
    return views;
};

const graphql_config = {
    options: (props) => ({
        // fetchPolicy: 'cache-and-network',
        fetchPolicy: 'network-only',
        variables: {
            creatorUserId: props.creatorUserId
        }
    }),

    props: (graphql_props) => ({
        views: ingestInitialGraphQL(graphql_props)
    }),
};

/**
 * @type {React.ComponentClass<{}, any>}
 * @see https://www.apollographql.com/docs/react/api/react-apollo.html#graphql
 */
const ViewListWithData = graphql(InitialiseViewList, graphql_config)(ViewManager);
export default ViewListWithData;