const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const pitch = document.getElementById('pitch');
const pitchValue = document.getElementById('pitchValue');
const rate = document.getElementById('rate');
const rateValue = document.getElementById('rateValue');
const previewButton = document.getElementById('previewButton');
const speakButton = document.getElementById('speakButton');
const stopButton = document.getElementById('stopButton');
const downloadButton = document.getElementById('downloadButton');

let voices = [];
let audioContext = null;
let mediaRecorder = null;
let audioChunks = [];

// Load available voices and populate the dropdown
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

function previewText() {
    if (textInput.value.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(textInput.value);
    utterance.voice = voices[voiceSelect.value];
    utterance.pitch = pitch.value;
    utterance.rate = rate.value;

    window.speechSynthesis.speak(utterance);
}

function startRecording() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    mediaRecorder = new MediaRecorder(destination.stream);
    
    const source = audioContext.createMediaStreamSource(destination.stream);
    source.connect(destination);
    
    audioChunks = [];
    mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioURL = URL.createObjectURL(audioBlob);
        downloadButton.href = audioURL;
        downloadButton.download = 'tts_output.wav';
    };
    
    mediaRecorder.start();
}

function speakText() {
    if (textInput.value.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(textInput.value);
    utterance.voice = voices[voiceSelect.value];
    utterance.pitch = pitch.value;
    utterance.rate = rate.value;

    startRecording();
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
        mediaRecorder.stop();
    };
}

previewButton.addEventListener('click', previewText);
speakButton.addEventListener('click', speakText);

stopButton.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
});
