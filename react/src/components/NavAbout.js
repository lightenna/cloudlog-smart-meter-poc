import React from 'react'
import ReactGA from 'react-ga';
import pkg from '../../package.json';
import 'bootstrap/dist/js/bootstrap.min.js';

export default class NavAbout extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        ReactGA.modalview('/about');
    }

    render() {
        return [
            <li key={0} className="nav-item">
                <a className="nav-link" href="#about" onClick={this.handleClick}
                   data-toggle="modal" data-target="#aboutModalCenter">About</a>
            </li>,
            <div key={1} className="modal fade" id="aboutModalCenter" tabIndex="-1" role="dialog"
                 aria-labelledby="aboutModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="aboutModalLongTitle">About</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>This is a proof-of-concept for a new application called {pkg.name}.
                                This app allows you to see what's going on in your Cloud accounts in
                                real-time. While this demo account may seem unusually busy, after all it's a demo,
                                what you're seeing comes from a real AWS account.</p>
                            <p>If you're interested in seeing this sort of analysis for your Cloud accounts, please
                                sign up for our free private beta.</p>
                            <p> {pkg.name} v{pkg.version} &copy; 2019 Lightenna Ltd</p>
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

