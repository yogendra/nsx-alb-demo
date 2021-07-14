# CLIENT V2

Demo client for DNS/HTTP based blue-green deployment

## Deploy

1. **Setup Probe**

    Select one of the probe mechanism and setup config for that

    a. DNS based probe: edit and Apply `client-v2-dns.yaml`

      ```bash
      kubectl apply -f client-v2-dns.yaml
      ```



    b. HTTP based probe: edit and Apply `client-v2-http.yaml`

      ```bash
      kubectl apply -f client-v2-dns.yaml
      ```

    **Configuration Options**
    |value|Meaning | Example |
    |-|-|-|
    |`port` | Port on which server should run (Number) | `5000` |
    |`endpoint.address` | Addres of the endpoint to probe. (URL) | `https://mysite.com` | |
    |`endpoint.type` | Type of endpoint - `web` or `dns` | `web`, `dns`| |
    |`endpoint.versions` | Version names. Required for web type endpoint (Array of string) | `["blue","green"]` | |
    |`endpoint.nameservers` | List of name servers. Required for dns type endpoint | `["8.8.8.8","4.4.4.4"]`|
    |`endpoint.versionMap` | Map IP addresses to version, Required for dns type endpoint | `{"10.0.0.1": "blue", "10.0.0.2": "green"}`|
    | `probe.interval` | Amount of time in milliseconds between probes. (Number) | `10`|
    | `sample.interval` | Amount of time in milliseconds between capturing sample (Number) | `10` |
    | `sample.max` | Maximum samples to keep (Number) | `600`|
    | `graph.colors` | Array of colors names for the graph | `["blue","green"]` |

1. **Deploy application**

    Edit and apply `client-v2.yaml`

    ```bash
    kubectl apply -f client-v2.yaml
    ```

## Build

1. Build docker container

    ```bash
    npm run docker-build
    ```

1. Push image

    ```bash
    npm run docker-publish
    ```

## Develop

1. Run backend

    ```bash
    set CONFIG_JSON (cat config.json)
    export CONFIG_JSON="$(cat config.json)"
    npm start
    ```

    Point browser to http://localhost:3001

1. Run frontend

    ```bash
    cd client
    npm start
    ```

    Point browser to http://localhost:3000

## Testing / Running

### Test - Backend

1. DNS based probing
    1. Change DNS to 50:50

        ```bash
        aws route53 change-resource-record-sets --hosted-zone-id=Z00790433JF8Q9KA66EHM  --change-batch file://test/dns0.json
        ```

    1. Change DNS to 100:0

        ```bash
        aws route53 change-resource-record-sets --hosted-zone-id=Z00790433JF8Q9KA66EHM  --change-batch file://test/dns1.json
        ```

    1. Change DNS to 0:100

        ```bash
        aws route53 change-resource-record-sets --hosted-zone-id=Z00790433JF8Q9KA66EHM  --change-batch file://test/dns2.json
        ```

1. Change HTTP

    1. Change HTTP to 50:50
    1. Change HTTP to 100:0
    1. Change HTTP to 0:100
