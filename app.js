const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Move to .env file
const hlsOutputDirectory = './hlsoutput';
const playlistFilePath = './videos/broadcast-ready/playlist.txt';
const validTokens = ['elphin', 'elphintvapp', 'bradley','ipad'];

// Add a simple authentication middleware to the app. This gets a token from the query string and checks if it matches the expected token.
function checkToken(req, res, next){
  const token = req.query.token;
  console.log(token);
  if (validTokens.includes(token)) {
    console.log('Token is valid');
    next();
  } else {
    console.log('Token is invalid');
    res.status(401).send('Unauthorized');
  }
}

function logToken(req, res, next) {
  if (req.query.token) {
    console.log(`${Date()} Token:`, req.query.token);
  }
  next();
}


app.get('/', checkToken, function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/stream',logToken, express.static(hlsOutputDirectory));

app.listen(PORT, () => {
  // Remove everything in the hlsOutputDirectory directory before starting a new stream: 
  cleanHLSOutput();
  console.log(`Server is running on port ${PORT}`);

  const ffmpegProcess = spawn('ffmpeg', [
    '-re',
    '-f', 'concat',
    '-safe', '0',
    '-i', playlistFilePath,
    '-start_number', '0',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-c:a', 'aac',
    '-ar', '48000',
    //'-af', 'loudnorm',
    '-vf', "movie=logo.png [watermark]; [in][watermark] overlay=W-w-10:H-h-10 [out]",
    '-f', 'hls',
    '-hls_time', '6',
    '-hls_list_size', '10',
    //'-hls_list_size', '0',
    //'-hls_flags', 'delete_segments+program_date_time',
    `${hlsOutputDirectory}/index.m3u8`
  ]);

  ffmpegProcess.stdout.on('data', (data) => {
   // console.log(`stdout: ${data}`);
  });

  ffmpegProcess.stderr.on('data', (data) => {
   // console.error(`stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });
});


function cleanHLSOutput() {
  const directory = hlsOutputDirectory;
  console.log("clearing hls directory...");
  const files = fs.readdirSync(directory);
  for (const file of files) {
    fs.unlinkSync(path.join(directory, file));
  }
}
