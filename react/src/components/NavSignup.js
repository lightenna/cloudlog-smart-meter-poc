import React from 'react'
import jquery from 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js';
import ReactGA from "react-ga";

export default class NavSignup extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        ReactGA.modalview('/signup');
    }

    componentDidMount() {
        // make email address look right when displayed
        jquery('.protected').html((index, oldhtml) => {
            return oldhtml.replace(/&amp;#x40;/,'@');
        });
    };

    render() {
        return [
            <li key={0} className="nav-item">
                <a className="nav-link" href="#signup" onClick={this.handleClick}
                   data-toggle="modal" data-target="#signupModalCenter">Beta sign-up</a>
            </li>,
            <div key={1} className="modal fade" id="signupModalCenter" tabIndex="-1" role="dialog"
                 aria-labelledby="signupModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="signupModalLongTitle">Sign-up</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>If you're interested in seeing this sort of analysis for your Cloud accounts,
                                please <a href="&#x6d;&#97;&#105;&#108;&#x74;&#111;&#58;private-betaab-signup&#x40;cloudlog.live&#63;subject&#61;Private beta sign-up" rel="noopener noreferrer">
                                    send us an email</a> for an invite to our private beta.</p>
                            <p><span className="protected">private-betaab-signup&#x40;cloudlog.live</span></p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-primary" data-dismiss="modal">Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ]
    }
}

