import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { SelectionProvider } from './contexts/SelectionContext';
import Navbar from './components/Navbar';
import FloatingBar from './components/FloatingBar';
import InfluencerSearch from './pages/InfluencerSearch';
import VenueSearch from './pages/VenueSearch';
import MySelections from './pages/MySelections';

function App() {
  return (
    <LanguageProvider>
      <SelectionProvider>
        <Router>
          <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans">
            <Navbar />

            {/* Main Content Area */}
            <main className="pt-16 min-h-screen pb-24">
              <Routes>
                <Route path="/" element={<InfluencerSearch />} />
                <Route path="/influencers" element={<InfluencerSearch />} />
                <Route path="/venue" element={<VenueSearch />} />
                <Route path="/my-selections" element={<MySelections />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <FloatingBar />
          </div>
        </Router>
      </SelectionProvider>
    </LanguageProvider>
  );
}

export default App;
