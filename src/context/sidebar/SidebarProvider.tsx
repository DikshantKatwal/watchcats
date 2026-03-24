import React, { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { SidebarContext } from './useSidebar';
export type SidebarContextType = {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

interface SidebarProviderProps {
    children: ReactNode;
}



export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <SidebarContext.Provider
            value={{
                sidebarOpen,
                setSidebarOpen
            }}>
            {children}
        </SidebarContext.Provider>
    );
};