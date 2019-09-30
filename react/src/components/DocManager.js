/*!
 * DocManager
 *   loadable component
 */
import React from 'react'
import {graphql} from 'react-apollo'
import DocManagerButtons from './DocManagerButtons'
import GetLatestDocs from '../queries/GetLatestDocs'
import NewDocSubscription from '../subscriptions/NewDocSubscription'
import utils from '../modules/Utils'
const debug = true;

class DocManager extends React.Component {

    state;
    // subscriptions
    sub_new;

    constructor(props) {
        super(props);
        this.clearCache = this.clearCache.bind(this);
        this.state = {
            docs_length: 0,
            docs_length_max: 500,
        };
        if (debug && false) console.log('constructor', props);
    }

    componentDidMount() {
        // subscribe then notify base state
        this.sub_new = this.props.subscribeToNewDocs();
        if (debug && false) console.log('componentDidMount', this.props);
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.docs && nextProps.docs.length>0) && (nextProps.docs.length !== prevState.docs_length)) {
            if (debug && false) console.log('getDerivedStateFromProps', nextProps);
            // notify that we've received an updated set of docs
            if (typeof nextProps.onDocsChange === "function") {
                const new_docs = nextProps.docs.map(graphql_config.parseDocBody);
                // restrict new docs length to max
                if (new_docs.length > prevState.docs_length_max) {
                    new_docs.length = prevState.docs_length_max;
                }
                nextProps.onDocsChange(new_docs);
            }
            // update [minimal] local state
            return {
                ...prevState,
                docs_length: nextProps.docs.length
            };
        }
        return null;
    }

    componentWillUnmount() {
        // unmount subscription if mounted
        if (typeof this.sub_new === 'function') {
            this.sub_new();
        }
    };

    clearCache() {
        if (this.props.client && typeof this.props.client.resetStore === 'function') {
            this.props.client.resetStore();
            // horrible callback to reload page after query re-fetch
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    };

    render() {
        const docs = this.props.docs || [];
        if (debug && false) console.log('render() called', docs.length);
        // DocManager's visible content is a set of buttons for toolbar
        return [
            <div key={0} className={"masterDocsList"} data-doclistlen={docs.length}></div>,
            this.props.appDebug && <DocManagerButtons key={1} docs={docs} onFetchOlder={this.props.loadOlderDocs} onClearCache={this.clearCache} />,
        ]
    }
}

const ingestInitialGraphQL = function (graphql_props) {
    if (debug && false) console.log('ingestInitialDocs', graphql_props);
    const docs = (graphql_props.data.getLatestDocs && graphql_props.data.getLatestDocs.items) || [];
    // DON'T notify here, wait for getDerivedStateFromProps() to get given the items
    return docs;
};

const graphql_config = {
    options: (props) => ({
        // network: fetch latest docs from network, disable offline
        fetchPolicy: 'network-only',
        variables: {
            creatorCloudId: props.creatorCloudId
        }
    }),

    /**
     * Compute new props based on the .data that the GraphQL query returned
     */
    props: (graphql_props) => ({

        // need to capture docs from query so that getDerivedStateFromProps() eventually gets called
        docs: ingestInitialGraphQL(graphql_props),

        /**
         * create subscription to get newly created documents
         * @param params
         * @returns function unsubscribe handle
         */
        subscribeToNewDocs: (params) => {
            if (debug && false) console.log('subscribeToNewDocs() called', graphql_props);
            return graphql_props.data.subscribeToMore({
                document: NewDocSubscription,
                variables: {
                    "creatorCloudId": graphql_props.ownProps.creatorCloudId
                },
                updateQuery: (previousResult, {subscriptionData: {data: {onCreateDoc}}}) => {
                    if (debug && false) console.log('subscribeToMore.updateQuery() called', graphql_props);
                    if (typeof previousResult === 'undefined' || typeof previousResult.getLatestDocs === 'undefined') return onCreateDoc;
                    if (debug && false) console.log('subs new docs', onCreateDoc);
                    const res = {
                        ...previousResult,
                        getLatestDocs: {
                            __typename: 'DocConnection',
                            // add the received [new] docs to the head of the list, generally in order so no urgent need for sorting
                            items: graphql_config.noSort([
                                graphql_config.parseDocBody(onCreateDoc),
                                ...previousResult.getLatestDocs.items.filter(doc => doc.id !== onCreateDoc.id)
                            ]),
                            nextToken: previousResult.getLatestDocs.nextToken
                        }
                    };
                    // DON'T notify listeners of change; leave it for getDerivedStateFromProps() to process
                    //graphql_props.ownProps.onDocsChange(res.getLatestDocs.items);
                    return res;
                }
            });
        },

        /**
         * load older documents using the DocConnection from the initial query
         * @param params
         * @returns {Promise<ApolloQueryResult<any> | never>} resolved once fetchMore data completes
         */
        loadOlderDocs: (params) => {
            if (debug && false) console.log('loadOlderDocs() called, props.data:', graphql_props.data);
            // don't try to get more [older] docs if the query says there aren't any
            if (!graphql_props.data.getLatestDocs || graphql_props.data.getLatestDocs.nextToken === null) return;
            return graphql_props.data.fetchMore({
                variables: {
                    nextToken: graphql_props.data.getLatestDocs.nextToken
                },
                updateQuery: (previousResult, {fetchMoreResult, variables}) => {
                    if (debug && false) console.log('fetchMore.updateQuery() called', graphql_props);
                    // early shower if there was no result
                    if (!fetchMoreResult) return previousResult;
                    // return updated query
                    const res = {
                        ...previousResult,
                        getLatestDocs: {
                            __typename: 'DocConnection',
                            // add the received [older] docs to the end of the list, no need for sorting
                            items: graphql_config.noSort([
                                ...previousResult.getLatestDocs.items,
                                ...fetchMoreResult.getLatestDocs.items.map(graphql_config.parseDocBody),
                            ]),
                            // store the nextToken
                            nextToken: fetchMoreResult.getLatestDocs.nextToken
                        }
                    };
                    // DON'T notify listeners of change; leave it for getDerivedStateFromProps() to process
                    // graphql_props.ownProps.onDocsChange(res.getLatestDocs.items);
                    return res;
                },
            });
        }
    }),

    //
    // Library static functions
    //

    noSort: (docs) => {
        return docs;
    },

    sortCompare: (a, b) => {
        return a.created > b.created;
    },

    sort: (docs) => {
        const sorted = docs.sort(graphql_config.sortCompare);
        return sorted;
    },

    parseDocBody: (doc) => {
        return utils.parseDocBody(doc);
    }
};

/**
 * @type {React.ComponentClass<{}, any>}
 * @see https://www.apollographql.com/docs/react/api/react-apollo.html#graphql
 */
const DocsManagerWithData = graphql(GetLatestDocs, graphql_config)(DocManager);
export default DocsManagerWithData;