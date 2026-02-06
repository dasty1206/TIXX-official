import React, { useState } from 'react';
import { useSelection } from '../contexts/SelectionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { influencersData, venuesData } from '../utils/mockData';
import { Heart, MapPin } from 'lucide-react';

const MySelections = () => {
    const { t } = useLanguage();
    const { favorites, toggleFavorite } = useSelection();
    const [activeTab, setActiveTab] = useState('influencer');

    // Filter favorites based on type
    const favoriteInfluencers = influencersData.filter(item =>
        favorites.some(fav => fav.type === 'influencer' && fav.id === item.id)
    );

    const favoriteVenues = venuesData.filter(item =>
        favorites.some(fav => fav.type === 'venue' && fav.id === item.id)
    );

    return (
        <div className="min-h-screen bg-[#f5f5f7] pt-8 px-6 max-w-7xl mx-auto pb-32">
            <h1 className="text-3xl font-bold mb-6">My Selections</h1>

            <div className="flex gap-4 mb-8 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab('influencer')}
                    className={`pb-2 px-4 font-bold transition-colors ${activeTab === 'influencer' ? 'text-black border-b-2 border-accent' : 'text-gray-400 hover:text-black'}`}
                >
                    Influencers ({favoriteInfluencers.length})
                </button>
                <button
                    onClick={() => setActiveTab('venue')}
                    className={`pb-2 px-4 font-bold transition-colors ${activeTab === 'venue' ? 'text-black border-b-2 border-accent' : 'text-gray-400 hover:text-black'}`}
                >
                    Venues ({favoriteVenues.length})
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {activeTab === 'influencer' && favoriteInfluencers.map(item => (
                    <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm relative group">
                        <div className="relative aspect-[4/5] bg-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <button
                                onClick={() => toggleFavorite('influencer', item.id)}
                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                            >
                                <Heart size={16} fill="#ff4d4d" stroke="#ff4d4d" />
                            </button>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-gray-500 text-xs">{item.handle}</p>
                        </div>
                    </div>
                ))}

                {activeTab === 'venue' && favoriteVenues.map(item => (
                    <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm relative group col-span-1 md:col-span-2">
                        <div className="relative h-48 bg-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <button
                                onClick={() => toggleFavorite('venue', item.id)}
                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                            >
                                <Heart size={16} fill="#ff4d4d" stroke="#ff4d4d" />
                            </button>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                <MapPin size={12} />
                                <span>{item.location}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {((activeTab === 'influencer' && favoriteInfluencers.length === 0) ||
                    (activeTab === 'venue' && favoriteVenues.length === 0)) && (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            <Heart size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No favorites yet.</p>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default MySelections;
