import React, { createContext, useContext, useState } from 'react';
import { calculateInfluencerPrice } from '../utils/pricing';

const SelectionContext = createContext();

export const useSelection = () => useContext(SelectionContext);

export const SelectionProvider = ({ children }) => {
    const [selectedInfluencers, setSelectedInfluencers] = useState([]); // Array of IDs
    const [selectedVenues, setSelectedVenues] = useState([]); // Array of IDs
    const [favorites, setFavorites] = useState([]); // Array of objects { type: 'influencer'|'venue', id: ... }

    // Toggle Selection Logic
    const toggleInfluencerSelection = (id) => {
        setSelectedInfluencers(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleVenueSelection = (id) => {
        setSelectedVenues(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Toggle Favorite Logic
    const toggleFavorite = (type, id) => {
        setFavorites(prev => {
            const exists = prev.find(item => item.type === type && item.id === id);
            if (exists) {
                return prev.filter(item => !(item.type === type && item.id === id));
            }
            return [...prev, { type, id }];
        });
    };

    const isFavorite = (type, id) => {
        return favorites.some(item => item.type === type && item.id === id);
    };

    // Cost Calculators (Mock logic requires access to data sources, 
    // but for now we will pass price map or calculate in components.
    // Ideally context should know about data but let's keep it simple for prototype)

    return (
        <SelectionContext.Provider value={{
            selectedInfluencers,
            selectedVenues,
            favorites,
            toggleInfluencerSelection,
            toggleVenueSelection,
            toggleFavorite,
            isFavorite
        }}>
            {children}
        </SelectionContext.Provider>
    );
};
