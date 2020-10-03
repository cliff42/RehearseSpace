'use strict';

var controllers = angular.module('controllers', []);

controllers.controller('StartCtrl',
  function StartCtrl($scope, $http, $interval) {

    // see https://www.html5rocks.com/en/tutorials/getusermedia/intro/#toc-history
    // TODO: just in case
    // function hasGetUserMedia() {
    //   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    // }

    const canvas = document.querySelector('canvas');
    const video = document.querySelector('video');
    const videoConstraints = {
      video: true
    };

    // TODO: Add audio recording
    // const recorder = new MicRecorder({
    //   bitRate: 128,
    //   encoder: 'wav', // default is mp3, can be wav as well
    //   sampleRate: 16000, // default is 44100, it can also be set to 16000 and 8000.
    // });

    $scope.recording = false;
    var record;
    const interval = 5000;
    const maxIntervals = 60;

    $scope.overallEmotion = "Neutral"

    // lower bar chart data
    $scope.data = [];
    $scope.series = [];
    $scope.labels = [];
    $scope.options = {
      scales: {
        xAxes: [{ 
          stacked: true
        }],
        yAxes: [{ 
          stacked: true 
        }]
      }
    };
    

    navigator.mediaDevices.getUserMedia(videoConstraints)
      .then((stream) => {
        video.srcObject = stream;
        audio.srcObject = stream;
        // video.play(); unnecessary due to autoplay
      })
      .catch((err) => {
        console.error("Error: " + err);
      });


    var takePicture = function () {
      if (!$scope.recording) {
        return $interval.cancel(record);
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      var image = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");

      $http.post('/upload', { image: image })
        .then((res) => {
          console.log(res);
          updateEmotionData(res.data);
        });
    };

    var sendVoiceFile = function() {

      var audio = recorder.stop().getAudio()

      $http.post('/receive', { audioFile: audio})
      .then((res) => {
        console.log(res);
        // Do something with text data (analyze emotion with other gcp api?)
      })

      recorder.start().then(() => {
        // something else
      }).catch((e) => {
        console.error(e);
      });

    }

    $scope.startRecording = function () {
      $scope.recording = true;
      record = $interval(takePicture, interval, maxIntervals);
    };

    $scope.stopRecording = function () {
      $scope.recording = false;
    };

    $scope.startVoiceRecording = function () {
      $scope.voiceRecording = true;
      recorder.start().then(() => {
        // something else
      }).catch((e) => {
        console.error(e);
      });
      voiceRecord = $interval(sendVoiceFile, interval, maxIntervals);
    }

    var updateEmotionData = function (newData) {
      var newOverallEmotion = newData.overallEmotion;
      newOverallEmotion = newOverallEmotion.charAt(0).toUpperCase() + newOverallEmotion.slice(1);
      $scope.overallEmotion = newOverallEmotion;
      $scope.overallEmotionForImprove = newOverallEmotion;

      if (newData.emotions.joy > 3.5) {
        $scope.overallEmotionForImprove = "TOO_MUCH_JOY";
      }

      if ($scope.series.length === 0 || newOverallEmotion !== $scope.series[$scope.series.length - 1]) {
        $scope.series.push(newOverallEmotion);
        $scope.data.push([newData.confidence]);
      } else if (newOverallEmotion === $scope.series[$scope.series.length - 1]) {
        $scope.data[$scope.data.length - 1][0] += newData.confidence;
      }
    }
  }
);
