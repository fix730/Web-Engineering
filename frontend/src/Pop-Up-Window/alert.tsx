import { Button } from "@material-tailwind/react";
import React from "react";
import { ButtonConfirmMiddle } from "../pages/components/Button";
import { on } from "events";

type DialogAlertProps = {
  open: boolean;
  isOpen: () => void;
  header: string;
  content: string;
  buttonText?: string;
};

type DialogQuestionProps = {
  header: string;
  content: string;
  buttonConfirm?: string;
  buttonCancel?: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  colorHeader?: string;
  colorOnHover?: string;
  colorConfirm?: string;

}
const DialogAlert: React.FC<DialogAlertProps> = ({ open, isOpen, header, content, buttonText = "Schliesen" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">  {/* Äußere div für den Hintergrunf */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"> {/* Inner Div definiert das Pop-Up Window */}
        <h2 className="text-xl font-bold mb-4 text-red-500">{header}</h2>
        <p className="text-gray-700 mb-6">{content}</p>
        <div className="flex justify-end">
          <ButtonConfirmMiddle onClick={isOpen}>
            {buttonText}
          </ButtonConfirmMiddle>
        </div>
      </div>
    </div>
  );
};

export const DialogSuccess: React.FC<DialogAlertProps> = ({ open, isOpen, header, content, buttonText = "Schliesen" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-green-800">{header}</h2>
        <p className="text-gray-700 mb-6">{content}</p>
        <div className="flex justify-end">
          <ButtonConfirmMiddle onClick={isOpen}>
            {buttonText}
          </ButtonConfirmMiddle>
        </div>
      </div>
    </div>
  );
};

export const DialogQuestion: React.FC<DialogQuestionProps> = ({ header, content, buttonConfirm = "OK", buttonCancel = "Schließen", open, onConfirm, onCancel, colorHeader = "text-blue-800", colorOnHover="bg-blue-700", colorConfirm="bg-blue-600" }) => {

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className={`text-xl font-bold mb-4 ${colorHeader}`}>{header}</h2>
        <p className="text-gray-700 mb-6">{content}</p>
        <div className="flex justify-end">
          <ButtonConfirmMiddle onClick={onCancel} className="mr-2"> {/* Fügt einen rechten Margin von 0.5rem (mr-2) hinzu */}
            {buttonCancel}
          </ButtonConfirmMiddle>
          <ButtonConfirmMiddle color={colorConfirm} colorHover={colorOnHover} onClick={onConfirm}>
            {buttonConfirm}
          </ButtonConfirmMiddle>
        </div>
      </div>
    </div>
  );
};

export default DialogAlert;