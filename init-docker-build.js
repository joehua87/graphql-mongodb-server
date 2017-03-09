#!/usr/bin/env node

// @flow

/*
 * Create package.json & yarn.lock for yarn to install dependencies
 */

const fs = require('fs')

const dependencies = JSON.parse(fs.readFileSync('./package.json', 'utf8')).dependencies
fs.writeFileSync('./.docker/package.json', JSON.stringify({ dependencies }, null, 2))
