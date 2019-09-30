import GetLatestDocs from "./GetLatestDocs";

const getOlderDocsMock = {
    request: {
        query: GetLatestDocs,
        operationName: "getLatestDocs",
        variables: {
            creatorCloudId: "aws-661367319685",
            // nextToken: "eyJ2ZXJzaW9uIjoxLCJ0b2tlbiI6IkFRSUNBSGdrUU45cHVuT1Y5bGVaV2l1QkFJMXcxVUZHemErVENzSVpuckw4S1IzQzJRRlNFaGpjSFJsYWd2N3AvZlJ1cVAzZ0FBQUNlekNDQW5jR0NTcUdTSWIzRFFFSEJxQ0NBbWd3Z2dKa0FnRUFNSUlDWFFZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF3SmJ6MFRlN2djMUk5MitUSUNBUkNBZ2dJdVRGdU1jNGM3YVZxN0VUcmpIVWJ1UWREaVFzMnBIU3M4NGF3WXAyM3VrWmpZcEZvTFBaN1NOazhHMGEvdERVZGdhRkIvVGNmNW5vSWZWN3VYc0Uvb1hjdnc2R3dBTkhFRmZuU3htZXUva1Z4YkFNbW16dFRkWVlrWlBzN0FHaTAyVFBqdVJ1bjdLelBwUDdnN285WXcvcHZEVDlYVm92Zmhtb3RrZmlnVkgwTGVkN2doOXNBM2s5aDFTOGlibGtDeHQza3NLY0pxV0EyM3pLZXNzNlpybXEvWU9SMnQ2VWJsMUJydlJ2SGZXR254RURhaGJPVDFVRGo3K0VBbThVSE50TFU1ZHp4WW1sd09zZ3Q4bFhZOG1LM296ckprUURXeVZxOGZML2lWVy9LZzc2QUlaZU05by9DZEpwUjlYdWlhbGJFTmpya3Z6Z3I4Y3JnbjdScFlFU1kvZXJBSGtMTXY5TDNxM2hBekpsUTJqSTJETkdDcmtIYUVGa0FFbUJFSVgvTkorYU9Mekg0MUZLR3Aycnk3NFFiazhLRUxwUHZVZGVhQWRXWGt4Z3RWTjNSejdvL3MyOGtpbndYZVBhRFNNOEdndzQ0K2h1Z29TN3hoQlBKN3hDOVdtRk83NWpyNzE5UTlQaWFReFMycFZVYXdxc0tLUHdGcVpRVUR0YlVjMmVLR0RhTFdaREc1SGt2RVAvRFNBR1hJSFl5aHFhNS81MWZTbGVQN3FodlkxVUE1eXdtYjZlc05CTHNnZTBzQVB4Nnl2Z0ZUVEk0em1lemYzTHdFc1NzMTd0cEVzTEJTMWMzYXJhRU83aERPa2pYWDV5bWt2TWs5RkxuOEVZQ0tCeXppcmozR0JEZlpSc2orRDRxMXBSSWRMSU8wUWxFQUQzN0daYU5vL0REcmI2c2pDeFkyMXpzemEvM082clNKbGpRZ1BNT0h0aVRwYVZhSm5HRW1SSXFFdlVrNXQ3am1Od2Zuem1vRSJ9"
            // v - what the test suite passes
            nextToken: "eyJ2ZXJzaW9uIjoxLCJ0b2tlbiI6IkFRSUNBSGdrUU45cHVuT1Y5bGVaV2l1QkFJMXcxVUZHemErVENzSVpuckw4S1IzQzJRRmNUejQxeVBYbk1RUmpRa0VtRGZMUkFBQUNjekNDQW04R0NTcUdTSWIzRFFFSEJxQ0NBbUF3Z2dKY0FnRUFNSUlDVlFZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF4MEx2dE5LZnFvdzFqbyt0VUNBUkNBZ2dJbUlqRC9WbkMyUXdZSUZEdlh6bitNaG9ZVVRlQ1NIOU40dVg1SGlaWUtIWkVXbzd6NTlOZWNmWHo1NldlMmtrck5xdmtmcFJMN3FOZEtnM2xFTVlPdEErVEV5MlcrVUs1bU01Yyt1ZnVGaGhVVk1KSCtXMEFKYytlQjB0dnQxYStnWjJwd2VRbTRMb051QmtyQmxzbVpVYnkvVlBENVRaWmJjOTNzYkc5NEZkYXAzVk9wQmlGWklmaDhZeXVWNm4rM3NRcmpEck9Vcy8wbldWRFd3aEZaT3ZtTEh5d2grOFVUdHhIbGtVMDY0ZEVXRG5nTTZhenoyMERUT1IvMmk3UDN2c21ydDdLTWRzV0xieENPbkwxMnFLeS82cHZDcGdhNDlaSTZrVHc0RWlnMnBuYTNkZ2wvTElaem1VWEhCcEpkRXBpS3FKWEVDWXkvVzVUQkJiRzZEVmRPN3E5cUVXZDU0eERFSFlrS3ZVdEw0MzlYc0k3U05HU3dPZThnMHNDWXEwSUE4YlRhbE8vUktQRFlpZkFlc3ZjNUJsMzg4ZE1leG1xOVVldGRtWGZNbUYxL0VCR1RyMDArV2tsM3kxWGNSOXUzTWlSMnQ5OEFxeG93TXdkc2doZjNzejl4MTBhMUNmL1NMMFI3bkZBU3Zkb2hVVWRQL0JTVklWblV1NGM5TTQvY2hNbEJnR0VhMDd4NTZDeHl5SGZybDgvY0Y0T0t1RGNKR3A2d0Jaa3VobUtqOCt1Y0pFWXBqNkMrSGtFMW0vclJSdDQwTUpuak1kVVAwWnJhOEc5Ly9xbTRhR3dVNFRma1k1TmRjNnJtOWkrZ3FIVDRXOUZyeWtwcWNkaUdoV2UvSjRLcDFUbWt3OERVbkFXUEQ1dDhaSUpvRGZqTU84RHZMb1hMckZQYkJUQXNNalJIampPcmZoZlRaYVFqbEpEUEdvNzRvSjYzVSsveUwzR3VHdWJJdzFyaXp3PT0ifQ=="
            // v - what the browser test passes
            // nextToken: "eyJ2ZXJzaW9uIjoxLCJ0b2tlbiI6IkFRSUNBSGdrUU45cHVuT1Y5bGVaV2l1QkFJMXcxVUZHemErVENzSVpuckw4S1IzQzJRR3FLWTl3MGtnUzlQTFM5bDdSYzE1ZkFBQUNkekNDQW5NR0NTcUdTSWIzRFFFSEJxQ0NBbVF3Z2dKZ0FnRUFNSUlDV1FZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF4Q1JudG9xcWZFS1NWSDBCSUNBUkNBZ2dJcXMwS1JTTkR3TzVPM1pxUFFYeHh0TW1kRmZuaUFJak93cUJVa2pNN2RHRnlaQ2V0R3ZCVVgzclZiVXhsQTZybXN0VzRpbTJZZkVUT3FqWklRSkk0Y0s1K1BkR1RiaFkydUtSNjI3MnJrUk02akhBMnlBbTBrTUFzS2tMZ0tzaURrb0pUVE0zSlZjTWFXRFdUMEFzREszWlF1MHdJdWJIODk1MFFDNG5jL21XQmJRR1RIQUg1b3JyVmVRUVBWVHdpc0J6bjhqbVY2MTZ5K1Jxa0o4R3lRaG9VMVl3cUlCWlkzMWIrMHNmQjJtTWZKOXJpcXRYeitjWHBsT1N4eUs5SzRtVkpXZkw5alF3ZkZIcTNRTjBxRy9mL1NUdUUvS3ZaQWhZVWRhdUU5Q0N3eXJSRWthNW9JTU5ZL01UV1BHc29jTzRzc0VaUThtTFA5TUxicWhuYzVJOGV4eXFZMGNocmhvSGJydTFKOVRleWYwaHpUZUVmUXA3VWhoR2xncldQUXV3MXJvcjRxNExvZExVSDVmdEo1emNQTzE0ZE85Zk5YbHg0T1JYc2NyTkVPZU1XdU53K250NHNxeGZpc3kxNHBWVDJVci9XNXcrZVJ6SHJBcGx0U3pKMmlWbVE1cnNER3hZMzltbHR3NkpDalZCdmY5MHhtTDRORzBhUjJGMHJORlVnU2FaZ2lSZ3FNaDk4cHhER21BTWZyMTZjVnlLbEVIVjFSRnhnT212NStLQTBjaXJnRUptbGc1VzJic1ZMRWlIbnVjOElKVk1yaGpnSDlHa0hsWU9hSzNaVU9wMFAvVGtEVWJVZUdSSUNFM21pZ1NyMFk1Q1hDRzFuY2k1WFd4Y1BOb3RPUjNJcmFOam5vdEdCRnJuaDQ1eVpvUWhiVXo3dWVkam5NN2VPV3I2WWxVdkt0TmtrNE1SZ2xueEd4SlJYbEc4R1pmamliNmNINDhwOFMwelFJcXJuNHNkWjFJNFE9In0="
        },
    },
    result: {
        data: {
            getLatestDocs: {
                items: [{
                    "id": "10d122af-74b9-406b-8310-1af06fea5dae",
                    "created": 1545214123,
                    "creatorCloudId": "aws-661367319685",
                    "body": "{\n  \"version\": \"0\",\n  \"id\": \"d3a10451-a3dd-f61f-d65d-57fa9efa67d2\",\n  \"detail-type\": \"EC2 Instance State-change Notification\",\n  \"source\": \"aws.ec2\",\n  \"account\": \"661367319685\",\n  \"time\": \"2018-12-19T10:08:42Z\",\n  \"region\": \"eu-west-2\",\n  \"resources\": [\n    \"arn:aws:ec2:eu-west-2:661367319685:instance/i-01e49decb4230b3d4\"\n  ],\n  \"detail\": {\n    \"instance-id\": \"i-01e49decb4230b3d4\",\n    \"state\": \"running\"\n  }\n}",
                    "__typename": "Doc"
                }, {
                    "id": "477e51a3-c836-4d8c-a6fa-0b21ea2f67fe",
                    "created": 1545214111,
                    "creatorCloudId": "aws-661367319685",
                    "body": "{\n  \"version\": \"0\",\n  \"id\": \"5503c748-98a5-0316-85fe-9664903ab4e5\",\n  \"detail-type\": \"EC2 Instance State-change Notification\",\n  \"source\": \"aws.ec2\",\n  \"account\": \"661367319685\",\n  \"time\": \"2018-12-19T10:08:29Z\",\n  \"region\": \"eu-west-2\",\n  \"resources\": [\n    \"arn:aws:ec2:eu-west-2:661367319685:instance/i-01e49decb4230b3d4\"\n  ],\n  \"detail\": {\n    \"instance-id\": \"i-01e49decb4230b3d4\",\n    \"state\": \"pending\"\n  }\n}",
                    "__typename": "Doc"
                }, {
                    "id": "2bb15ab2-d32b-4577-9061-5e2b4c221abc",
                    "created": 1545206942,
                    "creatorCloudId": "aws-661367319685",
                    "body": "{\n  \"version\": \"0\",\n  \"id\": \"bb58a55d-ad66-f18c-abdc-3a129c23e2cf\",\n  \"detail-type\": \"EC2 Instance State-change Notification\",\n  \"source\": \"aws.ec2\",\n  \"account\": \"661367319685\",\n  \"time\": \"2018-12-19T08:09:01Z\",\n  \"region\": \"eu-west-2\",\n  \"resources\": [\n    \"arn:aws:ec2:eu-west-2:661367319685:instance/i-01e49decb4230b3d4\"\n  ],\n  \"detail\": {\n    \"instance-id\": \"i-01e49decb4230b3d4\",\n    \"state\": \"stopped\"\n  }\n}",
                    "__typename": "Doc"
                }],
                nextToken: "eyJ2ZXJzaW9uIjoxLCJ0b2tlbiI6IkFRSUNBSGdrUU45cHVuT1Y5bGVaV2l1QkFJMXcxVUZHemErVENzSVpuckw4S1IzQzJRRzlVb2Q0eU9NR2ZyTDJvN24zeGs4S0FBQUNkekNDQW5NR0NTcUdTSWIzRFFFSEJxQ0NBbVF3Z2dKZ0FnRUFNSUlDV1FZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF4aUZnWVpwc2dwcVBwZDdNUUNBUkNBZ2dJcTRFcWswbGZqSkNCb3BTeU0vUnpDckhJSkpIZkNhcnIydGJ3S3g5aHBIV01iSjdiZEZ5RHMwSUdFb0hhTE5jZTkvSnRXN0N0R3hWWDFlVDROSDNDL0JvZGtZR2N1aWtzNFRyMkRHV0FFOTNMYVFpcVNCektZVEwrM1FLSTJlQ1l4QXRYaE96WnB5Z1JUcUk4TWtiM2s2QnhidWtrNmpsMXVDWnQvRkFaWHcrTWt1VDdDNEdwZGszeEZkVjUrZnhpY25qU1d5SlZrMHQ3UFBxN1RqVDJmSkhHK3I2ajVGaWNGNE9VNzhoOEFMZGRFajZ5ckY1NktGMVFVQVlUeDNKa0djcjJVb200akJXOGFvc1A5dHlJNmFWaThoOTQwU0NOVU5yNWQyNkRuZE5HK2NkQ3VjdlU0Znhwa1RmTS9jbC82dk9HVDh2K05OeHNyVUxFN0FRbzQyNGZ3RjU2M3hWQ1FmZ1Jta3hHcnBqNyt5RWE5dW96K1pBdlBkM0twczNFeVdMMVM4aG8wWlNEb0Z6R3hvTy9YUlFHOWt5TmlpMmxrTDJUYkdhN01tMEtZMG9CdFB5Ty9zUEF1RVBmajNzOFM2TkxsTUJJdVUyYVNJN1UxWjB3emp0MGl2NG14SGxKQ0Rya1dxaDdrbXlCMitWZjlwZEtBTm5EWUU5WVFJUm5MSVRvU3kyZVA2WmxHUXJ0UlNxSUErOFk1STl3S09Cd2dYK1h0OFlMV1AvaFYxMlFhanowSXpCaml6eGErcjVSUWFxcGJCSFl3dEtBY0Z5NEM1Mmh2OTJEWWxIQnJxOGpFYjZFQnhlejNCamZtWUZ1bHVPSGo0N0VneG5kR3h5N2Q1T1U3ODlRRHdpSHZJeGY2ZEFXa3RMNWc3bjdIbjlZOW5hTXRqQ3FzM09FSmdNVnBpMTRuNnlWeUQvQno1M2xrK2g1bkI1Qk50bWplOWFXNks2M212VWNGWDBLMGcvcGlvRGc9In0=",
                __typename: "DocConnection"
            }
        }
    }
};

export default getOlderDocsMock;