import React from 'react'
import Form from 'react-bootstrap/Form'

class InstanceCostViewButtons extends React.Component {

    constructor(props) {
        super(props);
        this.handleSelectBy = this.handleSelectBy.bind(this);
        this.handleSelectPer = this.handleSelectPer.bind(this);
    }

    handleSelectBy(e) {
        if (this.props.onSelectBy) {
            this.props.onSelectBy(e.target.value);
        }
    }

    handleSelectPer(e) {
        if (this.props.onSelectPer) {
            this.props.onSelectPer(e.target.value);
        }
    }

    render() {
        return [
            <Form.Group key={0} controlId="InstanceCostViewButtons.Control1">
                <Form.Label>by:</Form.Label>
                <Form.Control as="select" onChange={this.handleSelectBy} value={this.props.by}>
                    <option value={'services'}>service</option>
                    <option value={'regions'}>region</option>
                </Form.Control>
            </Form.Group>,
            <Form.Group key={1} controlId="InstanceCostViewButtons.Control2">
                <Form.Label>per:</Form.Label>
                <Form.Control as="select" onChange={this.handleSelectPer} value={this.props.per}>
                    <option value={'hour'}>hour</option>
                    <option value={'day'}>day</option>
                    <option value={'month'}>month</option>
                    <option value={'year'}>year</option>
                </Form.Control>
            </Form.Group>,
        ];
    }
}

export default InstanceCostViewButtons;