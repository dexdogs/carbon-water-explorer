'use client';

import { useState, useCallback } from 'react';
import MapView from '../components/Map';
import Controls from '../components/Controls';
import Legend from '../components/Legend';
import InfoPanel from '../components/InfoPanel';
import ComparePanel from '../components/ComparePanel';
import Header from '../components/Header';
import MethodologyPanel from '../components/MethodologyPanel';
import InfoDropdown from '../components/InfoDropdown';

export default function Home() {
  const [carbonPrice, setCarbonPrice] = useState(50);
  const [activeLayer, setActiveLayer] = useState('composite');
  const [selectedDC, setSelectedDC] = useState(null);
  const [pue, setPue] = useState(1.3);

  // Compare mode
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);

  // Methodology panel
  const [showMethodology, setShowMethodology] = useState(false);

  // Info dropdown
  const [showInfo, setShowInfo] = useState(false);

  const handleSelectDC = useCallback((dc) => {
    if (compareMode) {
      if (!compareA) {
        setCompareA(dc);
      } else if (!compareB) {
        setCompareB(dc);
      } else {
        // Both slots full — replace B
        setCompareB(dc);
      }
    } else {
      setSelectedDC(dc);
    }
  }, [compareMode, compareA, compareB]);

  const handleClosePanel = useCallback(() => {
    setSelectedDC(null);
  }, []);

  const handleToggleCompare = useCallback(() => {
    if (compareMode) {
      // Exiting compare mode
      setCompareMode(false);
      setCompareA(null);
      setCompareB(null);
    } else {
      // Entering compare mode — move current selection to slot A
      setCompareMode(true);
      setCompareA(selectedDC);
      setCompareB(null);
      setSelectedDC(null);
    }
  }, [compareMode, selectedDC]);

  const handleClearCompare = useCallback((slot) => {
    if (slot === 'A') setCompareA(null);
    if (slot === 'B') setCompareB(null);
  }, []);

  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <MapView
        carbonPrice={carbonPrice}
        activeLayer={activeLayer}
        pue={pue}
        onSelectDC={handleSelectDC}
      />

      <Header
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        showMethodology={showMethodology}
        setShowMethodology={setShowMethodology}
      />

      <Controls
        carbonPrice={carbonPrice}
        setCarbonPrice={setCarbonPrice}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        pue={pue}
        setPue={setPue}
        compareMode={compareMode}
        onToggleCompare={handleToggleCompare}
      />

      <Legend activeLayer={activeLayer} />

      {/* Single selection panel */}
      {!compareMode && selectedDC && (
        <InfoPanel
          dc={selectedDC}
          carbonPrice={carbonPrice}
          pue={pue}
          onClose={handleClosePanel}
          onCompare={handleToggleCompare}
        />
      )}

      {/* Compare panel */}
      {compareMode && (
        <ComparePanel
          dcA={compareA}
          dcB={compareB}
          carbonPrice={carbonPrice}
          pue={pue}
          onClose={handleToggleCompare}
          onClear={handleClearCompare}
        />
      )}

      {/* Methodology overlay */}
      {showMethodology && (
        <MethodologyPanel onClose={() => setShowMethodology(false)} />
      )}

      {/* Info dropdown */}
      {showInfo && (
        <InfoDropdown onClose={() => setShowInfo(false)} />
      )}
    </main>
  );
}
