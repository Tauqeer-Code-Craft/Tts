const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const pitch = document.getElementById('pitch');
const pitchValue = document.getElementById('pitchValue');
const rate = document.getElementById('rate');
const rateValue = document.getElementById('rateValue');
const speakButton = document.getElementById('speakButton');
const stopButton = document.getElementById('stopButton');

let voices = [];

// Load available voices
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';

    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

window.speechSynthesis.onvoiceschanged = loadVoices;

pitch.addEventListener('input', () => {
    pitchValue.textContent = pitch.value;
});

rate.addEventListener('input', () => {
    rateValue.textContent = rate.value;
});

function speakText() {
    if (textInput.value.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(textInput.value);
    utterance.voice = voices[voiceSelect.value];
    utterance.pitch = pitch.value;
    utterance.rate = rate.value;

    window.speechSynthesis.speak(utterance);
}

speakButton.addEventListener('click', speakText);

stopButton.addEventListener('click', () => {
    window.speechSynthesis.cancel();
});
