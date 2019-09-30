import GetLatestDocs from "./GetLatestDocs";

/**
 * @criteria Must contain a doc with a status from at least one service and one region
 */
const getDocsMock = {
    request: {
        query: GetLatestDocs,
        operationName: "getLatestDocs",
        variables: {
            creatorCloudId: "aws-661367319685"
        },
    },
    result: {
        data: {
            getLatestDocs: {
                items: [{
                    "id": "fa2c12b4-0b65-4cf6-95a2-3bbaaa496eee",
                    "created": 1545214239,
                    "creatorCloudId": "aws-661367319685",
                    "body": "{\n  \"version\": \"0\",\n  \"id\": \"50e56899-9fac-d5a4-d595-65a68b2bb876\",\n  \"detail-type\": \"EBS Volume Notification\",\n  \"source\": \"aws.ec2\",\n  \"account\": \"661367319685\",\n  \"time\": \"2018-12-19T10:10:38Z\",\n  \"region\": \"eu-west-2\",\n  \"resources\": [\n    \"arn:aws:ec2:eu-west-2:661367319685:volume/vol-090bc82c2b295b7a5\"\n  ],\n  \"detail\": {\n    \"result\": \"deleted\",\n    \"cause\": \"\",\n    \"event\": \"deleteVolume\",\n    \"request-id\": \"09d4b49a-b19a-4962-bca3-11b111edd13e\"\n  }\n}",
                    "__typename": "Doc"
                }, {
                    "id": "179e2e70-1b13-4d05-ae0b-3e43dda87a51",
                    "created": 1545214238,
                    "creatorCloudId": "aws-661367319685",
                    "body": "{\n  \"version\": \"0\",\n  \"id\": \"de3f2da6-efd0-0308-4bca-de582b894684\",\n  \"detail-type\": \"EC2 Instance State-change Notification\",\n  \"source\": \"aws.ec2\",\n  \"account\": \"661367319685\",\n  \"time\": \"2018-12-19T10:10:38Z\",\n  \"region\": \"eu-west-2\",\n  \"resources\": [\n    \"arn:aws:ec2:eu-west-2:661367319685:instance/i-01e49decb4230b3d4\"\n  ],\n  \"detail\": {\n    \"instance-id\": \"i-01e49decb4230b3d4\",\n    \"state\": \"terminated\"\n  }\n}",
                    "__typename": "Doc"
                }, {
                    "id": "92e1d951-27e7-4b37-ae20-1277e7be3d03",
                    "created": 1545214185,
                    "creatorCloudId": "aws-661367319685",
                    "body": "{\n  \"version\": \"0\",\n  \"id\": \"010364b8-8034-7359-04ee-cfabe4b7c5e2\",\n  \"detail-type\": \"EC2 Instance State-change Notification\",\n  \"source\": \"aws.ec2\",\n  \"account\": \"661367319685\",\n  \"time\": \"2018-12-19T10:09:44Z\",\n  \"region\": \"eu-west-2\",\n  \"resources\": [\n    \"arn:aws:ec2:eu-west-2:661367319685:instance/i-01e49decb4230b3d4\"\n  ],\n  \"detail\": {\n    \"instance-id\": \"i-01e49decb4230b3d4\",\n    \"state\": \"shutting-down\"\n  }\n}",
                    "__typename": "Doc"
                }],
                nextToken: "eyJ2ZXJzaW9uIjoxLCJ0b2tlbiI6IkFRSUNBSGdrUU45cHVuT1Y5bGVaV2l1QkFJMXcxVUZHemErVENzSVpuckw4S1IzQzJRRmNUejQxeVBYbk1RUmpRa0VtRGZMUkFBQUNjekNDQW04R0NTcUdTSWIzRFFFSEJxQ0NBbUF3Z2dKY0FnRUFNSUlDVlFZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF4MEx2dE5LZnFvdzFqbyt0VUNBUkNBZ2dJbUlqRC9WbkMyUXdZSUZEdlh6bitNaG9ZVVRlQ1NIOU40dVg1SGlaWUtIWkVXbzd6NTlOZWNmWHo1NldlMmtrck5xdmtmcFJMN3FOZEtnM2xFTVlPdEErVEV5MlcrVUs1bU01Yyt1ZnVGaGhVVk1KSCtXMEFKYytlQjB0dnQxYStnWjJwd2VRbTRMb051QmtyQmxzbVpVYnkvVlBENVRaWmJjOTNzYkc5NEZkYXAzVk9wQmlGWklmaDhZeXVWNm4rM3NRcmpEck9Vcy8wbldWRFd3aEZaT3ZtTEh5d2grOFVUdHhIbGtVMDY0ZEVXRG5nTTZhenoyMERUT1IvMmk3UDN2c21ydDdLTWRzV0xieENPbkwxMnFLeS82cHZDcGdhNDlaSTZrVHc0RWlnMnBuYTNkZ2wvTElaem1VWEhCcEpkRXBpS3FKWEVDWXkvVzVUQkJiRzZEVmRPN3E5cUVXZDU0eERFSFlrS3ZVdEw0MzlYc0k3U05HU3dPZThnMHNDWXEwSUE4YlRhbE8vUktQRFlpZkFlc3ZjNUJsMzg4ZE1leG1xOVVldGRtWGZNbUYxL0VCR1RyMDArV2tsM3kxWGNSOXUzTWlSMnQ5OEFxeG93TXdkc2doZjNzejl4MTBhMUNmL1NMMFI3bkZBU3Zkb2hVVWRQL0JTVklWblV1NGM5TTQvY2hNbEJnR0VhMDd4NTZDeHl5SGZybDgvY0Y0T0t1RGNKR3A2d0Jaa3VobUtqOCt1Y0pFWXBqNkMrSGtFMW0vclJSdDQwTUpuak1kVVAwWnJhOEc5Ly9xbTRhR3dVNFRma1k1TmRjNnJtOWkrZ3FIVDRXOUZyeWtwcWNkaUdoV2UvSjRLcDFUbWt3OERVbkFXUEQ1dDhaSUpvRGZqTU84RHZMb1hMckZQYkJUQXNNalJIampPcmZoZlRaYVFqbEpEUEdvNzRvSjYzVSsveUwzR3VHdWJJdzFyaXp3PT0ifQ==",
                __typename: "DocConnection"
            }
        }
    }
};

export default getDocsMock;