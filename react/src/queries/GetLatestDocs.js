import gql from 'graphql-tag'

export default gql(`
    query getLatestDocs ($nextToken: String, $creatorCloudId: String){
        getLatestDocs(limit: 200, creatorCloudId: $creatorCloudId, nextToken: $nextToken) {
            items {
                id
                created
                creatorCloudId
                body
            }
            nextToken
        }
    }
`);
