#!/bin/bash
set -e

SKILL_DIR=$(dirname "$0")/..
PROJECT_ROOT=$(pwd)

echo "Building Docker Image..."
docker build -t rebasremodels-app:latest -f $SKILL_DIR/resources/Dockerfile .

echo "Loading Image into Kind Cluster (local cluster)..."
# Assuming the user's cluster is named "higgs-cluster" as per previous configuration
kind load docker-image rebasremodels-app:latest --name higgs-cluster

echo "Applying Kubernetes Manifests..."
# Apply the basic web deployment and service
kubectl apply -f $SKILL_DIR/resources/k8s/

echo "Checking deployment status..."
kubectl rollout restart deployment/rebasremodels-web 2>/dev/null || echo "First rollout..."
kubectl rollout status deployment/rebasremodels-web --timeout=60s

echo "Deployment Complete!"
echo "To view the application, run the following command in a separate terminal:"
echo "kubectl port-forward service/rebasremodels-web 8080:80"
echo "Then visit: http://localhost:8080"
