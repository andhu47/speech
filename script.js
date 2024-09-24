// Check for browser support
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if ('SpeechRecognition' in window) {
  const recognition = new SpeechRecognition();
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const transcriptDiv = document.getElementById('transcript');
  const translationDiv = document.getElementById('translation');
  const languageSelect = document.getElementById('language-select');

  let fullTranscript = ''; // Store the full transcript

  recognition.continuous = true; // Keep recognition active
  recognition.interimResults = true; // Show interim results

  recognition.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      if (result.isFinal) {
        fullTranscript += transcript + ' ';
        translateText(fullTranscript);
      } else {
        interimTranscript += transcript;
      }
    }
    transcriptDiv.textContent = fullTranscript + interimTranscript;
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

  languageSelect.addEventListener('change', () => {
    // Re-translate the existing transcript when the target language changes
    translateText(fullTranscript);
  });

  function translateText(text) {
    const targetLanguage = languageSelect.value;

    if (text.trim() === '') {
      translationDiv.textContent = '';
      return;
    }

    fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLanguage,
        format: 'text'
      })
    })
    .then(response => response.json())
    .then(data => {
      translationDiv.textContent = data.translatedText;
    })
    .catch(error => {
      console.error('Translation error:', error);
      translationDiv.textContent = 'Translation error.';
    });
  }
} else {
  alert('Your browser does not support Speech Recognition. Please use Chrome or Edge.');
}
