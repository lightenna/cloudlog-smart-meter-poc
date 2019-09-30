import React from 'react'
import Form from 'react-bootstrap/Form'

class TimelineViewButtons extends React.Component {

    constructor(props) {
        super(props);
        this.handleSelectBucketCount = this.handleSelectBucketCount.bind(this);
        this.handleSelectTimeframe = this.handleSelectTimeframe.bind(this);
    }

    handleSelectBucketCount(e) {
        if (this.props.onSelectBucketCount) {
            this.props.onSelectBucketCount(e.target.value);
        }
    }

    handleSelectTimeframe(e) {
        if (this.props.onSelectTimeframe) {
            this.props.onSelectTimeframe(e.target.value);
        }
    }

    render() {
        return [
            <Form.Group key={0} controlId="TimelineViewButtons.Control1">
                <Form.Label>granularity:</Form.Label>
                <Form.Control as="select" onChange={this.handleSelectBucketCount} value={this.props.bucket_count}>
                    <option value={7}>7 buckets</option>
                    <option value={14}>14 buckets</option>
                    <option value={30}>30 buckets</option>
                </Form.Control>
            </Form.Group>,
            <Form.Group key={1} controlId="TimelineViewButtons.Control2">
                <Form.Label>timeframe:</Form.Label>
                <Form.Control as="select" onChange={this.handleSelectTimeframe} value={this.props.timeframe}>
                    <option value={'all'}>automatic (all loaded data)</option>
                    <option value={'0.5'}>last 30 seconds</option>
                    <option value={'3'}>last 3 minutes</option>
                    <option value={'12'}>last 12 minutes</option>
                    <option value={'60'}>last 60 minutes</option>
                    <option value={'360'}>last 6 hours</option>
                    <option value={'1440'}>last 24 hours</option>
                    <option value={'10080'}>last 7 days</option>
                    <option value={'43200'}>last 30 days</option>
                </Form.Control>
            </Form.Group>,
        ];
    }
}

export default TimelineViewButtons;