#!/bin/bash
# Wait for app to be ready
echo "Waiting for app..."
sleep 5

# Create Project
echo "Creating Project..."
PROJECT_QUERY='mutation { createProject(createProjectInput: { projectNumber: "PnKV-'$(date +%s)'", description: "Test Project" }) { id } }'
# Note: Escape quotes carefully
PROJECT_RES=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"query\": \"$PROJECT_QUERY\"}" http://localhost:3000/graphql)
echo "Project Response: $PROJECT_RES"
PROJECT_ID=$(echo $PROJECT_RES | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Project ID: $PROJECT_ID"

if [ -z "$PROJECT_ID" ]; then
  echo "Failed to create project"
  exit 1
fi

# Create DMPMetadata
echo "Creating Metadata..."
META_QUERY='mutation { createDMPMetadata(createDmpMetadataInput: { projectId: \"'$PROJECT_ID'\" }) { id projectId createdDate } }'
META_RES=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"query\": \"$META_QUERY\"}" http://localhost:3000/graphql)
echo "Metadata Response: $META_RES"

# Query Metadata by Project ID
echo "Querying Metadata..."
GET_QUERY='query { dmpMetadataByProject(projectId: \"'$PROJECT_ID'\") { id project { id projectNumber } } }'
GET_RES=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"query\": \"$GET_QUERY\"}" http://localhost:3000/graphql)
echo "Get Response: $GET_RES"
