import ChatHeader from "./ChatHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";



const Chat = () => {
  return (
    <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
            <div className="fixed right-8 w-80 bottom-8 border rounded-md overflow-hidden shadow">
                <div className="w-full h-full flex flex-col">
                    <AccordionTrigger className="px-6">
                        <ChatHeader />
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col h-80">
                            <ChatMessages className="px-2 py-3 flex-1" />
                            <ChatInput className="px-4" />
                        </div>
                    </AccordionContent>
                </div>
            </div>
        </AccordionItem>
    </Accordion>
  )
}


export default Chat