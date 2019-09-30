import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import AWSAppSyncClient from "aws-appsync";
import {Rehydrated} from 'aws-appsync-react';
import {ApolloProvider} from 'react-apollo';
import appSyncConfig from './dynamic/aws-appsync-settings';
import * as localForage from "localforage";

// process environment variables
const ENVIRONMENT_NAME = (process.env.ENVIRONMENT || 'dev');
const URL_API_VIEWMOD = (process.env.URL_API_VIEWMOD || 'http://localhost:3001');
console.log(`Connecting to ViewMod manager (${URL_API_VIEWMOD}) in ${ENVIRONMENT_NAME} environment`);

const client = new AWSAppSyncClient({
    url: appSyncConfig.aws_appsync_graphqlEndpoint,
    region: appSyncConfig.aws_appsync_region,
    auth: {
        type: appSyncConfig.aws_appsync_authenticationType,
        apiKey: appSyncConfig.aws_appsync_apiKey,
    },
    offlineConfig: {
        storage: localForage,
    }
});

const WithProvider = () => (
    <ApolloProvider client={client}>
        <Rehydrated
            render={({rehydrated}) => (
                rehydrated ? <App appconfig={{ service: {viewmod: URL_API_VIEWMOD}, client: client, environment: ENVIRONMENT_NAME }}/> :
                    <p>Please wait, rehydrating app...</p>
            )}
        />
    </ApolloProvider>
);

ReactDOM.render(<WithProvider/>, document.getElementById('root'));