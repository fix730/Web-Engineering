import React from "react";
import {CheckBoxes} from "./components";

export function SelectCity(){
    return(
        <>
            <select name="Stadt auswählen">
                <CheckBoxes value="Berlin" className="checkbox">
                    Berlin
                </CheckBoxes>
                <CheckBoxes value="Berlin" className="checkbox">
                    München
                </CheckBoxes>
            </select>
        </>

    );
}