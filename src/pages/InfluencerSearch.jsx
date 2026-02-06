import React, { useState } from 'react';
import { Filter, LayoutGrid, List, Check, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSelection } from '../contexts/SelectionContext';
import { influencersData } from '../utils/mockData';
import { formatCurrency } from '../utils/pricing';

const formatFollowers = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
};

const getInfluencerTier = (followerCount) => {
    if (followerCount >= 1000000) return 'Mega';
    if (followerCount >= 50000) return 'Macro';
    if (followerCount >= 10000) return 'Micro';
    return 'Nano';
};

const InfluencerSearch = () => {
    const { t } = useLanguage();
    const { selectedInfluencers, toggleInfluencerSelection, favorites, toggleFavorite, isFavorite } = useSelection();

    const [viewMode, setViewMode] = useState('grid');
    const [contentTypes, setContentTypes] = useState(['feed']);
    const [selectedTiers, setSelectedTiers] = useState([]);

    const tiers = [
        { name: 'Nano', range: '1k~10k' },
        { name: 'Micro', range: '10k~50k' },
        { name: 'Macro', range: '50k~100k' },
        { name: 'Mega', range: '100k+' },
    ];

    const toggleContentType = (type) => {
        setContentTypes(prev => {
            const newTypes = prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type];
            return newTypes.length === 0 ? ['feed'] : newTypes;
        });
    };

    const toggleTier = (tierName) => {
        setSelectedTiers(prev =>
            prev.includes(tierName) ? prev.filter(t => t !== tierName) : [...prev, tierName]
        );
    };

    return (
        <div className="flex flex-col min-h-screen px-6 py-6 max-w-7xl mx-auto">
            {/* Header & Controls */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1d1d1f]">{t('influencer.title')}</h1>
                    <p className="text-gray-500 mt-1">{t('influencer.subtitle')}</p>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg self-start md:self-auto">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Top Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col xl:flex-row gap-4 xl:items-center">
                <div className="flex items-center gap-2 text-gray-500 mr-2 xl:border-r border-gray-200 pr-4 self-start xl:self-center">
                    <Filter size={18} className="text-black" strokeWidth={2.5} />
                    <span className="font-bold text-sm uppercase tracking-wide text-black">Filters</span>
                </div>

                <div className="flex flex-wrap gap-4 items-center flex-1">
                    {/* Content Type Filter */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['feed', 'reels', 'story'].map(type => (
                            <button
                                key={type}
                                onClick={() => toggleContentType(type)}
                                className={`
                   px-3 py-1.5 rounded-md text-sm font-bold capitalize transition-all flex items-center gap-1.5
                   ${contentTypes.includes(type) ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}
                 `}
                            >
                                {contentTypes.includes(type) && <Check size={14} strokeWidth={3} />}
                                {type}
                            </button>
                        ))}
                    </div>

                    <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black cursor-pointer font-medium text-black">
                        <option>{t('influencer.filters.allCategories')}</option>
                        <option>Fashion & Beauty</option>
                        <option>Tech</option>
                        <option>Lifestyle</option>
                    </select>

                    {/* Tier Filter Buttons */}
                    <div className="flex gap-2">
                        {tiers.map(tier => (
                            <button
                                key={tier.name}
                                onClick={() => toggleTier(tier.name)}
                                className={`
                   px-3 py-2 rounded-lg text-sm border transition-colors flex flex-col items-center leading-none
                   ${selectedTiers.includes(tier.name)
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                 `}
                            >
                                <span className="font-bold mb-0.5">{tier.name}</span>
                                <span className={`text-[10px] ${selectedTiers.includes(tier.name) ? 'text-gray-300' : 'text-gray-400'}`}>{tier.range}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {['IG', 'YT', 'TK'].map(platform => (
                            <label key={platform} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black" defaultChecked />
                                <span className="text-sm font-bold text-black">{platform}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-20">
                    {influencersData.map((influencer) => {
                        const isSelected = selectedInfluencers.includes(influencer.id);
                        const tier = getInfluencerTier(influencer.followerCount);
                        const isLiked = isFavorite('influencer', influencer.id);

                        return (
                            <div
                                key={influencer.id}
                                className={`
                  bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 relative group
                  ${isSelected ? 'shadow-[0_0_0_2px_#f2f762] shadow-xl' : 'shadow-sm hover:shadow-apple border border-transparent'}
                `}
                            >
                                <div className="relative aspect-[4/5] bg-gray-100">
                                    <img src={influencer.image} alt={influencer.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute bottom-2 right-2 flex gap-2 z-10">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite('influencer', influencer.id); }}
                                            className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                                        >
                                            <Heart size={16} fill={isLiked ? "#ff4d4d" : "none"} stroke={isLiked ? "#ff4d4d" : "black"} strokeWidth={2} />
                                        </button>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">
                                        {influencer.category}
                                    </div>
                                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm border border-white/20">
                                        {tier}
                                    </div>
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-accent/20 flex items-center justify-center pointer-events-none">
                                            <div className="bg-accent text-black px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                                                {t('common.selected')}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-3">
                                    <div className="mb-3">
                                        <h3 className="font-bold text-base text-black leading-tight truncate">{influencer.name}</h3>
                                        <p className="text-xs text-gray-400">{influencer.handle}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="text-center bg-gray-50 rounded p-1.5">
                                            <p className="font-bold text-sm text-black">{formatFollowers(influencer.followerCount)}</p>
                                            <p className="text-[9px] uppercase text-gray-400 tracking-wide">{t('influencer.stats.followers')}</p>
                                        </div>
                                        <div className="text-center bg-gray-50 rounded p-1.5">
                                            <p className="font-bold text-sm text-black">{influencer.engagement}</p>
                                            <p className="text-[9px] uppercase text-gray-400 tracking-wide">Eng.</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleInfluencerSelection(influencer.id)}
                                        className={`
                      w-full py-2 rounded-md font-bold text-xs transition-all duration-200
                      ${isSelected
                                                ? 'bg-black text-white'
                                                : 'bg-white border border-gray-200 text-black hover:bg-black hover:text-white'}
                    `}
                                    >
                                        {isSelected ? t('common.selected') : t('common.select')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col gap-3 mb-20">
                    {influencersData.map((influencer) => {
                        const isSelected = selectedInfluencers.includes(influencer.id);
                        const isLiked = isFavorite('influencer', influencer.id);

                        return (
                            <div
                                key={influencer.id}
                                onClick={() => toggleInfluencerSelection(influencer.id)}
                                className={`
                  flex items-center p-3 bg-white rounded-xl cursor-pointer transition-all border
                  ${isSelected ? 'border-accent shadow-md bg-accent/5' : 'border-transparent shadow-sm hover:shadow-md hover:border-gray-100'}
                `}
                            >
                                <img src={influencer.image} alt={influencer.name} className="w-12 h-12 rounded-full object-cover mr-4" />

                                <div className="w-48">
                                    <h3 className="font-bold text-sm text-black">{influencer.name}</h3>
                                    <p className="text-xs text-gray-400">{influencer.handle}</p>
                                </div>

                                <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                                    <div className="text-sm"><span className="text-gray-400 text-xs mr-2">{t('influencer.stats.platform')}:</span>{influencer.platform}</div>
                                    <div className="text-sm"><span className="text-gray-400 text-xs mr-2">{t('influencer.stats.followers')}:</span>{formatFollowers(influencer.followerCount)}</div>
                                    <div className="text-sm"><span className="text-gray-400 text-xs mr-2">Category:</span>{influencer.category}</div>
                                    <div className="text-sm"><span className="text-gray-400 text-xs mr-2">Eng:</span>{influencer.engagement}</div>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite('influencer', influencer.id); }}
                                    className="p-2 mr-2 rounded-full hover:bg-gray-100"
                                >
                                    <Heart size={18} fill={isLiked ? "#ff4d4d" : "none"} stroke={isLiked ? "#ff4d4d" : "black"} strokeWidth={2} />
                                </button>

                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-2 ${isSelected ? 'border-accent bg-accent' : 'border-gray-200'}`}>
                                    {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default InfluencerSearch;
