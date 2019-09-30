import gql from 'graphql-tag'

export default gql(`
    subscription NewDocSubscription ($creatorCloudId: String!){
        onCreateDoc(creatorCloudId: $creatorCloudId) {
            id
            created
            creatorCloudId
            body
        }
    }
`);
