const Dependency = require('webpack/lib/Dependency')
const PLUGIN_NAME = 'modify-anything-webpack-plugin'
const isArray = (anything) => Array.isArray(anything)
const isMatch = (str, reg) => {
  if (isString) return str.includes(reg)

  return !!str.match(reg)
}
const isNotMatch = (str, reg) => {
  if (isString) return !str.includes(reg)
  
  return !!!str.match(reg)
}
const isString = (anything) => typeof anything === 'string' 

class TempDependency extends Dependency {
  constructor(module) {
    super()
    this.module = module
  }
}

TempDependency.Template = class Template {
  constructor(patterns = []) {
    this.patterns = patterns
  }

  apply(dep, source) {
    const { patterns = [] } = this
    const sourceValue = source.source()

    for (let i = 0; i < patterns.length; i++) {
      const { reg, newStr } = patterns[i]
      const tempReg = isString(reg)
        ? new RegExp(reg, 'g')
        : reg
      let curMatch = tempReg.exec(sourceValue)

      while(curMatch) {
        const len = curMatch[0].length
        const beginIndex = curMatch.index

        source.replace(beginIndex, beginIndex + len - 1, newStr)
        curMatch = tempReg.exec(sourceValue)
      }
    }
  }
}

module.exports = class Modify {
  constructor(options) {
    const defaultOptions = {
      include: [],
      exclude: [],
      patterns: []
    }

    this.options = Object.assign({}, defaultOptions, options)

    const {
      include,
      exclude,
      patterns
    } = this.options

    this.includes = isArray(include)
      ? include
      : [include]
    this.excludes = isArray(exclude)
      ? exclude
      : [exclude]
    this.patterns = patterns
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.dependencyTemplates.set(
        TempDependency,
        new TempDependency.Template(this.patterns)
      )
      compilation.hooks.buildModule.tap(PLUGIN_NAME, module => {
        const { request = '' } = module
        const { includes = [], excludes = [] } = this
        const isMatchReq = isMatch.bind(null, request)
        const isNotMatchReq = isNotMatch.bind(null, request)
        const isMatchPath = () => ((includes.length === 0 || includes.some(isMatchReq)) && excludes.every(isNotMatchReq))

        if (isMatchPath()) module.addDependency(new TempDependency(module))
      })
    })
  }
}
