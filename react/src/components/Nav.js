import React from 'react'
import NavAbout from './NavAbout';
import NavSignup from './NavSignup';
import pkg from '../../package.json';
import 'bootstrap/dist/js/bootstrap.min.js';

export default class Nav extends React.Component {
    render() {
        return (
            <nav className="navbar topnav fixed-top navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">{pkg.name}</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <NavAbout/>
                        <NavSignup/>
                        {/*
                          * Account menu, but not yet
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Account
                            </a>
                            <div className="dropdown-menu shadow-sm" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        */}
                    </ul>
                    {/*
                      * No use for search yet
                    <form className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                    */}
                    <div className={"shared-buttons"}>
                        { this.props.sharedButtons }
                    </div>
                </div>
            </nav>
        )
    }
}

