pipeline {
    agent any

    environment {
        FIREBASE_KEY = credentials('chave')
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

        stage('Copiar chave Firebase') {
            steps {
                sh 'cp "$FIREBASE_KEY" chave.json'
            }
        }

        stage('Rodar testes') {
            steps {
                sh 'PYTHONPATH=src pytest tests'
            }
        }
    }
}
