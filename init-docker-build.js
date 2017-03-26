#!/usr/bin/env node

// @flow

/*
 * Create package.json & yarn.lock for yarn to install dependencies
 */

const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')

const dependencies = JSON.parse(fs.readFileSync('./package.json', 'utf8')).dependencies
const dockerdir = path.join(__dirname, '.docker')
mkdirp.sync(dockerdir)
fs.writeFileSync(path.join(dockerdir, 'package.json'), JSON.stringify({ dependencies }, null, 2))
