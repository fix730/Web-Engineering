import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React from 'react';
import Select from 'react-select';

export interface OptionType {
    value: string;
    label: string;
}

interface MultiSelectCityProps {
    className?: string; 
    roundedLeft?: boolean; 
    roundedRight?: boolean;
    value?: OptionType[];
    onChange?: (selectedOptions: OptionType[]) => void;
}

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    roundedLeft?: boolean;
    roundedRight?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = "Suchen...",
    value,
    onChange,
    className,
    roundedLeft = false,
    roundedRight = false 
}) => {
    // Dynamische Rundungs-Klassen basierend auf Props
    const getRoundedClasses = () => {
        if (roundedLeft && roundedRight) return 'rounded-full'; // Für den Fall, dass beides gewünscht ist
        if (roundedLeft) return 'sm:rounded-l-full';
        if (roundedRight) return 'sm:rounded-r-full';
        return 'rounded-none'; // Keine Rundung, wenn beides false ist
    };

    return (
        <div className={`relative flex items-center ${className || ''}`}>
            {/* Icon-Container */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            {/* Das tatsächliche Input-Feld */}
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`
                    block w-full py-[7px] pl-10 pr-3 border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    text-gray-900 placeholder:text-gray-400
                    ${getRoundedClasses()} // Dynamische Rundung
                `}
            />
        </div>
    );
};



export function MultiSelectCity({ className, roundedLeft = false, roundedRight = false, onChange, value }: MultiSelectCityProps) {
    const options = [
        { value: '1', label: 'München' },
        { value: '2', label: 'Stuttgart' },
        { value: '3', label: 'Mannheim' }
    ];

    const getRoundedClasses = () => {
        if (roundedLeft && roundedRight) return 'rounded-full';
        if (roundedLeft) return 'rounded-l-full';
        if (roundedRight) return 'rounded-r-full';
        return 'rounded-none'; // Keine Rundung, wenn beides false ist
    };
    const handleChange = (selectedOptions: any) => {
        const selectedValues = (selectedOptions || []) as OptionType[];
        if (onChange) {
            onChange(selectedValues);
        }
    };

    return (
        // Das äußere div muss die 'className' Prop erhalten
        <div className={`relative ${className || ''}`}>
            <Select
                isMulti
                name="Ort auswählen"
                options={options}
                className={`
                    basic-multi-select w-full
                    border border-gray-300 // Border hinzufügen, wenn nicht schon durch basic-multi-select definiert
                    focus:outline-none focus:ring-2 focus:ring-blue-500 // Fokus-Stile
                    sm:${getRoundedClasses()} // Dynamische Rundung
                `}
                onChange={handleChange}
                value={value}
                classNamePrefix="select"
                placeholder="Ort auswählen"
                // Stil-Anpassungen für React-Select, um die Rundungen zu überschreiben
                // Dies ist oft der kritischste Teil bei react-select und Tailwind
                styles={{
                    control: (baseStyles) => ({
                        ...baseStyles,
                        // Entfernt die Standard-Rundungen von react-select, um Tailwind-Klassen zu erlauben
                        borderRadius: '0px',
                    }),
                }}
            />
        </div>
    );
}