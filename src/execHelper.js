'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exec = function exec(command, opts) {
  return new Promise(function (resolve, reject) {
    var proc = _child_process2.default.exec(command, opts, function (err, stdout, stderr) {
      if (err) {
        reject(err);
      } else {
        console.log('FILTER STDOUT: ', stdout);
        resolve({ proc: proc, stdout: stdout, stderr: stderr });
      }
    });
  });
};

exports.exec = exec;