import React, { useState, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Calendar, DollarSign, Maximize, ChevronDown, Heart, Check } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useLanguage } from '../contexts/LanguageContext';
import { useSelection } from '../contexts/SelectionContext';
import { venuesData } from '../utils/mockData';
import { formatCurrency } from '../utils/pricing';
import ErrorBoundary from '../components/ErrorBoundary';

// Custom Input Component
// eslint-disable-next-line react/display-name
const DateCustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <button
        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center text-black font-medium focus:outline-none focus:border-black transition-colors flex items-center h-[38px] whitespace-nowrap overflow-hidden hover:bg-gray-50"
        onClick={onClick}
        ref={ref}
    >
        {value || <span className="text-gray-400 font-normal">{placeholder}</span>}
    </button>
));

const VenueSearch = () => {
    const { t, language } = useLanguage();
    const { selectedVenues, toggleVenueSelection, favorites, toggleFavorite, isFavorite } = useSelection();
    console.log("VenueSearch component rendering"); // Debug log
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [sortOption, setSortOption] = useState('recommended');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Purpose Filter State
    const [selectedPurposes, setSelectedPurposes] = useState([]);
    const venuePurposes = ['club', 'lounge', 'hotel', 'emptyVenue', 'pub', 'cafe', 'partyRoom', 'afterParty', 'popUpStore'];

    const togglePurpose = (purpose) => {
        setSelectedPurposes(prev =>
            prev.includes(purpose)
                ? prev.filter(p => p !== purpose)
                : [...prev, purpose]
        );
    };

    // Filter & Sort Logic
    const filteredVenues = venuesData.filter(venue => {
        // Purpose Filter
        if (selectedPurposes.length > 0) {
            // Safety check for types array. treat undefined as empty array
            const venueTypes = Array.isArray(venue.types) ? venue.types : [];
            if (!venueTypes.some(type => selectedPurposes.includes(type))) {
                return false;
            }
        }
        return true;
    });

    const sortedVenues = [...filteredVenues].sort((a, b) => {
        if (sortOption === 'priceLow') return a.price - b.price;
        if (sortOption === 'priceHigh') return b.price - a.price;
        return 0; // recommended
    });

    const handleSortSelect = (option) => {
        setSortOption(option);
        setIsSortOpen(false);
    };

    const getSortLabel = () => {
        if (sortOption === 'priceLow') return t('venue.sort.priceLow');
        if (sortOption === 'priceHigh') return t('venue.sort.priceHigh');
        return t('venue.sort.recommended');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {/* Top Filter Bar */}
            <div className="bg-white px-4 md:px-6 py-4 border-b border-gray-100 flex flex-wrap items-center shadow-sm z-10 sticky top-0 justify-between">

                {/* Left: Title & Main Filters */}
                <div className="flex flex-1 items-center gap-3 md:gap-6 overflow-x-auto pb-2 md:pb-0 hide-scrollbar pr-4">
                    <h2 className="text-xl font-bold whitespace-nowrap mr-2 text-black">{t('venue.title')}</h2>
                    <div className="h-6 w-px bg-gray-200 hidden md:block flex-shrink-0"></div>

                    {/* Location */}
                    <div className="relative min-w-[140px] md:min-w-[160px] max-w-[200px] flex-shrink-0">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder={t('venue.filters.location')}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors font-medium hover:bg-gray-50"
                        />
                    </div>

                    {/* Date Picker Range (With Portal) */}
                    <div className="relative min-w-[220px] md:min-w-[240px] max-w-[260px] flex-shrink-0">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-black z-10 pointer-events-none" size={16} strokeWidth={2.5} />
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => setDateRange(update)}
                            customInput={<DateCustomInput placeholder="0000-00-00 ~ 0000-00-00" />}
                            dateFormat="yyyy-MM-dd"
                            popperClassName="z-[9999]"
                            popperContainer={({ children }) => createPortal(children, document.body)}
                            calendarClassName="!shadow-2xl !border-0 !rounded-2xl"
                            dayClassName={() => "rounded-full hover:bg-gray-100"}
                        />
                    </div>

                    {/* Price Range */}
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 min-w-[200px] md:min-w-[210px] h-[38px] flex-shrink-0 hover:bg-gray-50 transition-colors">
                        <DollarSign className="text-black mr-2 flex-shrink-0" size={16} strokeWidth={2.5} />
                        <input type="text" placeholder="Min" className="w-14 md:w-16 bg-transparent text-sm py-2 focus:outline-none text-right font-medium" />
                        <span className="mx-2 text-gray-400 text-xs text-nowrap">~</span>
                        <input type="text" placeholder="Max" className="w-14 md:w-16 bg-transparent text-sm py-2 focus:outline-none text-right font-medium" />
                        <span className="text-xs text-gray-800 ml-1 text-nowrap font-bold">만원</span>
                    </div>

                    {/* Size (Pyeong) Range */}
                    <div className="relative min-w-[150px] md:min-w-[170px] flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 h-[38px] flex-shrink-0 hover:bg-gray-50 transition-colors">
                        <Maximize className="text-black mr-2 flex-shrink-0" size={16} strokeWidth={2.5} />
                        <input type="text" placeholder="Min" className="w-10 md:w-12 bg-transparent text-sm py-2 focus:outline-none text-center font-medium" />
                        <span className="mx-1 text-gray-400 text-xs">~</span>
                        <input type="text" placeholder="Max" className="w-10 md:w-12 bg-transparent text-sm py-2 focus:outline-none text-center font-medium" />
                        <span className="text-xs text-gray-800 ml-1 text-nowrap font-bold">평</span>
                    </div>
                </div>

                {/* Right: Action Button */}
                <button className="ml-2 md:ml-4 p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm active:scale-95 duration-200">
                    <Search size={18} strokeWidth={3} />
                </button>

                {/* Purpose Filter Row - Full Width */}
                <div className="w-full flex items-center gap-2 mt-4 overflow-x-auto hide-scrollbar pb-1">
                    <span className="text-sm font-bold text-gray-900 mr-2 flex-shrink-0">Purpose:</span>
                    {venuePurposes.map(purpose => (
                        <button
                            key={purpose}
                            onClick={() => togglePurpose(purpose)}
                            className={`
                                px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 whitespace-nowrap
                                ${selectedPurposes.includes(purpose)
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                            `}
                        >
                            {selectedPurposes.includes(purpose) && <Check size={12} strokeWidth={3} />}
                            {t(`venue.purposes.${purpose}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Map View (Left Split) - 40% width */}
                <div className="w-5/12 bg-gray-100 relative hidden lg:block border-r border-gray-200">
                    {/* Map placeholder */}
                    <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Neighborhood_Map_1002.svg')] bg-cover bg-center grayscale contrast-75 brightness-110"></div>

                    {/* Map Pins */}
                    {sortedVenues.map(venue => (
                        <div
                            key={venue.id}
                            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                            style={{ top: venue.coordinates.top, left: venue.coordinates.left }}
                        >
                            <div className={`p-2 rounded-full shadow-lg transition-transform hover:scale-110 ${selectedVenues.includes(venue.id) ? 'bg-accent text-black scale-110 shadow-xl ring-2 ring-white' : 'bg-black text-white'}`}>
                                <MapPin size={24} fill="currentColor" />
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-black border border-gray-100 transform translate-y-1">
                                {venue.name}
                            </div>
                        </div>
                    ))}
                </div>

                {/* List View (Right Split) */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#f5f5f7] pb-32">
                    <div className="mb-4 flex justify-between items-center relative z-20">
                        <p className="text-gray-500 text-sm">
                            {t('venue.showing').replace('{count}', sortedVenues.length)}
                        </p>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 text-sm font-bold hover:underline bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100"
                            >
                                {t('venue.sort.label')}: <span className="text-black">{getSortLabel()}</span> <ChevronDown size={14} />
                            </button>
                            {isSortOpen && (
                                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 font-medium transition-colors"
                                        onClick={() => handleSortSelect('recommended')}
                                    >
                                        {t('venue.sort.recommended')}
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 font-medium transition-colors"
                                        onClick={() => handleSortSelect('priceLow')}
                                    >
                                        {t('venue.sort.priceLow')}
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 font-medium transition-colors"
                                        onClick={() => handleSortSelect('priceHigh')}
                                    >
                                        {t('venue.sort.priceHigh')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {sortedVenues.map(venue => {
                            const isSelected = selectedVenues.includes(venue.id);
                            const isLiked = isFavorite('venue', venue.id);
                            const displayLocation = language === 'ko' && venue.locationKo ? venue.locationKo : venue.location;

                            return (
                                <div
                                    key={venue.id}
                                    className={`
                      flex flex-col md:flex-row bg-white rounded-xl overflow-hidden transition-all duration-300 relative
                      ${isSelected ? 'shadow-[0_0_0_2px_#f2f762] shadow-accent scale-[1.01]' : 'shadow-sm hover:shadow-md border border-transparent'}
                    `}
                                >
                                    <div className="w-full h-48 md:w-48 md:h-40 flex-shrink-0 bg-gray-200 relative">
                                        <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite('venue', venue.id); }}
                                            className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                                        >
                                            <Heart size={16} fill={isLiked ? "#ff4d4d" : "none"} stroke={isLiked ? "#ff4d4d" : "black"} strokeWidth={2} />
                                        </button>
                                    </div>

                                    <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg text-black">{venue.name}</h3>
                                                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                    <MapPin size={14} />
                                                    <span>{displayLocation}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-black">{formatCurrency(venue.price)} <span className="text-xs text-gray-400 font-normal">/ day</span></p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex gap-2 md:gap-4 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
                                                <span className="text-xs bg-gray-100 px-2 md:px-2.5 py-1 rounded text-gray-700 font-bold whitespace-nowrap">{venue.pyeong}평</span>
                                                <span className="text-xs bg-gray-100 px-2 md:px-2.5 py-1 rounded text-gray-700 font-bold whitespace-nowrap">{venue.sqm}m²</span>
                                                <span className="text-xs bg-gray-100 px-2 md:px-2.5 py-1 rounded text-gray-700 font-bold whitespace-nowrap">Capacity 100+</span>
                                            </div>

                                            <button
                                                onClick={() => toggleVenueSelection(venue.id)}
                                                className={`
                              px-4 md:px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 shadow-sm flex-shrink-0
                              ${isSelected
                                                        ? 'bg-accent text-black hover:brightness-95'
                                                        : 'bg-black text-white hover:bg-gray-800'}
                            `}
                                            >
                                                {isSelected ? t('common.selected') : t('common.select')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VenueSearchWithBoundary = (props) => (
    <ErrorBoundary>
        <VenueSearch {...props} />
    </ErrorBoundary>
);

export default VenueSearchWithBoundary;
