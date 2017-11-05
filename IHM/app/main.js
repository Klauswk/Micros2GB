const electron = require('electron');
const { app } = electron;
const { ipcMain } = require('electron')
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

app.on('ready', () => {

  const mainWindow = new BrowserWindow();
  mainWindow.loadURL('file://' + __dirname + '/public/index.html');
  mainWindow.webContents.openDevTools();

  const SerialPort = require('serialport');
  const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
  const Readline = SerialPort.parsers.Readline;
  const Delimiter = SerialPort.parsers.Delimiter;
  const parser = port.pipe(new Readline({ delimiter: '\987' }));

  // Read data that is available but keep the stream from entering "flowing mode"
  parser.on('data', function (data) {
    mainWindow.webContents.send('toggleLed', data.toString('utf8'));
    console.log('Data:', data.toString('utf8'));
  });

  // Open errors will be emitted as an error event
  port.on('error', function (err) {
    mainWindow.webContents.send('err', err.message);
    console.log('Error: ', err.message);
  });
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
