import NewDocSubscription from '../subscriptions/NewDocSubscription'

const subscribeDocsMock = {
    request: {
        operationName: "NewDocSubscription",
        query: NewDocSubscription,
        variables: {
            creatorCloudId: "aws-661367319685"
        },
    },
    result: {
        extensions: {
            subscription: {
                "mqttConnections": [{
                    "url": "wss://a2jbpw0jxcf4ty-ats.iot.eu-west-1.amazonaws.com/mqtt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAWPCQDPICAKWUT6GU%2F20190121%2Feu-west-1%2Fiotdevicegateway%2Faws4_request&X-Amz-Date=20190121T182554Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=f639980cdd6de512ba75065efab4937d51feec24c676607bdb92a49d0320cbae&X-Amz-Security-Token=AgoGb3JpZ2luEJ7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSKAAjE5WQ4C1hwh0mZgYQVC1WwDzzUwoXGQBQ3huxLmHVgUzo%2FKM%2BUXGE6tSeDBrlRGwHbTtKNxw2y9Xa%2FXcMDvyZ6ZcUmFlsqNfDaEkmbL%2B0TdrpvqbnS0gndF2bQb9x16Ilwa7XcLn2BNprSuAldZ6KHzsiOEGpjv8FATQCLiJppx3i7qJ%2FkxFCBa5ubabu%2Fp3bd1%2FUa7%2FvGlH1BEUPlaJGqdiiPAxIisSu7fpdcRm9FMfq4WVUfWSzTmh9ZRb0Y6ERXUykHsFjtRoxvUkW%2FXmSmbIGH8%2FluASy15RCcZlrpv4a66LLqdEXJMJP8a9gZYod1zkH%2FmQ7XUpuA8FLLceF0qhAQIlP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw0NDQ2OTcxMTUxNDAiDFrmgRZif868BSHYtirYA%2Fc5ybJYZbsCkYk4fpAec%2F6%2Fa%2BMu3v6a7nmiMx20Ai9M0Q6q8U9gq6p5eIn8r416B3lKoRw3SmOapDdj6UBGvpuHnQKIJ8iCcTLuTLHC0Qg483pFFD%2FJROu5r6Vf059LuXCaWiWZzkMd6%2FujdiZFIwSB8a0fb5Ia%2FmKgo1rqVGEzrHcGwwkGL1RQO0mxvLp5qETTFxQ0uUltM64qe66qhN4k78Uc%2Bo06vSqn4GYa24MRtVy2sCCJcF3kggvGw8e7YA4G5nehOTn6l1RwalIcMcpHh2uStGh%2B8TqtFHPsWmWw2yGxKq%2FA7wdrkLl6HXrU3qvx8vRvMMd748DBy5IODd38Ao7gBEaWC1%2BoZVFIz1Lr11y5s1vzPQ2nLKInLHbn8czvtVmzjqag2RIqB2ONgNI9nB2Kll7TMgnF%2BRuIK%2FsPPyuB5M0f4n8sWhIqTbv1KICSuR0j%2B18xwJlEa345ZRYrfB6R4GG5MCDzHVXfpI2WcYC2EXwOwDv0KNlvO2OnIiJVgjk9ZUnAobWZoAlWa5HyXlS4lGLBb0omtG7wG2sgjhleT1fZz0hkks1Qn1ocefkdDETdkAR%2B9UYv5GHVteT89j45xQ%2B7e2Q%2FnhHw0kofspUVPDt09nswsp2Y4gU%3D",
                    "topics": ["013943272376/aq6zofgt5bcrjiu34knq5j6pyy/onCreateDoc/2a994783f74cb39c1c9e24676e830a75a8ecfd53416365dd1ca16da4fd22e11e"],
                    "client": "specbmrp4bfbppxdzdgk2ocfma"
                }],
                "newSubscriptions": {
                    "onCreateDoc": {
                        "topic": "013943272376/aq6zofgt5bcrjiu34knq5j6pyy/onCreateDoc/2a994783f74cb39c1c9e24676e830a75a8ecfd53416365dd1ca16da4fd22e11e",
                        "expireTime": null
                    }
                }
            }
        },
        data: {
            "onCreateDoc": null
        }
    }
};

export default subscribeDocsMock;
