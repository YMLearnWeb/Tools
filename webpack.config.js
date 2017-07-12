var path =require('path');
var webpack = require('webpack');
module.exports = {
  entry:'./js/index.js',
  output:{
    filename:'bundle.js',
    path:path.resolve(__dirname,'dist')
  },
  plugins: [
   new webpack.LoaderOptionsPlugin({
     debug: true
   }),
   new webpack.HotModuleReplacementPlugin()
 ]
}
