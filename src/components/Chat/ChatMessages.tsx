"use client";

import { MessageContext } from "@/context/messages";
import { cn } from "@/lib/utils"
import { FC, HTMLAttributes, useContext } from "react"
import MarkdownLite from "./MarkdownLite";



interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {}

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...restProps }) => {

    const { messages } = useContext(MessageContext);

    const inversedMessages = [...messages].reverse();

    return (
        <div {...restProps} className={cn("flex flex-col-reverse gap-3 overflow-y-auto custom-scrollbar", className)}>
            <div className="flex-1" />
            {inversedMessages.map(message => (
                <div className="chat-message" key={message.id}>
                    <div className={cn("flex items-end", {
                        "justify-end": message.isUserMessage
                    })}>
                        <div className={cn("flex flex-col gap-2 text-sm max-w-xs mx-2 rounded-lg overflow-x-hidden", {
                            "order-1 items-end": message.isUserMessage,
                            "order-2 items-start": !message.isUserMessage,
                        })}>
                            <p className={cn("px-4 py-2 rounded-lg", {
                                "bg-blue-600 text-white": message.isUserMessage,
                                "bg-gray-200 text-gray-900": !message.isUserMessage,
                            })}>
                                <MarkdownLite text={message.text} />
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ChatMessages