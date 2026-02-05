import urllib.request
import json
import time

url = 'http://localhost:3000/graphql'

print("Waiting for app...")
time.sleep(5)

def run_query(query):
    data = json.dumps({'query': query}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as f:
            res = f.read().decode('utf-8')
            return json.loads(res)
    except Exception as e:
        print(f"Request failed: {e}")
        return None

# Create Project
project_num = f"PnKV-{int(time.time())}"
print(f"Creating Project {project_num}...")
query = """
mutation {
  createProject(createProjectInput: { projectNumber: "%s", description: "Test Project" }) {
    id
  }
}
""" % project_num

res = run_query(query)
print("Project Res:", res)
if not res or 'errors' in res:
    print("Failed to create project")
    exit(1)
project_id = res['data']['createProject']['id']
print(f"Project ID: {project_id}")

# Create Metadata
print("Creating Metadata...")
query = """
mutation {
  createDMPMetadata(createDmpMetadataInput: { projectId: "%s" }) {
    id
    projectId
    createdDate
  }
}
""" % project_id

res = run_query(query)
print("Meta Res:", res)
if not res or 'errors' in res:
    print("Failed to create metadata")
    exit(1)
meta_id = res['data']['createDMPMetadata']['id']
print(f"Meta ID: {meta_id}")

# Query
print("Querying...")
query = """
query {
  dmpMetadataByProject(projectId: "%s") {
    id
    project {
      id
      projectNumber
    }
  }
}
""" % project_id

res = run_query(query)
print("Get Res:", res)
if not res or 'errors' in res:
     print("Failed to query")
     exit(1)

print("Verification SUCCESS")
