pipeline {
    agent {
        docker {
            image 'node:22-slim'
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
        DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1329002173882699796/isCIInJpv-rvN9mSPAx5GFFVwntiM__bAGxodCtiZlunF7-WxfOjEh8flUbHjzHLmcpN'
    }
    stages {
        stage('Install Git') {
            steps {
                sh 'apt-get update && apt-get install -y git'
            }
        }
        stage('Install Docker') {
            steps {
                sh '''
                apt-get update
                apt-get install -y docker.io
                '''
            }
        }
        stage('Install AWS CLI') {
            steps {
                sh '''
                apt-get update
                apt-get install -y curl unzip
                curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                unzip awscliv2.zip
                ./aws/install
                '''
            }
        }
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
        stage('Generate Version File') {
            steps {
                echo "Current Directory"
                sh "pwd"
                sh "ls -a"
                echo "Generating version.json..."
                sh 'npm run genversion'
            }
        }
        stage('Build Production Bundle') {
            steps {
                echo "Building production bundle..."
                sh 'npm run build'
                echo "Copy version into bundle..."
                sh 'cp version.json dist/'
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
                sh "docker tag ${DOCKER_IMAGE} ${ECR_REPO}"
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
                sh "docker push ${ECR_REPO}"
            }
        }
    }
    post {
        success {
            script {
                def message = """
                ${APP_NAME} - Build ${BUILD_NUMBER} successfully!
                ${env.BUILD_URL}
                """
                notifyDiscord(message)
            }
        }
        failure {
            script {
                def message = """
                ${APP_NAME} - Build ${BUILD_NUMBER} failed!
                ${env.BUILD_URL}
                """
                notifyDiscord(message)
            }
        }
        always {
            echo "Cleaning up workspace..."
            cleanWs()
        }
    }
}

def notifyDiscord(message) {
    sh """
    curl -H "Content-Type: application/json" -X POST -d '{"content": "${message}"}' ${DISCORD_WEBHOOK_URL}
    """
}