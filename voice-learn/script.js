const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // Replace with

const state = {
  currentlyPlaying : false,
  currentAudioObj : null,
}

async function llm(userText='') {
  const response = await fetch("https://ai-gateway.vercel.sh/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: userText,
    }),
  });

  const data = await response.json();

  const textOutput = data.output
    .flatMap((item) => item.content ?? [])
    .find((content) => content.type === "output_text");

  return textOutput?.text ?? "";
}

async function speak(text = ''){
  state.currentlyPlaying = true;
  const response = await fetch(
    "https://api.openai.com/v1/audio/speech",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "coral",
        input: text,
        instructions:
          "Speak in a friendly and engaging tone, as if you are having a conversation with the user.",
      }),
    },
  );

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  state.currentAudioObj ={
    audioUrl,
    audio,
  };
  await audio.play();
  audio.onended = () => {
    state.currentAudioObj = null;
    URL.revokeObjectURL(audioUrl);
  }
}

async function main() {
  
  // Speect to text
  const SpeechRecognition = window.SpeechRecognition;

  if (!SpeechRecognition) {
    console.log("not supported");
  }

  const speechRecognition = new SpeechRecognition();

  speechRecognition.continuous = true;
  speechRecognition.interimResults = false;
  speechRecognition.maxAlternatives = 1;

  speechRecognition.onstart = function () {
    console.log("🎤 SpeechRecognition has started");
  };

  speechRecognition.onresult = async function (event) {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log("User", transcript);
    if(state.currentAudioObj){
      state.currentAudioObj.audio.pause();
      URL.revokeObjectURL(state.currentAudioObj.audioUrl)
    }
    const ai = await llm(transcript);
    console.log("AI : " , ai)
    await speak(ai);
  };

  speechRecognition.start();

  
}

main();
