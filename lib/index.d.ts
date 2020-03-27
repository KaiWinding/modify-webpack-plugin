import { Plugin } from 'webpack'

export = ModifyWebpackPlugin

declare namespace ModifyWebpackPlugin {
  interface options {
    include: string | ((RegExp | string)[])
    exclude: string | ((RegExp | string)[])
    patterns: {
      reg: RegExp
      newStr: string
    }[]
  }
}

declare class ModifyWebpackPlugin extends Plugin {
  constructor(options: ModifyWebpackPlugin.options)
}
