pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }
        stage('install') {
            steps {
                sh 'npm install'
            }
        }
//         stage('test') {
//             steps {
//                 sh 'npm run ng test'
//             }
//         }
        stage('build') {
            steps {
                sh 'npm run ng build -- --prod --base-href=.'
            }
        }
        stage('deploy') {
            steps {
                sh '''
                  git pull --tags origin $GIT_BRANCH
                  version=$(git describe)
                  sed -i -e "s/<!--build_number-->/${version}/g" $WORKSPACE/dist/blog-website/index.html
                  mkdir -p /var/www/html/blog.ienza.tech/$GIT_BRANCH
                  cp -R $WORKSPACE/dist/blog-website/* /var/www/html/blog.ienza.tech/$GIT_BRANCH/
                '''
            }
        }
    }
}
