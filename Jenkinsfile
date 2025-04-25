pipeline {
     agent any
 
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
                 sh 'PYTHONPATH=src pytest tests'
             }
         }
     }
 }
