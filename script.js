// Check for browser support
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if ('SpeechRecognition' in window) {
  const recognition = new SpeechRecognition();
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const transcriptDiv = document.getElementById('transcript');

  recognition.continuous = true; // Keep recognition active
  recognition.interimResults = true; // Show interim results

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      transcript += result[0].transcript;
    }
    transcriptDiv.textContent = transcript;
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
  };

  startBtn.addEventListener('click', () => {
    recognition.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
  });

  stopBtn.addEventListener('click', () => {
    recognition.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });
} else {
  alert('Your browser does not support Speech Recognition. Please use Chrome or Edge.');
}
