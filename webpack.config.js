//En este caso es un proyecto frontend con typescript

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');


module.exports = {
  entry: './src/index.js', //archivo base para hacer el bundler
  
  plugins: [ //plugins para añadir funcionalidad extra
    
    new HtmlWebpackPlugin({ //este es para que permita integrar un archivo html,
                           //metiendole la importacion del script (resultado del bundler).
        title: 'our project', 
        template: './index.html' }),
    
    new MiniCssExtractPlugin(),
  ],
  
  module: { //aca ponemos las distintas "reglas". Cada una va a ser un "loader"
            //encargado de transpilar el codigo de ciertos archivos
    
    rules: [
     { test: /\.css$/i,
       use:[
        MiniCssExtractPlugin.loader, // instead of style-loader
        'css-loader'
       ],
     }
    ],
  },
  
  resolve: { 
    extensions: ['.js'] //que archivos y en que orden deberia tener en cuenta

  },
  
  output: { //como va a ser el output del bundle
    
    filename: 'bundle.js', //nombre del archivo
    path: path.resolve(__dirname, 'dist'), //directorio
  },

};