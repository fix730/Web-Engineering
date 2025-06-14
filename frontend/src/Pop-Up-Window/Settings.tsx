import React from "react";
import { TabsWithIcon } from "../pages/components/Tabs";

type DialogAlertProps = {
    open: boolean;
    isOpen: () => void;
};

const Settings: React.FC<DialogAlertProps> = ({ open, isOpen }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-red-500">Einstellungen</h2>
        <TabsWithIcon />
        <div className="flex justify-end">
          <button onClick={isOpen}  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Schließen
          </button>
        </div>
      </div>
    </div>
    );
};

export default Settings;