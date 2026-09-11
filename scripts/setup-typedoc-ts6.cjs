#!/usr/bin/env node

// Dual-installation workaround: TypeDoc 0.28.x only supports TS ≤6.0.x,
// but the project uses TS 7.x. This script creates a local symlink so
// TypeDoc resolves TS 6 when it does require('typescript').
// See: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/

const { mkdirSync, symlinkSync, existsSync, unlinkSync } = require('fs')
const { resolve } = require('path')

const typedocModules = resolve(__dirname, '..', 'node_modules', 'typedoc', 'node_modules')
const target = resolve(__dirname, '..', 'node_modules', 'typescript6')
const link = resolve(typedocModules, 'typescript')

if (existsSync(link)) {
  unlinkSync(link)
}

mkdirSync(typedocModules, { recursive: true })
symlinkSync('../../typescript6', link)

console.log('Created symlink: node_modules/typedoc/node_modules/typescript -> typescript6')
