angular.module('hminode', []);

const fs = require('fs');

const { ipcRenderer } = require('electron')

angular.module('hminode').controller('AppController', function ($scope, $interval) {
    var vm = this;
    vm.messages = [];
    vm.clearLog = clearLog;
    vm.sendClock = sendClock;
    vm.getAlarm = getAlarm;
    vm.getSystemTime = getSystemTime;
    vm.getTemperature = getTemperature;
    vm.sendAlarm = sendAlarm;
    vm.systemTime = new Date();
    vm.configedAlarm = {};
    vm.alarm = {};

    function sendAlarm(alarm) {
        vm.configedAlarm.time = alarm.time;
        vm.configedAlarm.temperature = alarm.temperature;
        ipcRenderer.send('sendAlarm',"31"+( alarm.temperature < 10 ? "0"+alarm.temperature : alarm.temperature )+ (alarm.time.getHours() < 10 ? "0" + alarm.time.getHours() : alarm.time.getHours())+""+(alarm.time.getMinutes() < 10 ? "0"+alarm.time.getMinutes() : alarm.time.getMinutes()));
        vm.alarm = {};
    }

    function getAlarm() {
        if (!vm.configedAlarm.temperature || !vm.configedAlarm.time) {
            return "Alarme ainda não definido";
        }

        return vm.configedAlarm.temperature + "º ás " + (vm.configedAlarm.time.getHours() < 10 ? "0"+vm.configedAlarm.time.getHours() : vm.configedAlarm.time.getHours()) + ":" + (vm.configedAlarm.time.getMinutes() < 10 ? "0" + vm.configedAlarm.time.getMinutes() : vm.configedAlarm.time.getMinutes());
    }

    function sendClock(time) {
        vm.systemTime = time;
        ipcRenderer.send('sendClock',"11"+(time.getHours() < 10 ? "0" + time.getHours() : time.getHours())+""+(time.getMinutes() < 10 ? "0"+time.getMinutes() : time.getMinutes())+"00");
    }

    function getTemperature() {
        ipcRenderer.send('getTemp');
    }

    function getSystemTime() {
        return vm.systemTime;
    }

    $interval(function () {
        vm.systemTime = new Date(vm.systemTime.getTime() + 1000);
    }, 1000);

    function clearLog() {
        vm.messages = [];
    }

    ipcRenderer.on('toggleLed', (event, message) => {
        var receiveEvent = {};
        receiveEvent.message = message;
        receiveEvent.date = new Date();
        vm.messages.push(receiveEvent);
        $scope.$digest();
    });
});
