
type LabelOverInputProps = {
    children: React.ReactNode;
}

export function LabelOverInput({ children }: LabelOverInputProps) {
    return (
        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
            {children}
        </label>
    );
}