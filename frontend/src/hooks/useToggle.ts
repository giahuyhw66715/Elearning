import { useState } from "react";

export default function useToggle(initialValue: boolean = false) {
    const [isOpen, setIsOpen] = useState(initialValue);
    const toggleOpen = () => setIsOpen(!isOpen);
    return { isOpen, toggleOpen };
}
