"use client";

import { MessageProvider } from "@/context/messages";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { FC, ReactNode } from "react";



interface ProvidersProps {
	children: ReactNode;
}

const queryClient = new QueryClient();

const Providers: FC<ProvidersProps> = ({ children }) => {

	return (
        <QueryClientProvider client={queryClient}>
            <MessageProvider>
                {children}
            </MessageProvider>
        </QueryClientProvider>
    );
};

export default Providers;
