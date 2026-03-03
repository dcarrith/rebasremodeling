#!/bin/bash
set -e

SKILL_DIR=$(dirname "$0")/..
PROJECT_ROOT=$(pwd)

echo "Building Docker Image..."
docker build -t boardforpeace-app:latest -f $SKILL_DIR/resources/Dockerfile .

echo "Loading Image into Kind Cluster..."
kind load docker-image boardforpeace-app:latest --name higgs-cluster

echo "Applying Kubernetes Manifests..."
# echo "Copying Chia Secrets..."
# kubectl delete secret chia-ca-secret -n boardforpeace --ignore-not-found
# kubectl delete secret chia-certificates-secret -n boardforpeace --ignore-not-found
#
# kubectl get secret chia-ca-secret -n chia -o yaml | sed 's/namespace: chia/namespace: boardforpeace/' | sed '/resourceVersion:/d' | sed '/uid:/d' | kubectl apply -f -
# kubectl get secret chia-certificates-secret -n chia -o yaml | sed 's/namespace: chia/namespace: boardforpeace/' | sed '/resourceVersion:/d' | sed '/uid:/d' | kubectl apply -f -

kubectl apply -f $SKILL_DIR/resources/k8s/

echo "Restarting Deployments..."
kubectl rollout restart deployment/boardforpeace-web -n boardforpeace
kubectl rollout restart deployment/boardforpeace-worker -n boardforpeace

echo "Waiting for deployments..."
kubectl rollout status deployment/boardforpeace-web -n boardforpeace --timeout=60s

echo "Running Database Migrations & Seeding Data..."
# Delete old jobs if they exist
kubectl delete job boardforpeace-migrate -n boardforpeace --ignore-not-found
kubectl delete job boardforpeace-seed -n boardforpeace --ignore-not-found
# Apply seed job (migrate:fresh --seed --force)
kubectl apply -f $SKILL_DIR/resources/k8s/03-seed-job.yaml
# Wait for seed to complete (may take up to 120s for full dataset)
kubectl wait --for=condition=complete job/boardforpeace-seed -n boardforpeace --timeout=120s

echo "Waiting for web deployment rollout..."
kubectl rollout status deployment/boardforpeace-web -n boardforpeace --timeout=60s

echo "Deployment Complete!"
echo "To view the application, run the following command in a separate terminal:"
echo "kubectl port-forward service/boardforpeace-web -n boardforpeace 8989:80"
echo "Then visit: http://localhost:8989"
