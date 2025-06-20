import React, { useState } from "react";
import { MultiSelectCity } from "./elements"; 
import { SearchInput } from "./elements";
import { OptionType } from "./elements"; 
import axios from "axios";
import axiosInstance from "../../../api/axiosInstance";
import { title } from "process";

export function SearchBar() {
    const [searchValue, setSearchValue] = useState('');
    const [selectedCities, setSelectedCities] = useState<OptionType[]>([]);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleCityChange = (cities: OptionType[]) => {
        setSelectedCities(cities);
        //console.log("Ausgewählte Städte:", cities); 
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert(`Suche gestartet mit: ${searchValue} und Städten: ${selectedCities.map(city => city.label).join(', ')}`);
        try{
            axiosInstance.post('/api/post/search', {
                title: searchValue,
                cities: selectedCities.map(city => city.value) // Senden der IDs der ausgewählten Städte
            });
        } catch (error) {
            console.error("Fehler beim Senden der Suchanfrage:", error);
            alert("Fehler beim Senden der Suchanfrage. Bitte versuche es später erneut.");
        }
    }

    return (
        <form
            className="
            
                flex flex-col items-center p-4 bg-gray-100 gap-y-3 // Mobile: untereinander, vertikaler Abstand
                sm:flex-row sm:justify-center sm:space-x-0 sm:items-stretch // Desktop: nebeneinander, KEIN Abstand, gleiche Höhe
                relative
            "
            onSubmit={handleSubmit}
        >
            {/* SearchInput: links abgerundet, rechts keine Rundung */}
            <SearchInput
                placeholder="Was suchst du?"
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full h-full sm:flex-1 sm:max-w-xs" // Breite für das Suchfeld und das für Vordergrund relative z-0 focus:z-10
                roundedLeft={true}
                roundedRight={false}
            />

            {/* MultiSelectCity: keine Rundung an beiden Seiten auf Desktop */}
            <MultiSelectCity
                className="w-full h-full sm:flex-1 sm:max-w-xs sm:rounded-none // Desktop: keine Rundung, aber Mobile hat 4px default
                " // <- Die sm:rounded-none-Klasse wird hier direkt angewendet
                roundedLeft={false} 
                roundedRight={false} 
                value={selectedCities}
                onChange={handleCityChange}
            />

            {/* Button: rechts abgerundet, links keine Rundung */}
            <button
                type="submit"
                className="
                    w-full h-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                    sm:w-auto sm:rounded-l-none sm:rounded-r-full // Desktop: links keine Rundung, rechts volle Rundung
                "
            >
                Suchen
            </button>
        </form>
    );
}