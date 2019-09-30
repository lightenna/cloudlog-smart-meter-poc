import GetViews from "./GetViews";

const getViewsMock = {

    request: {
        query: GetViews,
        operationName: "getViews",
        variables: {
            creatorUserId: "1111"
        },
    },
    result: {
        data: {
            getViews: [{
                "seq": "0",
                "type": "container",
                "filter": "*",
                "subViews": [{
                    "seq": "0-0",
                    "type": "container",
                    "filter": "*",
                    "viewport": {"width": "70%", "height": "100%", "__typename": "CSSRect"},
                    "subViews": [{
                        "seq": "0-0-0",
                        "type": "instance",
                        "filter": "*",
                        "viewport": {"width": "100%", "height": "70%", "__typename": "CSSRect"},
                        "subViews": null,
                        "svSplit": null,
                        "__typename": "View"
                    }, {
                        "seq": "0-0-1",
                        "type": "timeline",
                        "filter": "*",
                        "viewport": {"width": "100%", "height": "30%", "__typename": "CSSRect"},
                        "subViews": null,
                        "svSplit": null,
                        "__typename": "View"
                    }],
                    "svSplit": "vertical",
                    "__typename": "View"
                }, {
                    "seq": "0-1",
                    "type": "list",
                    "filter": "*",
                    "viewport": {"width": "30%", "height": "100%", "__typename": "CSSRect"},
                    "subViews": null,
                    "svSplit": null,
                    "__typename": "View"
                }],
                "__typename": "View"
            }]
        }
    }
};

export default getViewsMock;