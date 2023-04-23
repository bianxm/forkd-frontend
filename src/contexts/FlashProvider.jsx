import { createContext, useContext, useState } from "react";

export const FlashContext = createContext();
let flashTimer;

export default function FlashProvider({ children }){
    // const [flashMessage, setFlashMessage] = useState(<div className="h-full w-full bg-green-200 rounded-md p-2">Flash Message</div>);
    const [flashMessage, setFlashMessage] = useState({message:"help!",color:"bg-red-200"});
    const [isVisible, setIsVisible] = useState(false);

    const flash = (message, color, duration=10) => {
        if(flashTimer){
            clearTimeout(flashTimer);
            flashTimer = undefined;
        }
        setFlashMessage({message:message, color:color});
        setIsVisible(true);
        if(duration){
            flashTimer = setTimeout(hideFlash, duration*1000);
        }
    };

    const hideFlash = () => {
        setIsVisible(false);
    };

    return (
        <FlashContext.Provider value={{flash, hideFlash, flashMessage, isVisible}}>
            {children}
        </FlashContext.Provider>
    );
}

export function useFlash(){
    return useContext(FlashContext).flash;
}