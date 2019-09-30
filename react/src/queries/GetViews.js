import gql from 'graphql-tag'

export default gql(`
    query getViews ($creatorUserId: String){
        getViews(creatorUserId: $creatorUserId) {
            seq
            type
            filter
            subViews {
                seq
                type
                filter
                viewport {
                    width
                    height
                }
                subViews {
                    seq
                    type
                    filter
                    viewport {
                        width
                        height
                    }
                    subViews {
                        seq
                        type
                        filter
                        viewport {
                            width
                            height
                        }
                        svSplit
                    }
                    svSplit
                }
                svSplit
            }
        }
    }
`);
