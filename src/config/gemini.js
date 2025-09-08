import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash";

const API_KEY = "YOUR API KEY HERE";

async function runChat(userPrompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  // Funny + sarcastic personality
  const systemPrompt = `
You are an AI assistant named "Nova".
Your personality:
- Sarcastic, witty, and funny.
- Always crack light jokes or throw in playful roasts.
- If the user asks something obvious, respond with humor.
- Don't be mean, but be snarky like a stand-up comedian.
- Keep answers short, clever, and entertaining.
- Who created you: Infamous legend Tirth.
`;

  const finalPrompt = `${systemPrompt}\nUser: ${userPrompt}`;

  const result = await chat.sendMessage(finalPrompt);
  const response = result.response;
  return response.text();
}

export default runChat;
