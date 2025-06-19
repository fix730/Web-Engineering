import React from "react";
import heartNotLiked from "../../../icons/heart.png";
import heartLiked from "../../../icons/heartLiked.png";
import { useState } from "react";
import { CommentProps } from "../Comment/Comment";
import { PostObject } from "./Post";
import { UserObject } from "../MockUser";
import { SubmitButton } from "../Button";
import InputGroupText from "react-bootstrap/esm/InputGroupText";

type DescriptionObject = Omit<PostObject, 'id' | 'imageUrl'>

type DescriptionProps = {
  description: DescriptionObject;
};





const Description = ({description}: DescriptionProps) => {

  const [liked, setLiked] = useState(false);

  function toggleLike() {
    setLiked(!liked);
  }
  return (
    <div>
      <div> {/* Oberer Teil mit Like und Beschreibung*/}

        <div> {/* Beschreibung */}
          
        </div>


      </div>
      <div>{/*Kommentar schreiben und ansehen*/}

      </div>
      

      <div className="w-full  min-w-[200px]">
        <input className="w-full bg-transparent placeholder:text-slate-400 border-none text-slate-700 text-sm  rounded-md px-3 py-2 transition duration-300 ease focus:outline-none  shadow-sm focus:shadow" placeholder="Kommentiere..."/>
      </div>

      <SubmitButton onClick={() => console.log("MUSS NOCH HINZUFÜGEN")}>
        Submit
      </SubmitButton>
    </div>
  );
};

export default Description;