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
