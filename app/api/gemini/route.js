import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create conversation history
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Current message
    const currentMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 32,
        maxOutputTokens: 4096,
      }
    });

    const result = await chat.sendMessage(currentMessage.text);
    const response = await result.response;
    
    if (!response || !response.text) {
      throw new Error("Invalid response from Gemini API");
    }

    return Response.json({ 
      success: true,
      text: response.text() 
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return Response.json({ 
      success: false,
      error: error.message || "Connection with AI companion failed" 
    }, { status: 500 });
  }
}