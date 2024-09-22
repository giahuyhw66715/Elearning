import { MouseEvent as ReactMouseEvent } from "react";

const stopPropagation = (e: ReactMouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
};

export default stopPropagation;
