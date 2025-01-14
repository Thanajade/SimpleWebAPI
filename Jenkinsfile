pipeline {
    agent {
        docker {
            image 'node:22-alpine' // Use the Node.js 22 Alpine Docker image
        }
    }
    environment {
        APP_NAME = "SimpleWebAPI"
        DOCKER_IMAGE = "simplewebapi:latest"
        AWS_ACCOUNT_ID = "220140342356"
        AWS_REGION = "ap-southeast-1"
        ECR_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/softsmith/${DOCKER_IMAGE}"
        AWS_CREDENTIALS = 'aws-credentials' // ID of AWS credentials in Jenkins
        GIT_CREDENTIALS = 'github-credentials' // ID of GitHub credentials in Jenkins
    }
    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Thanajade/SimpleWebAPI.git',
                        credentialsId: GIT_CREDENTIALS
                    ]]
                ])
            }
        }
        stage('Install Dependencies') {
            steps {
                echo "Installing project dependencies..."
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                echo "Running tests..."
                sh 'npm test'
            }
        }
        stage('Build Production Bundle') {
            steps {
                echo "Building production bundle..."
                sh 'npm run build'
            }
        }
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${DOCKER_IMAGE} -f Dockerfile.webpack.alpine ."
            }
        }
        stage('Tag Docker Image') {
            steps {
                echo "Tagging Docker image for ECR..."
                sh "docker tag ${DOCKER_IMAGE} ${ECR_REPO}:latest"
            }
        }
        stage('Login to AWS ECR') {
            steps {
                withAWS(credentials: AWS_CREDENTIALS, region: AWS_REGION) {
                    sh """
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    """
                }
            }
        }
        stage('Push Docker Image to ECR') {
            steps {
                echo "Pushing Docker image to AWS ECR..."
                sh "docker push ${ECR_REPO}:latest"
            }
        }
    }
    post {
        always {
            echo "Cleaning up workspace..."
            cleanWs()
        }
        success {
            echo "Build completed successfully!"
        }
        failure {
            echo "Build failed!"
        }
    }
}