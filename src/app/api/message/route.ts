import { CHATBOT_PROMPT } from "@/lib/openai/chatbot-prompt";
import { getOpenAIStream } from "@/lib/openai/openai-stream";
import { ChatGPTMessage, OpenAIStreamPayload } from "@/lib/openai/types";
import { MessageArraySchema } from "@/lib/validators/message";



export async function POST(req: Request) {
    const { messages } = await req.json();
    
    const parsedMessages = MessageArraySchema.parse(messages);

    const outboundMessages: ChatGPTMessage[] = parsedMessages.map(message => ({
        content: message.text,
        role: message.isUserMessage ? "user" : "system"
    }))

    outboundMessages.unshift({
        content: CHATBOT_PROMPT,
        role: "system",
    })

    //?? this payload is for openAI, so you can read it in the documentation
    const payload: OpenAIStreamPayload = {
        model: "gpt-3.5-turbo",
        messages: outboundMessages,
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1,
    }

    const stream = await getOpenAIStream(payload);

    return new Response(stream);
}