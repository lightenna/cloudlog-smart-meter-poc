import React from 'react'
import utils from "../modules/Utils";
import Form from 'react-bootstrap/Form'

class ViewNavbarStatic extends React.Component {

    state;

    constructor(props) {
        super(props);
        this.state = {
            componentId: 'viewNavStat-' + utils.getNuid()
        };
    }

    render() {
        const scroll_class = this.props.scrollClassName || "content-fluid";
        return [
            <div key={0} className="content-header static navbar">
                <Form>
                    {this.props.permNav}
                    {this.props.collapsingNav}
                </Form>
            </div>,
            <div key={1} className={"" + scroll_class}>
                {this.props.body}
            </div>,
        ];
    }

}

export default ViewNavbarStatic;