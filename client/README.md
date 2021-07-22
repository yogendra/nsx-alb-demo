# Blue Green Testing - Client

Demo client for DNS/HTTP based blue-green deployment visualization

## Deploy

1. **Setup Probe Configuration**

    Select one of the probe mechanism and setup config for that

    a. DNS based probe: edit and Apply `client-dns.yaml`

      ```bash
      kubectl apply -f client-dns.yaml
      ```

      **OR**

    b. HTTP based probe: edit and Apply `client-http.yaml`

      ```bash
      kubectl apply -f client-dns.yaml
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

1. **Deploy Client Module**

    Edit and apply `client.yaml`

    ```bash
    kubectl apply -f client.yaml
    ```

1. Navigate to frontend url specified in the `Ingress` resource. Example: [client.nsxbg.core.cna-demo.ga](https://client.nsxbg.core.cna-demo.ga)

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

1. Set config environment variable

    **Bash**

    ```bash
    export CONFIG_JSON="$(cat test/config-http.json)"
    # OR for DNS
    export CONFIG_JSON="$(cat test/config-dns.json)"
    ```

    **Fish**

    ```bash
    set -gx CONFIG_JSON (cat test/config-http.json)
    # OR for DNS
    set -gx CONFIG_JSON (cat test/config-dns.json)
    ```

1. Run backend

    ```bash
    npm start
    ```

    Point browser to [localhost:3001](http://localhost:3001)

1. Run frontend

    ```bash
    cd client
    npm start
    ```

    Point browser to [localhost:3000](http://localhost:3000)

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
