let model;
let webcamElement;
let intervalID;

async function loadModel() {
  model = await tf.loadGraphModel('model/model.json'); // Load the model
  console.log('Model loaded successfully');
}

async function setupWebcam() {
  webcamElement = document.getElementById('webcam');
  const constraints = {
    video: { width: 640, height: 480 },
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    webcamElement.srcObject = stream;
    webcamElement.style.display = 'block'; // Show the video only after starting
  } catch (err) {
    console.error('Error accessing webcam:', err);
  }
}

async function predictGesture() {
  if (model && webcamElement) {
    const videoTensor = tf.browser.fromPixels(webcamElement).resizeBilinear([224, 224]).expandDims(0).toFloat();
    const predictions = await model.predict(videoTensor).data();

    const classes = ['Rock', 'Paper', 'Scissors'];
    const maxIndex = predictions.indexOf(Math.max(...predictions));

    document.getElementById('prediction').innerText = `Prediction: ${classes[maxIndex]}`;
  }
}

function startRecognition() {
  setupWebcam();

  // Start predicting gestures every 500ms
  intervalID = setInterval(() => {
    predictGesture();
  }, 500);

  // Disable the Start button to avoid multiple clicks
  document.getElementById('start-button').disabled = true;
  document.getElementById('start-button').innerText = "Recognition Started";
}

async function main() {
  await loadModel();

  // Attach event listener to Start button
  document.getElementById('start-button').addEventListener('click', startRecognition);
}

main();

