import exp from "constants";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button() {
  return (
    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
      Click Me
    </button>
  );
}
export default Button;


export function SubmitButton({children, onClick}: ButtonProps  ) {
  return (
    <button
      type="submit"
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={onClick}
    >
      {children}
    </button>
  );
}