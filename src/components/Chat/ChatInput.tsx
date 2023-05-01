"use client";

import { cn } from "@/lib/utils";
import { FC, HTMLAttributes, KeyboardEvent, useState, useContext, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import TextAreaAutosize from "react-textarea-autosize";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validators/message";
import { MessageContext } from "@/context/messages";
import { CornerDownLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...restProps }) => {

	const [inputState, setInputState] = useState("");

	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const {
		messages,
		addMessage,
		removeMessage,
		updateMessage,
		setIsMessageUpdating,
	} = useContext(MessageContext);

	const { mutate: sendMessage, isLoading } = useMutation({
		mutationFn: async (message: Message) => {

			const response = await fetch("/api/message", {
				method: "POST",
				body: JSON.stringify({
					messages: [message],
				}),
			});

			return response.body;
		},
		onMutate(message) {
			addMessage(message);
		},
		onSuccess: async (stream) => {
			if (!stream) throw new Error("No stream found");

			const id = nanoid();

			const responseMessage: Message = {
				id,
				isUserMessage: false,
				text: ""
			}

			addMessage(responseMessage);

			setIsMessageUpdating(true);

			const reader = stream.getReader();
			const decoder = new TextDecoder();

			let done = false;

			while (!done) {
				const { value, done: doneReading } = await reader.read();

				done = doneReading;

				const chunkValue = decoder.decode(value);

				updateMessage(id, (preText) => preText + chunkValue)
			}

			setIsMessageUpdating(false);
			setInputState("");
			
			setTimeout(() => {
				textAreaRef.current?.focus();
			}, 10);
		},
		onError(_, message) {
			toast.error("Something went wrong. Please try again.");
			removeMessage(message.id);

			setTimeout(() => {
				textAreaRef.current?.focus();
			}, 10);
		}
	});

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();

			if (!inputState) {
				return
			}

			const message: Message = {
				id: nanoid(),
				isUserMessage: true,
				text: inputState,
			};

			sendMessage(message);
		}
	};

	return (
		<div {...restProps} className={cn("border-t", className)}>
			<div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
				<TextAreaAutosize
					ref={textAreaRef}
					rows={2}
					maxRows={4}
					autoFocus
					value={inputState}
					onChange={(e) => setInputState(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Write a message ..."
					disabled={isLoading}
					className="peer disabled:opacity-50 pe-14 resize-none block rounded py-1.5 text-sm sm:leading-6 w-full bg-secondary text-secondary-foreground border-none outline-none"
				/>
				<div className="absolute inset-y-0 end-0 flex py-1.5 pe-1.5">
					<kbd className="flex items-center rounded border bg-white px-1 font-sans text-xs">
						{isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CornerDownLeft className="w-3 h-3" />}
					</kbd>
				</div>
				<div aria-hidden="true" className="absolute inset-x-0 bottom-0 border-t peer-focus:border-t-2 peer-focus:border-indigo-600" />
			</div>
		</div>
	);
};

export default ChatInput;
