import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
    ko: {
        nav: {
            influencer: '인플루언서 찾기',
            venue: '베뉴 찾기',
            selections: '마이 셀렉션',
        },
        common: {
            select: '선택하기',
            selected: '선택됨',
            sendRequest: '요청 보내기',
            itemsSelected: '개 항목 선택됨',
            reviewShortlist: '선택한 항목을 검토하고 요청을 보내세요.',
        },
        influencer: {
            title: '크리에이터 찾기',
            subtitle: '캠페인에 가장 적합한 인플루언서를 찾아보세요.',
            filters: {
                category: '카테고리',
                followers: '팔로워 수',
                platform: '플랫폼',
                allCategories: '모든 카테고리',
            },
            stats: {
                followers: '팔로워',
                engagement: '참여율',
                platform: '플랫폼',
            },
            view: {
                grid: '그리드',
                list: '리스트',
            }
        },
        venue: {
            title: '공간 찾기',
            filters: {
                location: '위치',
                date: '날짜',
                price: '가격대',
                size: '크기',
            },
            showing: '서울의 {count}개 베뉴를 보여주는 중',
            sort: {
                label: '정렬',
                recommended: '추천순',
                priceLow: '낮은 가격순',
                priceHigh: '높은 가격순',
            },
            purposes: {
                club: '클럽',
                lounge: '라운지',
                hotel: '호텔',
                emptyVenue: '빈 베뉴',
                pub: '펍',
                cafe: '카페',
                partyRoom: '파티룸',
                afterParty: '애프터파티',
                popUpStore: '팝업스토어',
                studio: '스튜디오',
                exhibition: '전시회',
            }
        }
    },
    en: {
        nav: {
            influencer: 'Find Creators',
            venue: 'Find Venues',
            selections: 'My Selections',
        },
        common: {
            select: 'Select',
            selected: 'Selected',
            sendRequest: 'Send Request',
            itemsSelected: 'Items Selected',
            reviewShortlist: 'Review your shortlist before sending.',
        },
        influencer: {
            title: 'Find Creators',
            subtitle: 'Discover and connect with top tier talent for your campaign.',
            filters: {
                category: 'Category',
                followers: 'Followers',
                platform: 'Platform',
                allCategories: 'All Categories',
            },
            stats: {
                followers: 'Followers',
                engagement: 'Engagement',
                platform: 'Platform',
            },
            view: {
                grid: 'Grid',
                list: 'List',
            }
        },
        venue: {
            title: 'Discover Spaces',
            filters: {
                location: 'Location',
                date: 'Date',
                price: 'Price Range',
                size: 'Size',
            },
            showing: 'Showing {count} venues in Seoul',
            sort: {
                label: 'Sort by',
                recommended: 'Recommended',
                priceLow: 'Price: Low to High',
                priceHigh: 'Price: High to Low',
            },
            purposes: {
                club: 'Club',
                lounge: 'Lounge',
                hotel: 'Hotel',
                emptyVenue: 'Empty Venue',
                pub: 'Pub',
                cafe: 'Cafe',
                partyRoom: 'Party Room',
                afterParty: 'After Party',
                popUpStore: 'Pop-up Store',
                studio: 'Studio',
                exhibition: 'Exhibition',
            }
        }
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('ko');

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key;
            }
        }
        return value;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
