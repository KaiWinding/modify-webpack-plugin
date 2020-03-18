const webpack = require('webpack')
const path = require('path')
const rimraf = require('rimraf')
const { readFileSync } = require('fs')

const Modify = require('../lib')

const lib = path.join(__dirname, '..', 'lib', 'index.js')
const src = path.join(__dirname, 'project')
const dist = path.join(__dirname, 'dist')
const output = path.join(__dirname, 'dist', 'index.js')

test('is plugin a string', () => {
  expect(typeof Modify).toBe('function')
})

const defaultOptions = {
  entry: `${src}/index.js`,
  output: {
    path: dist,
    filename: 'index.js'
  }
}

afterAll(() => {
  rimraf(dist, () => {
    return
  })
})

const testTemple = (pluginOpts, callback) => {
  rimraf(dist, (err) => {
    webpack({
      ...defaultOptions,
      plugins: [
        new Modify(pluginOpts)
      ]
    }, (err) => {
      if (err) {
        console.log('err = ', err)

        throw err
      } else {
        callback()
      }
    })
  })
}

test('does lib/index.js have unless code', () => {
  const str = readFileSync(lib, 'utf8')

  expect(/console/g.test(str)).toBeFalsy()
  expect(/debugger/g.test(str)).toBeFalsy()
})

test('delete all console', (done) => {
  const callback = () => {
    const str = readFileSync(output, 'utf8')
    expect(/console/g.test(str)).toBeFalsy()

    done()
  }

  testTemple({
    patterns: [
      { reg: /console\.log\(.*\)/g, newStr: '' },
    ]
  }, callback)
})

test('just include one file', (done) => {
  const callback = () => {
    const str = readFileSync(output, 'utf8')

    expect(/index/g.test(str)).toBeFalsy()
    expect(/utilsFile/g.test(str)).toBeTruthy()
    expect(/constantFile/g.test(str)).toBeTruthy()

    done()
  }

  testTemple({
    include: ['index'],
    patterns: [
      { 
        reg: /console\.log\(.*\)/g, newStr: ''
      },
    ]
  }, callback)
})

test('exclude some files', (done) => {
  const callback = () => {
    const str = readFileSync(output, 'utf8')

    expect(/index/g.test(str)).toBeTruthy()
    expect(/utilsFile/g.test(str)).toBeFalsy()
    expect(/constantFile/g.test(str)).toBeTruthy()

    done()
  }

  testTemple({
    exclude: ['index', 'constant'],
    patterns: [
      { 
        reg: /console\.log\(.*\)/g, newStr: ''
      },
    ]
  }, callback)
})

test('replace string', (done) => {
  const callback = () => {
    const str = readFileSync(output, 'utf8')

    expect(/Goodbye/g.test(str)).toBeTruthy()

    done()
  }

  testTemple({
    patterns: [
      { 
        reg: /indexFile/g, newStr: 'Hello World'
      },
      { 
        reg: /constantFile/g, newStr: 'Goodbye'
      },
    ]
  }, callback)
})
