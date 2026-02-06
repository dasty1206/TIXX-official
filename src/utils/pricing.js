export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
};

export const calculateInfluencerPrice = (followerCount, contentTypes = ['feed']) => {
    // Base Formula: 
    // Feed Min = N * 10
    // Feed Max = N * 15
    // Reels Min = Feed Min * 1.5, Reels Max = Feed Max * 2
    // Story = Feed Avg * 0.3 (simplified range)

    // Tiers override logic if specific ranges are strictly provided, but user said "Formula" 
    // "2. 자동 견적 산출 알고리즘" section seems to be the source of truth for dynamic calc.

    let totalMin = 0;
    let totalMax = 0;

    const feedMin = followerCount * 10;
    const feedMax = followerCount * 15;

    if (contentTypes.includes('feed')) {
        totalMin += feedMin;
        totalMax += feedMax;
    }

    if (contentTypes.includes('reels')) {
        totalMin += feedMin * 1.5;
        totalMax += feedMax * 2;
    }

    if (contentTypes.includes('story')) {
        // Guidelines say "30% level". Let's use 30% of Min and Max.
        totalMin += feedMin * 0.3;
        totalMax += feedMax * 0.3;
    }

    // Round to nearest 1000 for cleaner numbers
    totalMin = Math.round(totalMin / 1000) * 1000;
    totalMax = Math.round(totalMax / 1000) * 1000;

    return { min: totalMin, max: totalMax };
};

export const getInfluencerTier = (followerCount) => {
    if (followerCount >= 100000) return 'Mega';
    if (followerCount >= 50000) return 'Macro';
    if (followerCount >= 10000) return 'Micro';
    return 'Nano';
};
