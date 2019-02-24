var textLine;
var realConsoleLog;
var isAttarched = false;
//testline.innerText = 'adaf';

module.exports = {
    attachOutput: function (element) {
        textLine = element;
        textLine.innerText = 'verified.';
        isAttarched = true;
    },
    attachInput: function (console_log) {
        realConsoleLog = console_log;
        console_log = loghere;
    },
    log: function loghere(message) {
        if (isAttarched) {//testline && testline !== 'null' && testline !== 'undefined'){
            textLine.innerText += message;
        }
    }
}