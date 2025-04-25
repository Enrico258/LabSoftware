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
                sh 'python3 -m venv venv'
                sh '. venv/bin/activate && pip install -r requirements.txt'
            }
        }

        stage('Copiar chave Firebase') {
            steps {
                sh 'cp "$FIREBASE_KEY" chave.json'
            }
        }

        stage('Rodar testes') {
            steps {
                sh '. venv/bin/activate && PYTHONPATH=src pytest tests'
            }
        }
    }
}
