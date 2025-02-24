import React, { createContext, useState, useContext } from 'react';

// Create a context for the drawer state
const DrawerContext = createContext();

// Custom hook to use the DrawerContext
export const useDrawer = () => {
    return useContext(DrawerContext);
};

// DrawerProvider component that will provide the drawer state to the entire app
export const DrawerProvider = ({ children }) => {
    const [open, setOpen] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <DrawerContext.Provider value={{ open, handleDrawerOpen, handleDrawerClose }}>
            {children}
        </DrawerContext.Provider>
    );
};
