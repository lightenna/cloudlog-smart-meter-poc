import React from 'react'
import Form from 'react-bootstrap/Form'

class ViewTypeSelector extends React.Component {

    constructor(props) {
        super(props);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleSelectChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {
        const id = "ViewTypeSelector-seq-" + (this.props.seq || 'notset');
        return (
            <Form.Group className="firstleft" controlId={id}>
                <Form.Control as="select" className="view-type-selector" onChange={this.handleSelectChange} value={this.props.type}>
                    <option value={'timeline'}>Timeline</option>
                    <option value={'list'}>Event list</option>
                    <option value={'instance'}>Instances</option>
                    <option value={'instancecost'}>Projected cost</option>
                </Form.Control>
            </Form.Group>
        );
    }
}

export default ViewTypeSelector;