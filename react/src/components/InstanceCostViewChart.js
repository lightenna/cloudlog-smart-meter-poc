import React from 'react'
import utils from '../modules/Utils';
import ChartComponent from 'react-chartjs-2';
import './InstanceCostViewChart.scss';
import chartjsops from '../modules/ChartJSOps';
const debug = true;

class InstanceCostViewChart extends React.Component {

    state;

    constructor(props) {
        super(props);
        this.state = {
            node_tree: {},
            data: {},
            chartInstance: null,
            componentId: 'chartjs-' + utils.getNuid()
        };
        this.chartInstance = null;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.node_tree !== prevState.node_tree) {
            // newState is taken from the prevState, so newState.node_tree = prevState.node_tree
            const newState = prevState;
            // make newState from prevState + fields from convert op
            Object.assign(newState.data, chartjsops.convertNodeTreeToChartDatasets(nextProps.node_tree, nextProps.by));
            return newState;
        } else return null;
    }

    static getTotal(metadata, per) {
        const currency = '$';
        let mux = 0;
        switch (per) {
            default :
            case 'hour' :
                mux = 1;
                break;
            case 'day' :
                mux = 1 * 24;
                break;
            case 'month' :
                mux = 1 * 24 * 30;
                break;
            case 'year' :
                mux = 1 * 24 * 365;
                break;
        }
        // zero is an acceptable value, so only test against undefined
        if (metadata !== undefined && metadata.costrate !== undefined) {
            const threshold = 0.01;
            const total = metadata.costrate * mux;
            // round off tiny values
            if (total < threshold) return '< ' + currency + threshold;
            // otherwise show 2DP
            return currency + total.toFixed(2);
        }
        return 0;
    }

    componentDidUpdate() {
        if (this.chartInstance && typeof this.chartInstance.update === 'function') {
            this.chartInstance.update();
        }
    }

    render() {
        if (debug && false) console.log('cost view chart', this.state.data);
        const total = this.constructor.getTotal(this.state.data.metadata, this.props.per);
        return (
            <div className="doughnut-wrapper">
                <ChartComponent
                    key={0}
                    ref={ref => {this.chartInstance = ref && ref.chartInstance}}
                    type="doughnut"
                    data={this.state.data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: (total === '$0' ? false : true),
                            position: "top"
                        },
                        animation: {
                            animateRotate: false
                        },
                    }}
                />
                <div key={1} className="doughnut-inner">
                    <h5>{total}</h5>
                    <p className="per">per {this.props.per}</p>
                </div>
            </div>
        );
    }
}

export default InstanceCostViewChart;