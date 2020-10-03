// const Compute = require('@google-cloud/compute');
const Vision = require('@google-cloud/vision');

// const compute = new Compute();
const client = new Vision.ImageAnnotatorClient;

// Enum for LikeliHood
const likelihoodValues = {
  VERY_UNLIKELY: "VERY_UNLIKELY",
  UNLIKELY: "UNLIKELY",
  POSSIBLE: "POSSIBLE",
  LIKELY: "LIKELY",
  VERY_LIKELY: "VERY_LIKELY"
}

// Enum for emotions
const emotionNames = {
  JOY: "joy",
  SORROW: "sorrow",
  ANGER: "anger",
  SURPRISE: "surprise"
}

var numIterations = 0;

var currentEmotions = {
  overallEmotion: "",
  confidence: 1,
  // Values for each emotion:
  // 1 - Very Unlikely, 2 - Unlikely, 3 - Possible, 4 - Likely, 5 - Very Likely
  emotions: {
    joy: 1.0,
    sorrow: 1.0,
    anger: 1.0,
    surprise: 1.0
  }
}

var formatBase64Image = function (base64Text) {
  if (base64Text != undefined) {
   return base64Text.substring(base64Text.indexOf(',') + 1, base64Text.length);
  }
  return "";
}

var updateAverage = function (average, newValue, newConfidence) {
  if ((numIterations > 0) && (newConfidence != 0)) {
    average = average * ((numIterations - 1) * currentEmotions.confidence);
    average = average + (newValue * newConfidence);
    average = average / (((numIterations - 1) * currentEmotions.confidence) + newConfidence);
  } else if ((numIterations > 0)) {
    average = average * (numIterations - 1);
    average = average + newValue;
    average = average / numIterations;
  }

  return average;
}

var getImageEmotions = async function (encodedImage) {
  const request = {
    "image": {
      "content": formatBase64Image(encodedImage)
    }
  };

  try {
    var results = await client.faceDetection(request);
    updatecurrentEmotions(results);
    ++numIterations;
  } catch (err) {
    console.log(err);
  }

  return currentEmotions;
}

var emotionToValue = function (emotionString) {
  var value;

  if (emotionString === likelihoodValues.VERY_UNLIKELY) {
    value = 1.0;
  } else if (emotionString === likelihoodValues.UNLIKELY) {
    value = 2.0;
  } else if (emotionString === likelihoodValues.POSSIBLE) {
    value = 3.0;
  } else if (emotionString === likelihoodValues.LIKELY) {
    value = 4.0;
  } else if (emotionString === likelihoodValues.VERY_LIKELY) {
    value = 5.0;
  }

  return value;
}

// Updates current emotions with values from api call
var updatecurrentEmotions = function (newResults) {
  var emotionArray = [
    {name: emotionNames.JOY, value: emotionToValue(newResults[0].faceAnnotations[0].joyLikelihood)},
    {name: emotionNames.SORROW, value: emotionToValue(newResults[0].faceAnnotations[0].sorrowLikelihood)},
    {name: emotionNames.ANGER, value: emotionToValue(newResults[0].faceAnnotations[0].angerLikelihood)},
    {name: emotionNames.SURPRISE, value: emotionToValue(newResults[0].faceAnnotations[0].surpriseLikelihood)}
  ];

  newConfidence = newResults[0].faceAnnotations[0].detectionConfidence;

  currentEmotions.emotions.joy = updateAverage(currentEmotions.emotions.joy, emotionArray[0].value, newConfidence);
  currentEmotions.emotions.sorrow = updateAverage(currentEmotions.emotions.sorrow, emotionArray[1].value, newConfidence);
  currentEmotions.emotions.anger = updateAverage(currentEmotions.emotions.anger, emotionArray[2].value, newConfidence);
  currentEmotions.emotions.surprise = updateAverage(currentEmotions.emotions.surprise, emotionArray[3].value, newConfidence);

  currentEmotions.confidence = updateAverage(currentEmotions.confidence, newConfidence, 0);

  currentEmotions.overallEmotion = Object.keys(currentEmotions.emotions).reduce(
    function(a, b) { return currentEmotions.emotions[a] > currentEmotions.emotions[b] ? a : b });
  
  return;
}

exports.getImageEmotions = getImageEmotions;
