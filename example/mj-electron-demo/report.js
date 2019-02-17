const { ipcRenderer, remote } = require("electron");
const mj = require('mjreport');

// Get generated data from main process
let data = remote.getGlobal('printData');

// Pass report data to MjRenderer to draw report elements
let renderer = new mj.Renderer(data, 'mjRoot');
renderer.draw();

// Send signal to main process to save current page as pdf
function saveAsPdf() {
  ipcRenderer.send("saveAsPdf", data.metaData.paperType);
}

// Open print dialog to print current page
function printer() {
  window.print();
}
