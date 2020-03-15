# modify-webpack-plugin
a webpack plugin modify any file with new string befor webpack building  
(for webpack v4)
## Install
```
# use npm
npm install --save-dev modify-webpack-plugin
# use yarn
yarn add modify-webpack-plugin -D
```
## Usage
```js
// webpack.config.js
const ModifyWebpackPlugin = require("modify-webpack-plugin")

module.exports = {
  plugins: [
    new ModifyWebpackPlugin({
      include: [/\.js$/]
      exclude: ['node_modules']
      patterns: [{
        reg: /console\.log\(.*\)/g
        newStr: ''
      }]
    }),
  ]
}
```
This case will remove all `console.log` in the required `*.js` modules  
> :warning: if you don't give a argument for `include`, this plugin wil modify every required file even `css`, `jpg` or anyother type. So set the include !
## Options
```js
new ModifyWebpackPlugin(options: object)
```
| Name | Type | Description |
| :--: | :--: | --- |
| include | `String\|RegExp\|Array<String\|RegExp>` | If multiple conditions are provided, matching any condition will include & scan the filepath to modify target files. |
| exclude | `String\|RegExp\|Array<String\|RegExp>` | If multiple conditions are provided, matching any condition will exclude the filepath, which prevents any alterations. By default, nothing is excluded! |
| patterns | ```Array<{reg: String\|RegExp, newStr: string}>``` | An array of RegExp pattern definitions. Each definition is an object with reg <RegExp> and newStr <String> keys.
