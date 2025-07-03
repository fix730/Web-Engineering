type DialogHelpProps = {
  open: boolean;
  isOpen: () => void;
};

export const Help: React.FC<DialogHelpProps> = ({ open, isOpen }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"> 
        <button
          onClick={isOpen}
          className="text-gray-600 hover:text-gray-900 text-3xl font-semibold absolute top-4 right-4" 
          aria-label="Close post"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Hilfe</h2>
        
        <p className="text-gray-700 mb-6">Hier fehlt der Text noch der Text</p>
        <div className="flex justify-end">
        </div>
      </div>
    </div>
  );
};