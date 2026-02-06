import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, MapPin, Heart, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
    const { t, language, toggleLanguage } = useLanguage();

    const navItems = [
        { name: t('nav.influencer'), path: '/', icon: Users },
        { name: t('nav.venue'), path: '/venue', icon: MapPin },
        { name: 'My Selections', path: '/my-selections', icon: Heart },
    ];

    return (
        <nav className="h-16 bg-white fixed w-full top-0 z-50 border-b border-gray-100 px-6 flex items-center justify-between">
            <div className="flex items-center gap-12">
                <h1 className="text-xl font-bold tracking-tight">TIXX Connect</h1>

                <div className="flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-gray-100 text-black'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'}
              `}
                        >
                            <item.icon size={18} strokeWidth={2} />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold hover:bg-gray-50 transition-colors uppercase"
            >
                <Globe size={14} />
                {language === 'ko' ? 'EN' : 'KO'}
            </button>
        </nav>
    );
};

export default Navbar;
