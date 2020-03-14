## modify-webpack-plugin
a webpack plugin modify any file with new string befor webpack building  
(for webpack v4)
---
### Install
---
```
# use npm
npm install --save-dev modify-webpack-plugin
# use yarn
yarn install modify-webpack-plugin -D
```
### Usage
---
```js
// webpack.config.js
const ModifyWebpackPlugin = require("modify-webpack-plugin")

module.exports = {
  plugins: [
    new ModifyWebpackPlugin({
      include: [/\.js$/]
      exclude: ['node_modules]
      patterns: [{
        reg: /console\.log\(.*\)/g
        newStr: ''
      }]
    }),
  ]
}
```
This case will remove all `console.log` in the required `*.js` modules
## Options
---
```js
new ModifyWebpackPlugin(options: object)
```
| Name | Type | Description |
| :--: | :--: | --- |
| include | ```String|RegExp|Array<String|RegExp>``` | Files to include. |
| exclude | ```String|RegExp|Array<String|RegExp>``` | Files to exclude. |
| patterns | ```Array<{reg: String|RegExp, newStr: string}>``` | Array to Modify file. use the `reg` to match and `newStr` to replace |
