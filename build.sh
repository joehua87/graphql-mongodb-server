#!/bin/bash

mkdir -p .docker && touch .docker/yarn.lock
# ./init-docker-build.js

IMAGE_NAME="joehua/node-starter"

npm run build

# Init empty cache file
if [ ! -f .yarn-cache.tgz ]; then
  echo "Init empty .yarn-cache.tgz"
  tar cvzf .yarn-cache.tgz --files-from /dev/null
fi

docker build -t $IMAGE_NAME .

docker run --rm --entrypoint cat $IMAGE_NAME:latest /tmp/yarn.lock > /tmp/yarn.lock
if ! diff -q .docker/yarn.lock /tmp/yarn.lock > /dev/null  2>&1; then
  echo "Saving Yarn cache"
  docker run --rm --entrypoint tar $IMAGE_NAME:latest -czf - /root/.cache/yarn/ > .yarn-cache.tgz
  echo "Saving yarn.lock"
  cp /tmp/yarn.lock .docker/yarn.lock
fi
