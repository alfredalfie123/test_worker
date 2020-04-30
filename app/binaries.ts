import path from 'path';
import { app } from 'electron';

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();
const { isPackaged } = app;

export const binariesPath =
  IS_PROD && isPackaged
    ? path.join(process.resourcesPath, '..', './Resources/bin')
    : path.join(root, './app/workers');

// eslint-disable-next-line no-console
console.log(binariesPath);
// eslint-disable-next-line no-console
console.log('*******************');

// eslint-disable-next-line import/prefer-default-export
export const workerPath = path.resolve(path.join(binariesPath, './counter.js'));
