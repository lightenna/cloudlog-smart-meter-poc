import React, { Component } from 'react';
import ReactGA from 'react-ga';
import ViewManager from './ViewManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import './App.scss';

class App extends Component {

    componentDidMount() {
        // fire up analytics
        if (this.props.appconfig && this.props.appconfig.environment) {
            switch (this.props.appconfig.environment) {
                default :
                case 'dev' :
                case 'staging' :
                    console.warn(`${this.props.appconfig.environment} environment detected.  Google Analytics events will not be sent.`);
                    break;
                case 'prod' :
                    ReactGA.initialize('UA-25142278-19');
                    ReactGA.pageview(window.location.pathname + window.location.search);
                    break;
            }
        }
    }

    render() {
        // <ViewManager appconfig={this.props.appconfig} creatorCloudId={"aws-661367319685"} creatorUserId={"1111"} />
        // <ViewManager appconfig={this.props.appconfig} creatorCloudId={"azure-913f9af6-94b2-4f5b-82bc-c83e54437e9d"} creatorUserId={"1111"} />
        return (
            <div className="app poc">
                <ViewManager appconfig={this.props.appconfig} creatorCloudId={"aws-661367319685"} creatorUserId={"1111"} />
            </div>
        );
    }
}

export default App;
