# NSX ALB Demo

## Prerequisites

- Docker
- kubectl
- Patience

## Commands

```bash


kubectl apply -f https://projectcontour.io/quickstart/contour.yaml
kubectl create rolebinding envoy-privileged \
                                      --clusterrole=vmware-system-tmc-psp-privileged \
                                      --user=system:serviceaccount:projectcontour:envoy \
                                      -n projectcontour
kubectl rollout restart  daemonset.apps/envoy                   
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.4.0/cert-manager.yaml


k create deployment green --image=ealen/echo-server:0.5.1 -o yaml --dry-run=client >  green.yaml
k create deployment blue --image=ealen/echo-server:0.5.1 -o yaml --dry-run=client >  blue.yaml


kubectl create rolebinding client-privileged \
--clusterrole=vmware-system-tmc-psp-privileged \
--user=system:serviceaccount:default:default \
-n default
```

## Credits

* [React ChartJS Dashboard](https://www.createwithdata.com/react-chartjs-dashboard/)
