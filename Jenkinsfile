#!/usr/bin/env groovy
//
//   Copyright 2022  SenX S.A.S.
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//

import hudson.model.*

pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '3'))
  }
  environment {
    version = "${getVersion()}"
    VSCODE_PAT = credentials('VSCode_Marketplace_PAT')
    OPENVSX_PAT = credentials('Open_VSX_Registry_PAT')
  }
  stages {
    stage('Checkout') {
      steps {
        this.notifyBuild('STARTED', version)
        git poll: false, url: 'git@gitlab.com:senx/vscode-warpscriptlanguage.git'
        sh 'git fetch --tags'
        echo "Building ${version}"
      }
    }

    stage("Build") {
      steps {
        nvm('version': 'v17.1.0') {
          sh 'yarn install'
          sh 'yarn vsce package'
        }
      }
    }

    stage("Deploy") {
      options {
        timeout(time: 4, unit: 'DAYS')
      }
      when {
        beforeInput true
        buildingTag()
      }
      input {
        message 'Deploy to Microsoft Marketplace and Open VSX Registry?'
      }
      steps {
        sh 'yarn vsce publish -p $VSCODE_PAT'
        sh 'npx -y ovsx publish -p $OPENVSX_PAT'
      }
    }
  }
  post {
    success {
      this.notifyBuild('SUCCESSFUL', version)
    }
    failure {
      this.notifyBuild('FAILURE', version)
    }
    aborted {
      this.notifyBuild('ABORTED', version)
    }
    unstable {
      this.notifyBuild('UNSTABLE', version)
    }
  }
}


void notifyBuild(String buildStatus, String version) {
  // build status of null means successful
  buildStatus = buildStatus ?: 'SUCCESSFUL'
  String subject = "${buildStatus}: Job ${env.JOB_NAME} [${env.BUILD_DISPLAY_NAME}] | ${version}" as String
  String summary = "${subject} (${env.BUILD_URL})" as String
  // Override default values based on build status
  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESSFUL') {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else if (buildStatus == 'PUBLISHED') {
    color = 'BLUE'
    colorCode = '#0000FF'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

  // Send notifications
  this.notifySlack(colorCode, summary, buildStatus)
}

String getParam(String key) {
  return params.get(key)
}

void notifySlack(String color, String message, String buildStatus) {
  String slackURL = getParam('slackUrl')
  String payload = "{\"username\": \"${env.JOB_NAME}\",\"attachments\":[{\"title\": \"${env.JOB_NAME} ${buildStatus}\",\"color\": \"${color}\",\"text\": \"${message}\"}]}" as String
  sh "curl -X POST -H 'Content-type: application/json' --data '${payload}' ${slackURL}" as String
}


String getVersion() {
  return sh(returnStdout: true, script: 'git describe --abbrev=0 --tags').trim()
}
