angular.module('hminode', []);

const fs = require('fs');

const { ipcRenderer } = require('electron')

angular.module('hminode').controller('AppController', function ($scope) {
    var vm = this;
    vm.messages = [];
    vm.clearLog = clearLog;

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
