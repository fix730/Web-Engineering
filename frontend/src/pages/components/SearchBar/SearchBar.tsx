import React from "react";
import {SelectCity} from "./elements";

export function SearchBar() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        
        console.log("Search submitted");
    }
    return (
        <form className="flex items-center justify-center p-4 bg-gray-100 space-x-4" onSubmit={handleSubmit}>
            <input type="text" placeholder="Search..." className="w-full py-2 max-w-48 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <SelectCity />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Search
            </button>
        </form>
    );
}