const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

let EYE_SPIN = 0;

function onResults(results) {
  document.querySelector('.new-story').setAttribute('disabled', 'false');

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {

      switch (window.activeFilter) {
        case 'mesh': drawMesh(landmarks);
          break;
        case 'glasses': drawGlasses(landmarks);
          break;
        case 'sick': drawSickMask(landmarks);
          break;
      }
    }
  }
  canvasCtx.restore();
}

const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
  maxNumFaces: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => faceMesh.send({ image: videoElement }),
  width, height
});

camera.start();

function drawMesh(landmarks) {
  drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
    { color: '#C0C0C070', lineWidth: 1 });
  drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#FF3030' });
  drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' });
  drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30FF30' });
  drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#30FF30' });
  drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
  drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#E0E0E0' });
}

function drawGlasses(landmarks) {
  const minLeft = Math.min(...FACEMESH_LEFT_EYE.map(c => c[0]));
  const minTop = Math.min(...FACEMESH_LEFT_EYE.map(c => c[1]));

  const maxLeft = Math.max(...FACEMESH_RIGHT_EYE.map(c => c[0]));
  const maxTop = Math.max(...FACEMESH_RIGHT_EYE.map(c => c[1]));

  const rect = {
    x1: landmarks[minLeft].x * window.width - 50,
    y1: landmarks[minTop].y * window.height - 25,
    x2: landmarks[maxLeft].x * window.width + 50,
    y2: landmarks[maxTop].y * window.height + 50
  };

  const imageGlasses = document.querySelector('.glasses img');

  canvasCtx.drawImage(
    imageGlasses, rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
}

function drawSickMask(landmarks) {
  // mask
  const x1 = landmarks[234].x * window.width - 5;
  const y1 = landmarks[234].y * window.height - 10;

  const x2 = landmarks[454].x * window.width + 10;
  const y2 = landmarks[152].y * window.height + 20;

  const imageMask = document.querySelector('.sick img');

  canvasCtx.drawImage(
    imageMask, x1, y1, x2 - x1, y2 - y1);

  // spiral for left eye
  const leftEyeX1 = Math.min(...FACEMESH_LEFT_EYE.map(c => c[0]));
  const leftEyeY1 = Math.min(...FACEMESH_LEFT_EYE.map(c => c[1]));

  const leftEyeX2 = Math.max(...FACEMESH_LEFT_EYE.map(c => c[0]));
  const leftEyeY2 = Math.max(...FACEMESH_LEFT_EYE.map(c => c[1]));

  const leftEyeRect = {
    x1: landmarks[leftEyeX1].x * window.width - 20,
    y1: landmarks[leftEyeY1].y * window.height - 40,
    x2: landmarks[leftEyeX2].x * window.width + 60,
    y2: landmarks[leftEyeY2].y * window.height + 40
  };

  // spiral for right eye
  const rightEyeX1 = Math.min(...FACEMESH_RIGHT_EYE.map(c => c[0]));
  const rightEyeY1 = Math.min(...FACEMESH_RIGHT_EYE.map(c => c[1]));

  const rightEyeX2 = Math.max(...FACEMESH_RIGHT_EYE.map(c => c[0]));
  const rightEyeY2 = Math.max(...FACEMESH_RIGHT_EYE.map(c => c[1]));

  const rightEyeRect = {
    x1: landmarks[rightEyeX1].x * window.width - 55,
    y1: landmarks[rightEyeY1].y * window.height - 40,
    x2: landmarks[rightEyeX2].x * window.width + 25,
    y2: landmarks[rightEyeY2].y * window.height + 40
  };

  const tempImg = new Image();

  tempImg.onload = () => {
    canvasCtx.drawImage(tempImg, leftEyeRect.x1, leftEyeRect.y1, leftEyeRect.x2 - leftEyeRect.x1, leftEyeRect.y2 - leftEyeRect.y1);
    canvasCtx.drawImage(tempImg, rightEyeRect.x1, rightEyeRect.y1, rightEyeRect.x2 - rightEyeRect.x1, rightEyeRect.y2 - rightEyeRect.y1);
  }

  tempImg.src = window[`spiral${EYE_SPIN}Image`];

  EYE_SPIN += 25;

  if (EYE_SPIN > 360) EYE_SPIN = 0;
}
