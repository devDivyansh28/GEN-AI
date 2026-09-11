const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual


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
    const ai = await llm(transcript);
    console.log("AI : " , ai)
  };

  speechRecognition.start();

  
}

main();
