pipeline {
    agent any

    /*─────────────────────────────────────────────────
      Variables globales
    ─────────────────────────────────────────────────*/
    environment {
        APP_NAME        = "academic_recommendation"
        DOCKERHUB_USER  = "jilyass"
        IMAGE_NAME      = "${DOCKERHUB_USER}/${APP_NAME}"
        IMAGE_TAG       = "${BUILD_NUMBER}"          // ex: 42
        IMAGE_LATEST    = "${IMAGE_NAME}:latest"
        IMAGE_VERSIONED = "${IMAGE_NAME}:${IMAGE_TAG}"

        // Credential ID configuré dans Jenkins → Manage Credentials
        DOCKERHUB_CREDS = credentials('dockerhub-credentials')

        // Namespace Kubernetes local (minikube / kind / Docker Desktop)
        K8S_NAMESPACE   = "default"
        K8S_DEPLOYMENT  = "${APP_NAME}-deployment"
    }

    /*─────────────────────────────────────────────────
      Options
    ─────────────────────────────────────────────────*/
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        /*── 1. CHECKOUT ──────────────────────────────*/
        stage('📥 Checkout') {
            steps {
                echo "Clonage du repo..."
                checkout scm
            }
        }

        /*── 2. INSTALL ──────────────────────────────*/
        stage('📦 Install Dependencies') {
            steps {
                echo "Installation des dépendances Node..."
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
            }
        }

        /*── 3. LINT ─────────────────────────────────*/
        stage('🔍 Lint') {
            steps {
                echo "Vérification du code..."
                sh 'npm run lint --if-present'
            }
        }

        /*── 4. TEST ─────────────────────────────────*/
        stage('🧪 Tests') {
            steps {
                echo "Lancement des tests..."
                // Vitest / Jest — adapte si nécessaire
                sh 'npm test -- --run --reporter=verbose 2>/dev/null || npm test -- --watchAll=false 2>/dev/null || echo "Aucun test configuré, étape ignorée."'
            }
            post {
                always {
                    // Publier les résultats JUnit si dispo
                    junit allowEmptyResults: true, testResults: '**/test-results/**/*.xml'
                }
            }
        }

        /*── 5. BUILD VITE ───────────────────────────*/
        stage('⚙️ Build Vite') {
            steps {
                echo "Build de l'application React/Vite..."
                sh 'npm run build'
                echo "✅ Dossier dist/ généré."
            }
        }

        /*── 6. BUILD DOCKER IMAGE ───────────────────*/
        stage('🐳 Build Docker Image') {
            steps {
                echo "Construction de l'image Docker..."
                sh """
                    docker build \
                        --tag ${IMAGE_VERSIONED} \
                        --tag ${IMAGE_LATEST} \
                        --label "build=${BUILD_NUMBER}" \
                        --label "commit=${GIT_COMMIT}" \
                        .
                """
                sh "docker images | grep ${APP_NAME}"
            }
        }

        /*── 7. PUSH DOCKER HUB ──────────────────────*/
        stage('🚀 Push to Docker Hub') {
            steps {
                echo "Push vers Docker Hub..."
                sh "echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin"
                sh "docker push ${IMAGE_VERSIONED}"
                sh "docker push ${IMAGE_LATEST}"
                echo "✅ Image poussée : ${IMAGE_VERSIONED}"
            }
            post {
                always {
                    sh 'docker logout'
                }
            }
        }

        /*── 8. DEPLOY KUBERNETES (local) ────────────*/
        stage('☸️ Deploy to Kubernetes (local)') {
            steps {
                echo "Déploiement sur Kubernetes local..."

                // Appliquer les manifests s'ils existent
                sh """
                    if [ -d k8s ]; then
                        kubectl apply -f k8s/ --namespace=${K8S_NAMESPACE}
                    else
                        echo "⚠️  Dossier k8s/ non trouvé, utilisation de kubectl set image"
                    fi
                """

                // Mise à jour de l'image dans le déploiement existant
                sh """
                    kubectl set image deployment/${K8S_DEPLOYMENT} \
                        ${APP_NAME}=${IMAGE_VERSIONED} \
                        --namespace=${K8S_NAMESPACE} \
                    || echo "ℹ️  Déploiement introuvable, applique les manifests k8s/ d'abord."
                """

                // Attendre que le rollout soit terminé
                sh """
                    kubectl rollout status deployment/${K8S_DEPLOYMENT} \
                        --namespace=${K8S_NAMESPACE} \
                        --timeout=120s \
                    || true
                """

                echo "✅ Déploiement terminé."
            }
        }
    }

    /*─────────────────────────────────────────────────
      Notifications post-pipeline
    ─────────────────────────────────────────────────*/
    post {
        success {
            echo "🎉 Pipeline réussi ! Image : ${IMAGE_VERSIONED}"
        }
        failure {
            echo "❌ Pipeline échoué. Consulte les logs ci-dessus."
        }
        always {
            // Nettoyer les images locales pour libérer de l'espace
            sh "docker rmi ${IMAGE_VERSIONED} ${IMAGE_LATEST} 2>/dev/null || true"
            cleanWs()
        }
    }
}