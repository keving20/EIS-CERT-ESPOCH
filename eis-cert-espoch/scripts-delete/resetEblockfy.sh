#!/bin/bash
# -*- ENCODING: UTF-8 -*- 

docker stop eis-cert-espoch
docker rm eis-cert-espoch
docker rmi kgallardo97/eis-cert-espoch-app
docker run -d --name eis-cert-espoch -h eis-cert-espoch -p $1:80 -v $2/images:/usr/share/nginx/html/images:ro  -v $2/css:/usr/share/nginx/html/css:ro kgallardo97/eis-cert-espoch-app:latest 


