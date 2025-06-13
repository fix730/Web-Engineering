import React from "react";
import { ReactNode } from "react";

type checkBoxesProps = {
    value: string;
    children: ReactNode;
    className?: string;
}

export function CheckBoxes({ value, children, className }: checkBoxesProps) {
    return (
        <>
            <div className="flex flex-row" >
                <input type="checkbox" value={value} className={className} />
                <span>{children}</span>
            </div>
        </>
    );
}