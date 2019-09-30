import React from 'react'
import Form from 'react-bootstrap/Form'
import utils from "../modules/Utils";

class ListViewButtons extends React.Component {

    constructor(props) {
        super(props);
        this.handleCheckShow = this.handleCheckShow.bind(this);
    }

    handleCheckShow(field, e) {
        if (this.props.onCheckShow) {
            this.props.onCheckShow(field, !this.props.view[field]);
        }
    }

    render() {
        const docs = this.props.docs || [];
        const from = docs.length > 0 ? utils.getDocDate(docs[docs.length - 1]).toISOString() : 'the beginning of time';
        const to = 'present';
        return [
            <Form.Group key={1} controlId="ListViewButtons.Control1" className="show-check">
                <Form.Check onChange={(e) => this.handleCheckShow('show_date', e)} defaultChecked={this.props.view.show_date} type="checkbox" label={"date"} />
            </Form.Group>,
            <Form.Group key={2} controlId="ListViewButtons.Control2" className="show-check">
                <Form.Check onChange={(e) => this.handleCheckShow('show_time', e)} defaultChecked={this.props.view.show_time} type="checkbox" label={"time"} />
            </Form.Group>,
            <Form.Group key={3} controlId="ListViewButtons.Control3" className="show-check">
                <Form.Check onChange={(e) => this.handleCheckShow('show_cloud', e)} defaultChecked={this.props.view.show_cloud} type="checkbox" label={"cloud"} />
            </Form.Group>,
            <Form.Group key={4} controlId="ListViewButtons.Control4" className="show-check">
                <Form.Check onChange={(e) => this.handleCheckShow('show_region', e)} defaultChecked={this.props.view.show_region} type="checkbox" label={"region"} />
            </Form.Group>,
            <Form.Group key={5} controlId="ListViewButtons.Control5" className="show-check">
                <Form.Check onChange={(e) => this.handleCheckShow('show_service', e)} defaultChecked={this.props.view.show_service} type="checkbox" label={"service"} />
            </Form.Group>,
            <Form.Group key={6} controlId="ListViewButtons.Control6" className="show-check">
                <Form.Check onChange={(e) => this.handleCheckShow('show_status', e)} defaultChecked={this.props.view.show_status} type="checkbox" label={"status"} />
            </Form.Group>,
            <Form.Group key={7} controlId="ListViewButtons.Control7" className="show-check">
                <Form.Check onChange={(e) => this.handleCheckShow('show_instance', e)} defaultChecked={this.props.view.show_instance} type="checkbox" label={"instance"} />
            </Form.Group>,
            <div key={50} className="clear"></div>,
            <div key={51} className="showing form-group">Showing last {docs.length} events from {from} to {to}</div>,
        ];
    }
}

export default ListViewButtons;