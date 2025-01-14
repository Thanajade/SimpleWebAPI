#!bin/bash

mkdir -p /home/ec2-user/jenkins

docker run -d --name=jenkins jenkins/jenkins:lts-jdk17 \
  -u 0 \
  -p 8080:8080 \
  -p 50000:50000 \
  -v /home/ec2-user/jenkins:/var/jenkins_home

docker run --name=jenkins \
  --user root \
  -d --privileged -v /data/jenkins:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -p 8080:8080 \
  -p 50000:50000 \
  --restart=always \
  jenkins/jenkins:lts-jdk17

docker exec -it -u root jenkins bash
