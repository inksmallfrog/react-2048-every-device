/*
* @Author: inksmallfrog
* @Date:   2017-04-24 17:10:42
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-24 17:18:38
*/

'use strict';
module.exports = {
  plugins: [
    require('autoprefixer')({ /* ...options */ }),
    require('postcss-cssnext')
  ]
}
