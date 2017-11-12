const electron = require('electron');
const { app } = electron;
const { ipcMain } = require('electron')
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const fs = require('fs');

function logger(message) {
  fs.appendFile('log.txt', message + "\n", function (err) {
    if (err) throw err;
  });
}

app.on('ready', () => {
  const mainWindow = new BrowserWindow();
  mainWindow.loadURL('file://' + __dirname + '/public/index.html');
  // mainWindow.webContents.openDevTools();
  const path = require('path');
  var config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')));

  let port = setUpSerial(mainWindow, config);

  if (port) {
    ipcMain.on('sendClock', function (event, clock) {
      port.write(clock.endsWith("\n") ? clock : clock + "\n", writeCallback);
    });

    ipcMain.on('sendAlarm', function (event, alarm) {
      port.write(alarm.endsWith("\n") ? alarm : alarm + "\n", writeCallback);
    });

    ipcMain.on('getTemp', function (event) {
      port.write("20000000\n", writeCallback);
    });
  }

  function writeCallback(err) {
    if (err) {
      return logger('Error on write: ', err.message);
    }
    logger('message written');
  };

  function setUpSerial(mainWindow, config) {
    const SerialPort = require('serialport');
    const port = new SerialPort(config.port, { baudRate: config.baudRate });
    const Readline = SerialPort.parsers.Readline;
    const Delimiter = SerialPort.parsers.Delimiter;
    const parser = port.pipe(new Readline({ delimiter: '\n' }));

    parser.on('data', function (data) {
      mainWindow.webContents.send('toggleLed', data.toString('utf8'));
      logger(data.toString('utf8'));
    });

    port.on('error', function (err) {
      mainWindow.webContents.send('err', err.message);
      logger(err.message);
    });

    return port;
  }
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
