import { ReactNode, createContext, useState } from "react";
import { nanoid } from "nanoid";
import type { Message } from "@/lib/validators/message";



export const MessageContext = createContext<{
	messages: Message[];
	isMessageUpdating: boolean;
	addMessage: (message: Message) => void;
	removeMessage: (id: string) => void;
	updateMessage: (id: string, updateFn: (preText: string) => string) => void;
    setIsMessageUpdating: (isUpdating: boolean) => void;
}>({
    messages: [],
    isMessageUpdating: false,
    addMessage: () => {},
    removeMessage: () => {},
    updateMessage: () => {},
    setIsMessageUpdating: () => {}
});


export const MessageProvider = ({ children }: { children: ReactNode }) => {

    const [isMessageUpdating, setIsMessageUpdating] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: nanoid(),
            text: "Hello, how can I help you?",
            isUserMessage: false,
        }
    ]);

    const addMessage = (message:Message) => {
        setMessages(preMessages => [...preMessages, message])
    }

    const removeMessage = (id: string) => {
        setMessages(preMessages => preMessages.filter(message => message.id !== id))
    }

    const updateMessage = (id: string, updateFn: (preText: string) => string) => {
        setMessages(preMessages => preMessages.map(message => {
            if (message.id === id) {
                return {...message, text: updateFn(message.text)}
            } else {
                return message
            }
        }))
    }

    return (
        <MessageContext.Provider value={{
            messages,
            isMessageUpdating,
            addMessage,
            removeMessage,
            updateMessage,
            setIsMessageUpdating,
        }}>
            {children}
        </MessageContext.Provider>
    )
}