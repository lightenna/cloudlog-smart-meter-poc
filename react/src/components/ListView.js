import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import 'bootstrap/dist/js/bootstrap.min.js';
import './ListView.scss';
import 'jquery';
import 'popper.js';
import ListViewDoc from "./ListViewDoc";
import ListViewButtons from "./ListViewButtons";
import ViewNavbar from "./ViewNavbarCollapsing";
const debug = true;

class ListView extends React.Component {

    state;

    constructor(props) {
        super(props);
        this.state = {
            view: {
                show_date: false,
                show_time: true,
                show_cloud: false,
                show_region: true,
                show_service: true,
                show_status: true,
                show_instance: true
            }
        };
        this.handleCheckedShow = this.handleCheckedShow.bind(this);
    }

    handleCheckedShow(field, value) {
        this.setState((prevState) => {
            const new_state = Object.assign({}, prevState);
            new_state.view[field] = value;
            return new_state;
        });
    }

    renderDoc(doc, i) {
        return (
            <CSSTransition
                key={i}
                timeout={5000}
                classNames="doc">
                <ListViewDoc doc={doc} view={this.state.view} key={i}/>
            </CSSTransition>
        );
    }

    render() {
        const docs = this.props.docs || [];
        if (debug && false) console.log('ListView docs', docs);
        const own_buttons = <ListViewButtons onCheckShow={this.handleCheckedShow} view={this.state.view} docs={docs}/>;
        const body =
            <ul className="newestAtTop">
                <TransitionGroup className={"doc-list"}>
                    {
                        // reverse() list so that new docs appear as new <li> elements at end
                        [].concat(docs).reverse().map((r, i) => this.renderDoc(r, i))
                    }
                </TransitionGroup>
            </ul>;
        return <ViewNavbar permNav={this.props.sharedButtons} collapsingNav={own_buttons} body={body} scrollClassName="content-scrollable" />;
    }
}

export default ListView;