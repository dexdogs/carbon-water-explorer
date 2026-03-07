'use client';

import { useState, useCallback } from 'react';
import MapView from '../components/Map';
import Controls from '../components/Controls';
import Legend from '../components/Legend';
import InfoPanel from '../components/InfoPanel';
import Header from '../components/Header';

export default function Home() {
  const [carbonPrice, setCarbonPrice] = useState(50);
  const [activeLayer, setActiveLayer] = useState('composite'); // 'carbon', 'water', 'composite'
  const [selectedDC, setSelectedDC] = useState(null);
  const [pue, setPue] = useState(1.3);

  const handleSelectDC = useCallback((dc) => {
    setSelectedDC(dc);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedDC(null);
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

      <Header />

      <Controls
        carbonPrice={carbonPrice}
        setCarbonPrice={setCarbonPrice}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        pue={pue}
        setPue={setPue}
      />

      <Legend activeLayer={activeLayer} />

      {selectedDC && (
        <InfoPanel
          dc={selectedDC}
          carbonPrice={carbonPrice}
          pue={pue}
          onClose={handleClosePanel}
        />
      )}
    </main>
  );
}
