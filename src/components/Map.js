'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import egridData from '../../data/egrid_regions.json';
import waterData from '../../data/water_stress.json';
import dcData from '../../data/datacenters.json';

// Merge water stress data onto data center entries
function enrichDataCenters() {
  const waterMap = {};
  waterData.regions.forEach(w => {
    waterMap[`${w.lat.toFixed(2)}_${w.lng.toFixed(2)}`] = w;
  });

  const egridMap = {};
  egridData.regions.forEach(r => {
    egridMap[r.id] = r;
  });

  return dcData.datacenters.map(dc => {
    // Find closest water stress data point
    let closestWater = null;
    let minDist = Infinity;
    waterData.regions.forEach(w => {
      const dist = Math.sqrt(Math.pow(dc.lat - w.lat, 2) + Math.pow(dc.lng - w.lng, 2));
      if (dist < minDist) {
        minDist = dist;
        closestWater = w;
      }
    });

    const egrid = egridMap[dc.egrid_region] || {};

    return {
      ...dc,
      co2_rate: egrid.co2_rate || 800,
      stress_score: closestWater ? closestWater.stress_score : 2.0,
      stress_label: closestWater ? closestWater.stress_label : 'Unknown',
      withdrawal_ratio: closestWater ? closestWater.withdrawal_ratio : 0.3,
    };
  });
}

function getColor(value, min, max, spectrum) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  if (spectrum === 'carbon') {
    if (t < 0.25) return '#2dd4a0';
    if (t < 0.5) return '#86efac';
    if (t < 0.75) return '#fbbf24';
    if (t < 0.9) return '#f97316';
    return '#ef4444';
  }
  if (spectrum === 'water') {
    if (t < 0.2) return '#38bdf8';
    if (t < 0.4) return '#67e8f9';
    if (t < 0.6) return '#fbbf24';
    if (t < 0.8) return '#fb923c';
    return '#dc2626';
  }
  // composite
  if (t < 0.2) return '#2dd4a0';
  if (t < 0.4) return '#86efac';
  if (t < 0.6) return '#fbbf24';
  if (t < 0.8) return '#f97316';
  return '#ef4444';
}

function getCompositeScore(co2_rate, stress_score) {
  const carbonNorm = Math.min(co2_rate / 1600, 1);
  const waterNorm = Math.min(stress_score / 5, 1);
  return carbonNorm * 0.5 + waterNorm * 0.5;
}

export default function MapView({ carbonPrice, activeLayer, pue, onSelectDC }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [loaded, setLoaded] = useState(false);

  const enrichedDCs = useRef(enrichDataCenters());

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98.5, 39.5],
      zoom: 4,
      pitch: 0,
      bearing: 0,
      projection: 'mercator',
      attributionControl: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: false,
    }), 'bottom-right');

    map.current.on('load', () => {
      setLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when layer/price/PUE changes
  const updateMarkers = useCallback(() => {
    if (!map.current || !loaded) return;

    // Remove existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    enrichedDCs.current.forEach(dc => {
      const carbonCostPerMWh = (dc.co2_rate / 2000) * carbonPrice * pue;

      let markerColor, markerValue, markerSize;

      if (activeLayer === 'carbon') {
        markerColor = getColor(dc.co2_rate, 200, 1600, 'carbon');
        markerValue = `${dc.co2_rate.toFixed(0)}`;
        markerSize = 20 + (dc.co2_rate / 1600) * 30;
      } else if (activeLayer === 'water') {
        markerColor = getColor(dc.stress_score, 0, 5, 'water');
        markerValue = `${dc.stress_score.toFixed(1)}`;
        markerSize = 20 + (dc.stress_score / 5) * 30;
      } else {
        const composite = getCompositeScore(dc.co2_rate, dc.stress_score);
        markerColor = getColor(composite, 0, 1, 'composite');
        markerValue = `${Math.round(composite * 100)}`;
        markerSize = 20 + composite * 30;
      }

      // Create custom marker element
      const el = document.createElement('div');
      el.style.cssText = `
        width: ${markerSize}px;
        height: ${markerSize}px;
        border-radius: 50%;
        background: ${markerColor}22;
        border: 2px solid ${markerColor};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 0 12px ${markerColor}40;
        position: relative;
      `;

      const inner = document.createElement('div');
      inner.style.cssText = `
        width: ${markerSize * 0.65}px;
        height: ${markerSize * 0.65}px;
        border-radius: 50%;
        background: ${markerColor}44;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', monospace;
        font-size: ${Math.max(9, markerSize * 0.22)}px;
        font-weight: 700;
        color: white;
      `;
      inner.textContent = markerValue;
      el.appendChild(inner);

      // Hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '100';
        el.style.boxShadow = `0 0 24px ${markerColor}80`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
        el.style.boxShadow = `0 0 12px ${markerColor}40`;
      });

      // Click handler
      el.addEventListener('click', () => {
        onSelectDC({
          ...dc,
          carbonCostPerMWh,
        });
      });

      // Add label below marker
      const label = document.createElement('div');
      label.style.cssText = `
        position: absolute;
        bottom: -18px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        color: rgba(255,255,255,0.6);
        text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        pointer-events: none;
      `;
      label.textContent = dc.metro || dc.name;
      el.appendChild(label);

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([dc.lng, dc.lat])
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [carbonPrice, activeLayer, pue, loaded, onSelectDC]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Add eGRID region circles as a background layer
  useEffect(() => {
    if (!map.current || !loaded) return;

    // Add eGRID regions as a source if not already
    if (!map.current.getSource('egrid-regions')) {
      const features = egridData.regions.filter(r => r.bbox).map(r => ({
        type: 'Feature',
        properties: {
          id: r.id,
          name: r.name,
          co2_rate: r.co2_rate,
        },
        geometry: {
          type: 'Point',
          coordinates: [r.lng, r.lat],
        },
      }));

      map.current.addSource('egrid-regions', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      });

      map.current.addLayer({
        id: 'egrid-heatmap',
        type: 'circle',
        source: 'egrid-regions',
        paint: {
          'circle-radius': 80,
          'circle-color': [
            'interpolate', ['linear'], ['get', 'co2_rate'],
            200, '#2dd4a022',
            600, '#86efac22',
            900, '#fbbf2422',
            1200, '#f9731622',
            1600, '#ef444422',
          ],
          'circle-blur': 1,
          'circle-opacity': 0.6,
        },
      });
    }
  }, [loaded]);

  return (
    <div
      ref={mapContainer}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
