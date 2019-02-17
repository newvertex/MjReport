const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const mj = require('mjreport');

let win = null;

function createWindow() {
  win = new BrowserWindow();
  win.loadURL(path.join('file://', __dirname, '/index.html'));

  win.on('closed', () => {
    win = null;
  })
}

app.on('ready', () => {
  createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('showPrintPreview', (arg) => {
  showPrintPreview();
}) 

// Dummy object array
var samplePersons = [
  {id: 1, name: 'Max', last: 'foo'},
  {id: 2, name: 'jax', last: 'bar'},
  {id: 3, name: 'Marty', last: 'white'},
];

let printWindow = null;

function showPrintPreview() {
  printWindow = new BrowserWindow({ parent: win, modal: true, show: false })

  // Create an instance from Generator class
  let generator = new mj.Generator("MjReport Electron Demo", mj.PaperType.A5_Portrait);
  generator.setStyle(`
  .header_section { position: relative; } 
  .header_love { position: absolute; right: 0; top: 0; }
  .footer_text { font-size: x-small; }
  `);

  // Set report page header,
  generator.setHeader([
    generator.addHeading('MjReport Example', 'h3'),
    generator.addText('<3', 'header_love'),
  ])

  // Set report page footer
  generator.setFooter([
    generator.addText('Developed by @newvertex(Mojtaba Rabiei)', 'footer_text'),
  ])
  
  // Set report main content
  generator.setContent([
    generator.addText('A simple paragraph tag to show some text on the page'),
    generator.addText('Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti natus, distinctio pariatur consequuntur id, libero totam sint rem beatae, odio voluptatem laboriosam harum. Id, quam. Dolore voluptatum mollitia deleniti velit.'),
    generator.addText('Just use pagebreak to create new page ;-)'),
    generator.addPageBreak(),
    generator.addHeading('Heading example', 'h2'),
    generator.addText('Time to show the data table:'),
    generator.addTable({
      items: samplePersons,
      header:['ID', 'Name', 'Last Name', 'Row'], 
      fields: ['id', 'name', 'last', '@row']
    }),
    generator.addText('On the above table we just use field name to get data from persons array'),
    generator.addText('check another sample that use calback function to return each table data row'),
    generator.addTable({
      items: samplePersons,
      header:['ID', 'Full Name', 'Row'], 
      fields: function(item, opt) {
        return [ item.id, item.name + '.' + item.last, opt.row ]
      }
    }),
    generator.addText('repeat table header on new page'),
  ]);

  // Set generated report data to global variable to use it on renderer process
  global.printData = generator.generate();


  printWindow.loadURL(path.join('file://', __dirname, '/report.html'));
  
  printWindow.on('closed', () => {
    printWindow = null;
  });

  printWindow.once('ready-to-show', () => {
    printWindow.show()
  })
}

// Generate pdf from report
ipcMain.on('saveAsPdf', (arg, paper) => {
  dialog.showSaveDialog({ defaultPath: 'MjReport.pdf'}, (fileName) => {
    if(fileName) {
      // Set page size & paper orientation with paperType getSize helper method
      printWindow.webContents.printToPDF({ marginsType: 1, ...mj.PaperType.getSize(paper) }, (err, data) => {
        if(err ) console.log('err on pdf', err)
        
        fs.writeFile(fileName, data, (err) => {
          if(err ) console.log('err on save pdf', err)
          shell.openExternal(`file://${fileName}`)
        })
      })
    }
  })
})
