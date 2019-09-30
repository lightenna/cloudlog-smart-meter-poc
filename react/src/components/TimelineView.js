/*!
 * TimelineView
 *   loadable component
 */
import React from 'react'
import TimelineViewButtons from "./TimelineViewButtons";
import TimelineViewChart from './TimelineViewChart';
import ViewNavbar from './ViewNavbarCollapsing';
import bucketops from '../modules/NodeBucketOps';

const debug = true;

class TimelineView extends React.Component {

    state;
    ticker_interval;

    constructor(props) {
        super(props);
        // setup defaults
        this.state = {
            docs: [],
            view: {
                timeframe: '3', // examine data within named timeframe, in mins
                bucket_count: 30, // group data into n buckets
            },
            bucketted_docs: [],
            stats: {}
        };
        this.ticker_interval = 0;
        // bind local functions to this scope
        this.handleSelectedBucketCount = this.handleSelectedBucketCount.bind(this);
        this.handleSelectedTimeframe = this.handleSelectedTimeframe.bind(this);
        this.tick = this.tick.bind(this);
    }

    /**
     * Hook called when we receive new data
     * @param nextProps
     * @param prevState
     * @param force boolean true to call manually to re-calculate derived state
     * @return {*} new state object
     */
    static getDerivedStateFromProps(nextProps, prevState, force) {
        if (force || (nextProps.docs !== prevState.docs)) {
            const resp = bucketops.parseDocs(nextProps.docs, prevState.view);
            return resp;
        } else return null;
    }

    /**
     * start the ticker when the view opens, terminate when it closes
     */
    componentDidMount() {
        this.refreshTickerInterval();
    }

    componentWillUnmount() {
        if (this.ticker_interval) clearInterval(this.ticker_interval);
    }

    /**
     * handle select box changes
     * @param value
     */
    handleSelectedBucketCount(value) {
        if (debug && false) console.log('handleSelectedBucketCount', arguments);
        // regenerate derived state (bucketted_docs etc.) based on existing state + this updated field
        const partialNewState = {
            view: {
                ...this.state.view,
                'bucket_count': value
            }
        };
        this.setState(prevState => this.constructor.getDerivedStateFromProps(prevState, partialNewState, true));
    }

    handleSelectedTimeframe(value) {
        // regenerate derived state (bucketted_docs etc.) based on existing state + this updated field
        const partialNewState = {
            view: {
                ...this.state.view,
                'timeframe': value
            }
        };
        this.setState(prevState => this.constructor.getDerivedStateFromProps(prevState, partialNewState, true));
    }

    /**
     * refresh the timeline when time progresses, even though there's no new data
     */
    tick() {
        // regenerate derived state (bucketted_docs etc.) based on existing state only as time has changed
        this.setState(prevState => this.constructor.getDerivedStateFromProps(prevState, prevState, true));
    }

    /**
     * set up a repeating callback to refresh the timeline [using tick()] as time progresses
     */
    refreshTickerInterval() {
        if (this.ticker_interval) clearInterval(this.ticker_interval);
        this.ticker_interval = setInterval(this.tick, this.state.view.timeframe * 60 * 1000 / this.state.view.bucket_count);
    }

    render() {
        if (debug && false) console.log('TimelineView render', this.state, this.props);
        const own_buttons = <TimelineViewButtons {...this.state.view} onSelectBucketCount={this.handleSelectedBucketCount} onSelectTimeframe={this.handleSelectedTimeframe} stats={this.state.stats}/>;
        const body = <TimelineViewChart bucketted_docs={this.state.bucketted_docs} stats={this.state.stats}/>;
        return <ViewNavbar permNav={this.props.sharedButtons} collapsingNav={own_buttons} body={body}/>;
    }
}

export default TimelineView;