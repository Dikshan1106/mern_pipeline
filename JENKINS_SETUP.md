## Jenkins Setup Guide for MERN Student Management

### Prerequisites
1. Jenkins installed and running
2. Docker installed on Jenkins server
3. GitHub account and repository
4. Docker Hub account

### Step 1: Create GitHub Credentials in Jenkins

1. Go to Jenkins Dashboard
2. Click "Manage Jenkins" → "Manage Credentials"
3. Click "Global" → "Add Credentials"
4. Select "Username and password"
5. Enter:
   - Username: your GitHub username
   - Password: your GitHub personal access token (with repo access)
   - ID: `github-credentials`
6. Click "Create"

### Step 2: Create Docker Hub Credentials in Jenkins

1. Go to Jenkins Dashboard
2. Click "Manage Jenkins" → "Manage Credentials"
3. Click "Global" → "Add Credentials"
4. Select "Username and password"
5. Enter:
   - Username: your Docker Hub username
   - Password: your Docker Hub password
   - ID: `docker-hub-credentials`
6. Click "Create"

### Step 3: Create a New Pipeline Job

1. Click "New Item"
2. Enter name: `mern-student-management-pipeline`
3. Select "Pipeline"
4. Click "OK"

### Step 4: Configure Pipeline

1. In the pipeline job configuration:
2. Under "Pipeline" section:
   - Select "Pipeline script from SCM"
   - SCM: Select "Git"
   - Repository URL: `https://github.com/YOUR_USERNAME/mern-student-management.git`
   - Credentials: Select `github-credentials`
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`

3. Click "Save"

### Step 5: Update Jenkinsfile

Replace `YOUR_USERNAME` in the Jenkinsfile with your actual GitHub username:

```groovy
GITHUB_REPO = 'https://github.com/YOUR_USERNAME/mern-student-management.git'
```

### Step 6: Push to GitHub

```bash
cd mern-student-management
git init
git add .
git commit -m "Initial commit with Jenkinsfile"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mern-student-management.git
git push -u origin main
```

### Step 7: Run the Pipeline

1. Go back to Jenkins Dashboard
2. Click on `mern-student-management-pipeline`
3. Click "Build Now"
4. Monitor the build in "Console Output"

### Pipeline Stages

1. **Checkout**: Clones the GitHub repository
2. **Build Backend Docker Image**: Builds Docker image for backend
3. **Build Frontend Docker Image**: Builds Docker image for frontend
4. **Login to Docker Hub**: Authenticates with Docker Hub
5. **Push Backend Image**: Pushes backend image to Docker Hub
6. **Push Frontend Image**: Pushes frontend image to Docker Hub
7. **Cleanup**: Removes local images and logs out

### Environment Variables in Jenkins

- `DOCKER_HUB_CREDENTIALS`: Docker Hub credentials
- `GITHUB_REPO`: GitHub repository URL
- `BRANCH`: Git branch to build from
- `DOCKER_IMAGE_BACKEND`: Docker Hub backend image name
- `DOCKER_IMAGE_FRONTEND`: Docker Hub frontend image name
- `BUILD_TAG`: Build number as image tag

### Docker Hub Image Structure

After successful build, images will be available:
- `your-docker-username/mern-student-management-backend:1` (build 1)
- `your-docker-username/mern-student-management-backend:latest`
- `your-docker-username/mern-student-management-frontend:1` (build 1)
- `your-docker-username/mern-student-management-frontend:latest`

### Webhook Setup for Automatic Builds

To automatically trigger builds when pushing to GitHub:

1. Go to your GitHub repository
2. Click "Settings" → "Webhooks" → "Add webhook"
3. Payload URL: `http://YOUR_JENKINS_URL:8080/github-webhook/`
4. Content type: `application/json`
5. Events: Select "Push events"
6. Click "Add webhook"

Now every push to main branch will trigger the Jenkins pipeline.

### Troubleshooting

**Docker command not found:**
- Install Docker on Jenkins server
- Add Jenkins user to docker group: `sudo usermod -aG docker jenkins`
- Restart Jenkins

**Permission denied while trying to connect to Docker:**
- Check Jenkins user has docker permission
- Restart Jenkins: `sudo systemctl restart jenkins`

**GitHub credentials not working:**
- Use GitHub Personal Access Token, not password
- Token needs `repo` and `admin:repo_hook` scopes

**Docker Hub push fails:**
- Verify Docker Hub credentials are correct
- Check image name format: `username/repo-name`
- Ensure Docker Hub account has push permission

### Next Steps

1. Monitor builds in Jenkins Dashboard
2. Check Docker Hub for uploaded images
3. Pull images locally: `docker pull your-username/mern-student-management-backend:latest`
4. Run with docker-compose using pushed images
5. Set up additional webhooks or scheduled builds as needed
