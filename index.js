// import {execFile} from 'node:child_process';
// import pngquant from 'pngquant-bin';

// function compress() {
//   document.getElementById('fileid').click();
//   console.log('clicked');
// }

let darkMode = false;

async function compress() {
  await window.electronAPI.sendFile();
}

function switchTheme() {
  darkMode = !darkMode;
  if(darkMode) {
    document.body.style.backgroundColor = "dimgray"
    document.querySelector('div').style.backgroundColor = "black"
    document.querySelector('#fileBtn').style.backgroundColor = "dimgray"
    document.body.style.color = "white"
  }
  else {
    document.body.style.backgroundColor = "lightblue"
    document.querySelector('#fileBtn').style.backgroundColor = "yellow"
    document.querySelector('div').style.backgroundColor = "white"
    document.body.style.color = "black"
  }
}

// execFile(pngquant, ['-o', 'output.png', 'input.png'], error => {
// 	console.log('Image minified!');
// });

