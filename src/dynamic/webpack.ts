import webpack from 'webpack';
import { Configuration } from 'webpack';
import { parse, resolve } from 'path';


const merge = require('webpack-merge');


const _DefaultConfig: Configuration = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  resolveLoader: {
    modules: [
      'node_modules'
    ]
  }
}


export async function webPack(inpath: string, outpath: string, config: Configuration = {}) {
  const { dir, base } = parse(outpath);
  const conf = merge(_DefaultConfig, config, {
    entry: resolve(inpath),
    output: {
      filename: base,
      path: resolve(dir),
    }
  });

  return new Promise((resolve, reject) => {
    webpack(conf, (err, res) => {
      if (err) reject(err);
      else {
        if (res.hasErrors()) {
          console.log(res.toString());
          reject(res);
        }
        else
          resolve(res);
      }
    });
  });
}
