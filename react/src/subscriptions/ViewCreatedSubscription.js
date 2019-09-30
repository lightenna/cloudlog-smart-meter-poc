import gql from 'graphql-tag'

export default gql(`
    subscription ViewCreatedSubscription ($ownerId: String!){
        onCreateView($ownerId: $ownerId) {
            seq
            type
            filter
        }
    }
`);
