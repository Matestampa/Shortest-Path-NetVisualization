//En este caso es un proyecto frontend con typescript

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

export default{
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
     },
     {
      test: /\.ts?$/, //en este caso esta es para typescript
      use: 'ts-loader', //debemos tener previamente instalado el loader
      exclude: /node_modules/,
     }
    ],
  },
  
  resolve: { 
    extensions: ['.ts','.js'], //que archivos y en que orden deberia tener en cuenta
    extensionAlias: { //
      '.js': ['.js', '.ts'],
    }

  },
  
  output: { //como va a ser el output del bundle
    
    filename: 'bundle.js', //nombre del archivo
    path: path.resolve(__dirname, 'dist'), //directorio
  },

};