import React from 'react'
import utils from '../modules/Utils';
import ChartComponent from 'react-chartjs-2';
import chartjsops from '../modules/ChartJSOps';

const debug = true;

class TimelineViewChart extends React.Component {

    state;

    constructor(props) {
        super(props);
        this.state = {
            bucketted_docs: [],
            data: {},
            chartInstance: null,
            componentId: 'chartjs-' + utils.getNuid()
        };
        this.chartInstance = null;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.bucketted_docs !== prevState.bucketted_docs) {
            // newState is taken from the prevState, so newState.bucketted_docs = prevState.bucketted_docs
            const newState = prevState;
            // make newState from prevState + fields from convertBucketsToChartDatasets
            Object.assign(newState.data, chartjsops.convertBucketsToChartDatasets(nextProps.bucketted_docs, nextProps.stats));
            return newState;
        } else return null;
    }

    static getChartTitle(md) {
        let title = '';
        if (md.length) {
            const start_date = md[0].date_oldest;
            title += 'From ' + start_date + ' ' + md[0].time_oldest;
            if (md.length > 1) {
                const end_date = md[md.length - 1].date_youngest;
                title += ' to ' + (start_date !== end_date ? end_date + ' ' : '') + md[md.length - 1].time_youngest;
            }
        }
        return title;
    }

    componentDidUpdate() {
        if (this.chartInstance && typeof this.chartInstance.update === 'function') {
            this.chartInstance.update();
        }
    }

    render() {
        if (debug && false) console.log('timeline view chart', this.state.data);
        const title = this.constructor.getChartTitle(this.state.data.metadata);
        return (
            <ChartComponent
                ref={ref => {
                    this.chartInstance = ref && ref.chartInstance
                }}
                type="bar"
                data={this.state.data}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: title
                            },
                            barPercentage: 1.0,
                            categoryPercentage: 1.0,
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Number of events'
                            },
                            ticks: {
                                min: 0, // can't have less than 0 events/bucket
                                suggestedMax: 10
                            }
                        }]
                    },
                }}
            />
        );
    }
}

export default TimelineViewChart;