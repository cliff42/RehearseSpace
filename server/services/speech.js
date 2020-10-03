const speech = require('@google-cloud/speech');
const fs = require('fs');

// Creates a client
const client = new speech.SpeechClient();

const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US'
};

var getSpeechText = async function (audioFile) {
  const audio = {
    content: fs.readFileSync(audioFile).toString('base64')
  };

  const request = {
    config: config,
    audio: audio
  };

  try{
    var results = await client.recognize(request);
  } catch (err) {
    console.log("VOICE API ERROR: " + err);
  }
  
  console.log("RESULTS: " + results);
  return results
}