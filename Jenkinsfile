pipeline {
    agent any

    environment {
        APP_NAME        = "academic_recommendation"
        DOCKERHUB_USER  = "jilyass"
        IMAGE_NAME      = "${DOCKERHUB_USER}/${APP_NAME}"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        IMAGE_LATEST    = "${IMAGE_NAME}:latest"
        IMAGE_VERSIONED = "${IMAGE_NAME}:${IMAGE_TAG}"
        DOCKERHUB_CREDS = credentials('dockerhub-credentials')
        K8S_NAMESPACE   = "default"
        K8S_DEPLOYMENT  = "academic-recommendation-deployment"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            // Jenkins clone automatiquement ton repo GitHub
            // scm = Source Control Management = la config GitHub du job
            steps {
                echo "Clonage du repo depuis GitHub..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            // Docker build lit ton Dockerfile
            // Il fait npm install + npm run build DANS le container
            // Pas besoin de Node sur Jenkins
            steps {
                echo "Construction de l image Docker..."
                sh """
                    docker build \
                        -t ${IMAGE_VERSIONED} \
                        -t ${IMAGE_LATEST} \
                        .
                """
                sh "docker images | grep ${APP_NAME}"
            }
        }

        stage('Push to Docker Hub') {
            // DOCKERHUB_CREDS_USR = username extrait automatiquement
            // DOCKERHUB_CREDS_PSW = password extrait automatiquement
            // Jenkins fait ça automatiquement avec credentials()
            steps {
                echo "Push vers Docker Hub..."
                sh "echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin"
                sh "docker push ${IMAGE_VERSIONED}"
                sh "docker push ${IMAGE_LATEST}"
                echo "Image poussée : ${IMAGE_VERSIONED}"
            }
            post {
                always {
                    sh 'docker logout'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            // kubectl apply lit tes fichiers k8s/
            // Il met à jour le deployment sur le cluster
            // kubectl set image met à jour l image avec le nouveau tag
            steps {
                echo "Déploiement sur Kubernetes..."
                sh "kubectl apply -f k8s/ --namespace=${K8S_NAMESPACE}"
                sh """
                    kubectl set image deployment/${K8S_DEPLOYMENT} \
                        academic-recommendation=${IMAGE_VERSIONED} \
                        --namespace=${K8S_NAMESPACE}
                """
                sh """
                    kubectl rollout status deployment/${K8S_DEPLOYMENT} \
                        --namespace=${K8S_NAMESPACE} \
                        --timeout=120s
                """
                echo "Déploiement terminé."
            }
        }
    }

    post {
        success {
            echo "Pipeline réussi ! Image : ${IMAGE_VERSIONED}"
        }
        failure {
            echo "Pipeline échoué. Consulte les logs."
        }
        always {
            sh "docker rmi ${IMAGE_VERSIONED} ${IMAGE_LATEST} 2>/dev/null || true"
            cleanWs()
        }
    }
}
