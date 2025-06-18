type PassordProps = {
    password: string;
    handleChncePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete?: string;
};
type EmailProps = {
    email: string;
    handleChnceEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
type TextProps = {
    text: string;
    handleChnceText: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
type DateProps = {
    date: string;
    handleChnceDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const classNameStandart = "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-indigo-600 focus:ring-1 sm:text-sm/6";

export function Paasswort({ password, handleChncePassword, autoComplete }: PassordProps) {
    return (
        <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={handleChncePassword}
            autoComplete={autoComplete || ""}
            className={classNameStandart}
        />
    )
}

export function Email({ email, handleChnceEmail }: EmailProps) {
    return (

        <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={handleChnceEmail}
            className={classNameStandart}
        />
    )
}

export function Text({ text, handleChnceText }: TextProps) {
    return (
        <input
            id="text"
            name="text"
            type="text"
            required
            value={text}
            onChange={handleChnceText}
            className={classNameStandart}
        />
    )
}
export function DateInput({ date, handleChnceDate }: DateProps) { 
    return (
        <input
            type="date"
            value={date}
            onChange={handleChnceDate}
            className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
        />
    );
}

export function PictureInput({ onChange }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
    );
}
