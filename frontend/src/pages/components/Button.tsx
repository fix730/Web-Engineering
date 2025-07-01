import exp from "constants";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  colorHover?: string;
  className?: string;
  disabled?: boolean;
};

export function Button() {
  return (
    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
      Click Me
    </button>
  );
}
export default Button;


export function SubmitButton({ children, onClick, color, colorHover, className }: ButtonProps) {
  const bgColorClass = color ? `bg-${color}-600` : 'bg-indigo-600';
  const hoverColorClass = colorHover ? `hover:bg-${colorHover}-500` : 'hover:bg-indigo-500';
  const focusOutlineColorClass = color ? `focus-visible:outline-${color}-600` : 'focus-visible:outline-indigo-600';

  return (
    <button
      type="submit"
      className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 ${bgColorClass} ${hoverColorClass} ${focusOutlineColorClass} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ButtonConfirmMiddle({ children, onClick, color, colorHover, className }: ButtonProps) {
  // Bestimme die Hintergrundfarbe (Standard: Blau-600)
  const baseBgColor = color ? `bg-${color}-600` : 'bg-blue-600';

  // Bestimme die Hover-Hintergrundfarbe (Standard: Blau-700).
  // Hier ist die wichtige Änderung: `colorHover` sollte für den Hover-Effekt verwendet werden,
  // und falls nicht vorhanden, der `color` Wert, falls vorhanden, oder der Standard `blue`.
  const hoverBgColor = colorHover
    ? `hover:bg-${colorHover}-700` // Nutze colorHover, wenn es existiert
    : color // Wenn colorHover nicht existiert, aber color existiert, nutze color
      ? `hover:bg-${color}-700`
      : 'hover:bg-blue-700'; // Fallback auf Standard-Blau-700

  return (
    <button
      onClick={onClick}
      // Kombiniere alle Klassen: Basis-Styling, Basis-Hintergrund, Hover-Hintergrund und zusätzliche Klassen
      className={`px-4 py-2 text-white rounded ${baseBgColor} ${hoverBgColor} ${className || ''}`}
    >
      {children}
    </button>
  );
}