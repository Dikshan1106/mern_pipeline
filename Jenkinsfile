// pipeline {
//     agent any

//     environment {
//         DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
//         DOCKER_REGISTRY = 'docker.io'
//         GITHUB_REPO = 'https://github.com/Dikshan1106/mern_pipeline.git'
//         BRANCH = 'main'
//         DOCKER_IMAGE_BACKEND = "${DOCKER_HUB_CREDENTIALS_USR}/mern-student-management-backend"
//         DOCKER_IMAGE_FRONTEND = "${DOCKER_HUB_CREDENTIALS_USR}/mern-student-management-frontend"
//         BUILD_TAG = "${BUILD_NUMBER}"
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 script {
//                     echo "Cloning repository from GitHub..."
//                     git branch: "${BRANCH}", 
//                         url: "${GITHUB_REPO}", 
//                         credentialsId: 'github-credentials'
//                 }
//             }
//         }

//         stage('Build Backend Docker Image') {
//             steps {
//                 script {
//                     echo "Building Backend Docker Image..."
//                     sh '''
//                         cd backend
//                         docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG} .
//                         docker build -t ${DOCKER_IMAGE_BACKEND}:latest .
//                         echo "Backend Docker image built successfully"
//                     '''
//                 }
//             }
//         }

//         stage('Build Frontend Docker Image') {
//             steps {
//                 script {
//                     echo "Building Frontend Docker Image..."
//                     sh '''
//                         cd frontend
//                         docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG} .
//                         docker build -t ${DOCKER_IMAGE_FRONTEND}:latest .
//                         echo "Frontend Docker image built successfully"
//                     '''
//                 }
//             }
//         }

//         stage('Login to Docker Hub') {
//             steps {
//                 script {
//                     echo "Logging in to Docker Hub..."
//                     sh '''
//                         echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin ${DOCKER_REGISTRY}
//                         echo "Docker Hub login successful"
//                     '''
//                 }
//             }
//         }

//         stage('Push Backend Image to Docker Hub') {
//             steps {
//                 script {
//                     echo "Pushing Backend image to Docker Hub..."
//                     sh '''
//                         docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG}
//                         docker push ${DOCKER_IMAGE_BACKEND}:latest
//                         echo "Backend image pushed successfully"
//                     '''
//                 }
//             }
//         }

//         stage('Push Frontend Image to Docker Hub') {
//             steps {
//                 script {
//                     echo "Pushing Frontend image to Docker Hub..."
//                     sh '''
//                         docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG}
//                         docker push ${DOCKER_IMAGE_FRONTEND}:latest
//                         echo "Frontend image pushed successfully"
//                     '''
//                 }
//             }
//         }

//         stage('Cleanup') {
//             steps {
//                 script {
//                     echo "Cleaning up Docker images..."
//                     sh '''
//                         docker logout ${DOCKER_REGISTRY}
//                         docker rmi ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG} || true
//                         docker rmi ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG} || true
//                         echo "Cleanup completed"
//                     '''
//                 }
//             }
//         }
//     }

//     post {
//         success {
//             echo "✅ Pipeline completed successfully!"
//             echo "Backend Image: ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG}"
//             echo "Frontend Image: ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG}"
//         }
//         failure {
//             echo "❌ Pipeline failed!"
//         }
//     }
// }
pipeline {
    agent any

    environment {
        // REPLACE THIS with his Docker Hub Username
        DOCKER_USER = 'ikshan' 
        
        // REPLACE THIS with his Image Name
        IMAGE_NAME = 'my-project-image' 
        
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // This pulls the code from his GitHub repo
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                script {
                    echo "Building Docker Image..."
                    // Since he is in WSL, we use 'sh' (Linux), NOT 'bat' (Windows)
                    sh "docker build -t $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG ."
                    sh "docker build -t $DOCKER_USER/$IMAGE_NAME:latest ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Pushing to Docker Hub..."
                    // He needs to create this ID in Jenkins credentials first!
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-login', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG"
                        sh "docker push $DOCKER_USER/$IMAGE_NAME:latest"
                    }
                }
            }
        }
    }
    
    post {
        always {
            sh "docker logout"
        }
    }
}