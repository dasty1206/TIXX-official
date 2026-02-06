import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelection } from '../contexts/SelectionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateInfluencerPrice, formatCurrency } from '../utils/pricing';
import { influencersData, venuesData } from '../utils/mockData';

const FloatingBar = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const { selectedInfluencers, selectedVenues } = useSelection();

    // Determine context (Influencer or Venue) based on path
    const isInfluencerPage = location.pathname.includes('/influencers') || location.pathname === '/';
    const isVenuePage = location.pathname.includes('/venue');
    const isMySelections = location.pathname.includes('/my-selections');

    // Only show bar on Search pages
    const showBar = isInfluencerPage || isVenuePage;

    // Calculate Costs logic
    const totalInfluencerCost = useMemo(() => {
        return selectedInfluencers.reduce((total, id) => {
            const inf = influencersData.find(i => i.id === id);
            if (!inf) return total;
            // Assume all content types selected for max estimate in total, 
            // or just base price. For simplicity using a fixed multiplier logic or base logic:
            // return total + calculateInfluencerPrice(inf.followerCount, ['feed', 'reels', 'story']);
            const price = calculateInfluencerPrice(inf.followerCount, ['feed', 'reels', 'story']);
            return total + price.min;
        }, 0);
    }, [selectedInfluencers]);

    const totalVenueCost = useMemo(() => {
        return selectedVenues.reduce((total, id) => {
            const venue = venuesData.find(v => v.id === id);
            return total + (venue ? venue.price : 0);
        }, 0);
    }, [selectedVenues]);

    if (!showBar) return null;

    const count = isInfluencerPage ? selectedInfluencers.length : selectedVenues.length;
    const cost = isInfluencerPage ? totalInfluencerCost : totalVenueCost;
    const label = isInfluencerPage ? "Selected Influencers" : "Selected Venues";

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-[#1d1d1f] text-white rounded-full px-8 py-4 shadow-2xl flex items-center justify-between z-50 border-2 border-transparent transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-0.5">{label}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold font-mono text-accent">{count}</span>
                        <span className="text-sm text-gray-400">items</span>
                    </div>
                </div>

                <div className="h-8 w-px bg-gray-700"></div>

                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">총 금액 (최저 금액)</span>
                    <span className="text-xl font-bold font-mono">{formatCurrency(cost)}~</span>
                </div>
            </div>

            <button className="bg-accent text-black px-6 py-2.5 rounded-full font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(242,247,98,0.3)] active:scale-95">
                {t('common.sendRequest')}
            </button>
        </div>
    );
};

export default FloatingBar;
