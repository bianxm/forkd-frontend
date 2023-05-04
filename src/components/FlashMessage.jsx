import { useContext } from "react";
import { FlashContext } from "../contexts/FlashProvider";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function FlashMessage(){
    const { flashMessage, isVisible, hideFlash } = useContext(FlashContext);

    return(
        <Transition
            className={`fixed z-50 left-0 top-0 w-60 text-center rounded-md my-6 mx-8 pt-3 p-3 ${flashMessage.color}`}
            show={isVisible}
            >
            <button className="w-4 h-4 absolute right-0 top-0 m-2" onClick={hideFlash}><XMarkIcon  /></button>
            {flashMessage.message}
        </Transition>
    );
}