# node-starter

## Why?
I see it's hard & time consuming when deploy node app into production docker, especially with `npm install`

## Features
### Node.js preconfig
* Babel (https://github.com/babel/babel)
* nyc test coverage
* Flow type

### Fast Docker Build
* Cache yarn (Credit to: https://github.com/mfornasa/DockerYarn.git)
* Reduce docker image size by only installing production dependencies
* Leverage code rebuild:

## How it works
* build src => lib
* install production dependencies only in docker (use strategy in [this article](https://hackernoon.com/using-yarn-with-docker-c116ad289d56#.xwhb27ke5) to leverage cache)
* copy lib & package.json into docker

## How it cache
* If you don't change dependencies (for example: `yarn add ...`) => it just build `src => lib` & copy the `lib` directory into docker. Building time is same as normal `npm build`
* It you change devDependencies => it works like statement above
* If you change dependencies, it will **leverage yarn-cache** and only install the dependency you just add. And it's just **take some seconds** to do this

## Requirement
* Node.js
* Docker

## Getting started
* `git clone https://github.com/joehua87/node-starter.git`
* `yarn`
* `./build.sh`
* Test that it's work properly:
`docker run --rm joehua/node-starter node lib/bin/run.js`
* Modify src/bin/run.js
* `./build.sh`
* Run this again:
`docker run --rm joehua/node-starter node lib/bin/run.js`
* You will see that the image is up to date, and **build time** is blazing fast
