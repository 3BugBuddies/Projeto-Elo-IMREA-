

// Elementos do DOM
const cameraPreview = document.getElementById('camera-preview');
const cameraOverlay = document.getElementById('camera-overlay');
const cameraStatusMessage = document.getElementById('camera-status-message');
const enableCameraButton = document.getElementById('enable-camera');
const testCameraButton = document.getElementById('test-camera');
const testMicrophoneButton = document.getElementById('test-microphone');
const cameraStatus = document.getElementById('camera-status');
const micStatus = document.getElementById('mic-status');
const micIndicator = document.getElementById('mic-indicator');
const micMeterFill = document.getElementById('mic-meter-fill');
const feedbackMessage = document.getElementById('feedback-message');

// Estado
let stream = null;
let isCameraActive = false;
let isMicrophoneActive = false;
let audioContext = null;
let audioSource = null;
let audioAnalyser = null;

// Inicialização
initialize();

function initialize() {
  cameraOverlay.classList.remove('hidden');
  testCameraButton.addEventListener('click', toggleCamera);
  testMicrophoneButton.addEventListener('click', toggleMicrophone);
  enableCameraButton.addEventListener('click', startCamera);
}

async function toggleCamera() {
  if (isCameraActive) {
    stopCamera();
    testCameraButton.textContent = 'Ativar Câmera';
    testCameraButton.classList.remove('active');
    feedbackMessage.classList.remove('active');
    feedbackMessage.textContent = 'Câmera desativada com sucesso';
  } else {
    await startCamera();
    testCameraButton.textContent = 'Desativar Câmera';
    testCameraButton.classList.add('active');
    feedbackMessage.classList.add('active');
    feedbackMessage.textContent = 'Câmera ativada com sucesso';

  }
  isCameraActive = !isCameraActive;
}

async function toggleMicrophone() {
  if (isMicrophoneActive) {
    stopMicrophone();
    testMicrophoneButton.textContent = 'Ativar Microfone';
    testMicrophoneButton.classList.remove('active');
    feedbackMessage.textContent = 'Microfone desativado com sucesso';
  } else {
    await startMicrophone();
    testMicrophoneButton.textContent = 'Desativar Microfone';
    testMicrophoneButton.classList.add('active');
    feedbackMessage.textContent = 'Microfone ativado com sucesso';
  }
  isMicrophoneActive = !isMicrophoneActive;
}

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      },
      audio: false
    });
    
    cameraPreview.srcObject = stream;
    cameraOverlay.classList.add('hidden');
    cameraStatus.classList.add('active');
    feedbackMessage.textContent = 'Câmera iniciada com sucesso';
    
  } catch (error) {
    console.error('Erro ao acessar a câmera:', error);
    
    if (error.name === 'NotAllowedError') {
      feedbackMessage.textContent = 'Permissão negada. Por favor, permita o acesso à câmera.';
    } else if (error.name === 'NotFoundError') {
      feedbackMessage.textContent = 'Nenhuma câmera encontrada no dispositivo.';
    } else {
      feedbackMessage.textContent = `Erro ao acessar sua câmera: ${error.message}`;
    }
    
    cameraOverlay.classList.remove('hidden');
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => {
      if (track.kind === 'video') {
        track.stop();
      }
    });
    cameraPreview.srcObject = null;
    cameraStatus.classList.remove('active');
  }
}

async function startMicrophone() {
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioSource = audioContext.createMediaStreamSource(audioStream);
    audioAnalyser = audioContext.createAnalyser();
    
    audioSource.connect(audioAnalyser);
    audioAnalyser.fftSize = 256;
    
    micStatus.classList.add('active');
    micIndicator.classList.remove('hidden');
    visualizeMicrophone();
    
  } catch (error) {
    console.error('Erro ao acessar o microfone:', error);
    feedbackMessage.textContent = 'Erro ao acessar o microfone. Verifique as permissões.';
  }
}

function stopMicrophone() {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    audioSource = null;
    audioAnalyser = null;
  }
  
  micStatus.classList.remove('active');
  micIndicator.classList.add('hidden');
  micMeterFill.style.width = '0%';
}

function visualizeMicrophone() {
  if (!audioAnalyser || !isMicrophoneActive) return;
  
  const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
  audioAnalyser.getByteFrequencyData(dataArray);
  
  const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
  const volume = Math.min(100, Math.round((average / 255) * 100));
  
  micMeterFill.style.width = `${volume}%`;
  
  if (volume > 10) {
    micMeterFill.parentElement.classList.add('mic-active');
  } else {
    micMeterFill.parentElement.classList.remove('mic-active');
  }
  
  requestAnimationFrame(visualizeMicrophone);
}