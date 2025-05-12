import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const obj = {
    mode: 'production',
    entry: './index.js',
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: 'final.js',
    },
    target: 'node',
  };

  export default obj;