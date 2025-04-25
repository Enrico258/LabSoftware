pipeline {
    agent any

    environment {
        FIREBASE_CRED = 'chave' // ID da sua credencial
    }

    stages {
        stage('Clonar repositório') {
            steps {
                git 'https://github.com/Enrico258/LabSoftware.git'
            }
        }

        stage('Instalar dependências') {
            steps {
                sh 'python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt'
            }
        }

        stage('Rodar testes') {
            steps {
                withCredentials([file(credentialsId: env.FIREBASE_CRED, variable: 'FIREBASE_KEY_PATH')]) {
                    sh '''
                        . venv/bin/activate
                        export FIREBASE_KEY_PATH=$FIREBASE_KEY_PATH
                        PYTHONPATH=src pytest tests
                    '''
                }
            }
        }
    }
}
