import React from "react";

type DialogAlertProps = {
  open: boolean;
  isOpen: () => void;
  header: string;
  content: string;
  buttonText?: string;
};

const DialogAlert: React.FC<DialogAlertProps> = ({open,isOpen,header,content,buttonText="Schliesen"}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-red-500">{header}</h2>
        <p className="text-gray-700 mb-6">{content}</p>
        <div className="flex justify-end">
          <button onClick={isOpen}  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DialogSuccess: React.FC<DialogAlertProps> = ({open,isOpen,header,content,buttonText="Schliesen"}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-green-800">{header}</h2>
        <p className="text-gray-700 mb-6">{content}</p>
        <div className="flex justify-end">
          <button onClick={isOpen}  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogAlert;