import webpack from 'webpack';
import { Configuration } from 'webpack';
import { parse, resolve } from 'path';
import { merge } from 'webpack-merge'


const _DefaultProdModule: Configuration = /*#__PURE__*/{
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
}


const _DefaultDevModule: Configuration = /*#__PURE__*/{
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }],
        exclude: /node_modules/,
      },
    ],
  },
}


const _DefaultConfig: Configuration = /*#__PURE__*/{
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    fallback: {
      path: false,
      crypto: false,
    }
  },
  resolveLoader: {
    modules: [
      'node_modules'
    ]
  }
}


export async function webPack(inpath: string, outpath: string, config: Configuration = {}) {
  const { dir, base } = parse(outpath);
  let conf = merge(_DefaultConfig, config, {
    entry: resolve(inpath),
    output: {
      filename: base,
      path: resolve(dir),
    }
  }) as Configuration;

  if (conf.mode === 'development') conf = merge(conf, _DefaultDevModule) as Configuration;
  else conf = merge(conf, _DefaultProdModule) as Configuration;

  return new Promise((resolve, reject) => {
    webpack(conf, (err, res) => {
      if (err) reject(err);
      else {
        if (res!.hasErrors()) {
          console.log(res!.toString());
          reject(res);
        }
        else
          resolve(res);
      }
    });
  });
}
