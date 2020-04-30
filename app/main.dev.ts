/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Worker } from 'worker_threads';
// import { spawn, Worker } from 'threads';
// import { workerPath } from './binaries';
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences:
    // { nodeIntegration: true }
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true
          }
        : {
            nodeIntegration: true,
            preload: path.join(__dirname, 'dist/renderer.prod.js')
          }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('mainWindow is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // ------------------------------ Test ------------------------
  ipcMain.on('test', async () => {
    // console.log(workerPath);
    // console.log('===============');
    const worker = new Worker('./app/workers/counter.js', {
      workerData: { id: 1 }
    });
    worker.on('error', err => console.log(err));
    worker.on('exit', code => {
      if (code !== 0) {
        console.log(`Worker stopped with exit code ${code}`);
      }
    });
    worker.on('message', msg => {
      console.log(msg);
      const options = {
        buttons: ['Yes', 'No', 'Cancel'],
        message: `Count: ${msg.count}`
      };
      dialog.showMessageBox(options);
      worker.terminate();
    });
    // if (isMainThread) {
    //   const worker = new Worker('./workers/counter', { workerData: { id: 1 } });
    //   worker.on('error', err => console.log(err));
    //   worker.on('exit', code => {
    //     if (code !== 0) {
    //       console.log(`Worker stopped with exit code ${code}`);
    //     }
    //   });
    //   worker.on('message', msg => {
    //     console.log(msg);
    //     const options = {
    //       buttons: ['Yes', 'No', 'Cancel'],
    //       message: `Count: ${msg.count}`
    //     };
    //     dialog.showMessageBox(options);
    //   });
    //   await worker.terminate();
    // } else {
    //   console.log(`Running thread ${workerData.id}`);
    //   setTimeout(() => {
    //     console.log(`Thread ${workerData.id} is done`);
    //     parentPort?.postMessage({ count: 1 });
    //   }, 1000);
    // }
    // const counter = await spawn(new Worker('./workers/counter'));
    // counter().subscribe(count => {
    //   console.log('Count:', count);
    //   const options = {
    //     buttons: ['Yes', 'No', 'Cancel'],
    //     message: `Count: ${count}`
    //   };
    //   dialog.showMessageBox(options);
    // });
  });
  // ------------------------------------------------------------

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
