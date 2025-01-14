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
                apt-get install -y unzip
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
                echo "Generating version.json..."
                script {
                    def buildTimestamp = new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone('UTC'))
                    def timezone = TimeZone.getDefault().getID()
                    def gitHash = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                    def gitBranch = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()

                    def versionInfo = [
                        buildTimestamp: buildTimestamp,
                        timezone: timezone,
                        gitHash: gitHash,
                        gitBranch: gitBranch
                    ]

                    writeFile file: 'version.json', text: groovy.json.JsonOutput.toJson(versionInfo)
                }
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