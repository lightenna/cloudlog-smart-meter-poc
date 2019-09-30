import React from 'react'
import utils from "../modules/Utils";
import Form from 'react-bootstrap/Form'

class ViewNavbarCollapsing extends React.Component {

    state;

    constructor(props) {
        super(props);
        this.state = {
            componentId: 'viewNavColl-' + utils.getNuid()
        };
    }

    render() {
        const icon_class = this.props.iconClassName || "oi-cog";
        const expand_class = this.props.expandClassName || "";
        const scroll_class = this.props.scrollClassName || "content-fluid";
        return [
            <div key={0} className={"content-header collapsing navbar navbar-light " + expand_class}>
                <Form>
                    {this.props.permNav}
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target={"#" + this.state.componentId} aria-controls={this.state.componentId}
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className={"togactual oi " + icon_class}></span>
                    </button>
                    <div className="clear"></div>
                    <div className="collapse navbar-collapse" id={this.state.componentId}>
                        {this.props.collapsingNav}
                    </div>
                </Form>
            </div>,
            <div key={1} className={"" + scroll_class}>
                {this.props.body}
            </div>,
        ];
    }

}

export default ViewNavbarCollapsing;