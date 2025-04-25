pipeline {
    agent any

    environment {
        FIREBASE_CRED = 'chave' 
    }

    stages {
        stage('Clonar repositório') {
            steps {
                git 'https://github.com/Enrico258/LabSoftware.git'
            }
        }

        stage('Instalar dependências') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Rodar testes') {
            steps {
                withCredentials([file(credentialsId: env.FIREBASE_CRED, variable: 'FIREBASE_KEY_PATH')]) {
                    sh 'PYTHONPATH=src FIREBASE_KEY_PATH=$FIREBASE_KEY_PATH pytest tests'
                }
            }
        }
    }
}
