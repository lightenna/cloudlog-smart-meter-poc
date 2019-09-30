import {MockedProvider} from 'react-apollo/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import subscribeDocsMock from '../subscriptions/NewDocSubscription.mock';
import getDocsMock from "../queries/GetLatestDocs.mock";

const WithProvider = () => (
    <MockedProvider mocks={[getDocsMock, subscribeDocsMock]} addTypename={false} removeTypename>
        <App appconfig={{client: {}, service: {}}}/>
    </MockedProvider>
);

describe('App component', () => {

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<WithProvider/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

});
