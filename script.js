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
let mediaRecorder;
let audioChunks = [];

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

// Function to preview the text with selected voice, pitch, and rate
function previewText() {
    if (textInput.value.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(textInput.value);
    utterance.voice = voices[voiceSelect.value];
    utterance.pitch = pitch.value;
    utterance.rate = rate.value;

    window.speechSynthesis.speak(utterance);
}

// Function to speak and record the text to download later
async function speakText() {
    if (textInput.value.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(textInput.value);
    utterance.voice = voices[voiceSelect.value];
    utterance.pitch = pitch.value;
    utterance.rate = rate.value;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const dest = audioContext.createMediaStreamDestination();
    const mediaStream = dest.stream;
    const recorder = new MediaRecorder(mediaStream);

    mediaRecorder = recorder;
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioURL = URL.createObjectURL(audioBlob);
        downloadButton.href = audioURL;
        downloadButton.download = 'tts_output.wav';
    };

    recorder.start();

    const source = audioContext.createMediaStreamSource(dest.stream);
    const speechSource = audioContext.createMediaStreamSource(dest.stream);
    speechSource.connect(dest);

    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
        mediaRecorder.stop();
    };
}

// Event listeners for buttons
previewButton.addEventListener('click', previewText);
speakButton.addEventListener('click', speakText);

stopButton.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
});
