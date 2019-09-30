import React from 'react'
import Form from 'react-bootstrap/Form'

class InstanceViewButtons extends React.Component {

    constructor(props) {
        super(props);
        this.handleSelectNesting = this.handleSelectNesting.bind(this);
        this.handleCheckOnlylive = this.handleCheckOnlylive.bind(this);
    }

    handleSelectNesting(e) {
        if (this.props.onSelectNesting) {
            this.props.onSelectNesting(e.target.value);
        }
    }

    handleCheckOnlylive(e) {
        if (this.props.onCheckOnlylive) {
            this.props.onCheckOnlylive(!this.props.onlylive);
        }
    }

    render() {
        return [
            <Form.Group key={0} controlId="InstanceViewButtons.Control1">
                <Form.Label>nesting:</Form.Label>
                <Form.Control as="select" onChange={this.handleSelectNesting} value={this.props.order}>
                    <option value={'firstreg'}>Region -> Service -> Instance</option>
                    <option value={'firstserv'}>Service -> Region -> Instance</option>
                </Form.Control>
            </Form.Group>,
            <Form.Group key={1} controlId="InstanceViewButtons.Control2">
                <Form.Check onChange={this.handleCheckOnlylive} defaultChecked={this.props.onlylive} type="checkbox" label={"only live"} />
            </Form.Group>,
        ];
    }
}

export default InstanceViewButtons;