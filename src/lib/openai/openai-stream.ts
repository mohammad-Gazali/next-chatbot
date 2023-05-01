import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";
import { OpenAIStreamPayload } from "./types";



export const getOpenAIStream = async (payload: OpenAIStreamPayload) => {
    
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload)
    })

    const stream = new ReadableStream({
        start: async (controller) => {
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === "event") {

                    const data = event.data;

                    if (data === "[DONE]") {
                        controller.close()
                        return
                    }

                    try {
                        
                        const json = JSON.parse(data);
                        
                        const text = json.choices[0].delta?.content || "";

                        if (counter < 2 && (text.match(/\n/) || []).length !== 0) {
                            return
                        }

                        const queue = encoder.encode(text);

                        controller.enqueue(queue);

                        counter++;

                    } catch (error) {
                        controller.error(error);
                    }

                }
            }

            const parser = createParser(onParse);

            for await (let chunk of res.body as any) {   
                parser.feed(decoder.decode(chunk))
            }

        }
    })

    return stream;
}