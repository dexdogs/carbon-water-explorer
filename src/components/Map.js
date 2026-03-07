'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import egridData from '../../data/egrid_regions.json';
import waterData from '../../data/water_stress.json';
import dcData from '../../data/datacenters.json';

function enrichDataCenters() {
  const egridMap = {};
  egridData.regions.forEach(r => { egridMap[r.id] = r; });

  return dcData.datacenters.map(dc => {
    let closestWater = null;
    let minDist = Infinity;
    waterData.regions.forEach(w => {
      const dist = Math.sqrt(Math.pow(dc.lat - w.lat, 2) + Math.pow(dc.lng - w.lng, 2));
      if (dist < minDist) { minDist = dist; closestWater = w; }
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
  const [loaded, setLoaded] = useState(false);
  const enrichedDCs = useRef(enrichDataCenters());
  const clickHandlerRef = useRef(null);

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

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.current.on('load', () => {
      const dcs = enrichedDCs.current;

      const features = dcs.map(dc => ({
        type: 'Feature',
        properties: {
          id: dc.id,
          name: dc.name,
          metro: dc.metro || dc.name,
          operator: dc.operator,
          capacity_mw: dc.capacity_mw,
          co2_rate: dc.co2_rate,
          stress_score: dc.stress_score,
          stress_label: dc.stress_label,
          withdrawal_ratio: dc.withdrawal_ratio,
          egrid_region: dc.egrid_region,
          notes: dc.notes,
          color: '#2dd4a0',
          label: '',
        },
        geometry: {
          type: 'Point',
          coordinates: [dc.lng, dc.lat],
        },
      }));

      map.current.addSource('datacenters', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      });

      map.current.addLayer({
        id: 'dc-glow',
        type: 'circle',
        source: 'datacenters',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 18, 5, 26, 7, 36],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.12,
          'circle-blur': 0.8,
        },
      });

      map.current.addLayer({
        id: 'dc-circles',
        type: 'circle',
        source: 'datacenters',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 7, 5, 11, 7, 16],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-opacity': 0.5,
        },
      });

      map.current.addLayer({
        id: 'dc-value-labels',
        type: 'symbol',
        source: 'datacenters',
        layout: {
          'text-field': ['get', 'label'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 8, 5, 10, 7, 12],
          'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      map.current.addLayer({
        id: 'dc-labels',
        type: 'symbol',
        source: 'datacenters',
        layout: {
          'text-field': ['get', 'metro'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 8, 5, 10, 7, 12],
          'text-offset': [0, 2.0],
          'text-anchor': 'top',
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
          'text-allow-overlap': false,
        },
        paint: {
          'text-color': 'rgba(255,255,255,0.55)',
          'text-halo-color': 'rgba(0,0,0,0.8)',
          'text-halo-width': 1,
        },
      });

      map.current.on('mouseenter', 'dc-circles', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'dc-circles', () => {
        map.current.getCanvas().style.cursor = '';
      });

      setLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !loaded) return;

    const dcs = enrichedDCs.current;
    const source = map.current.getSource('datacenters');
    if (!source) return;

    const features = dcs.map(dc => {
      let color, label;

      if (activeLayer === 'carbon') {
        color = getColor(dc.co2_rate, 200, 1600, 'carbon');
        label = `${dc.co2_rate.toFixed(0)}`;
      } else if (activeLayer === 'water') {
        color = getColor(dc.stress_score, 0, 5, 'water');
        label = `${dc.stress_score.toFixed(1)}`;
      } else {
        const composite = getCompositeScore(dc.co2_rate, dc.stress_score);
        color = getColor(composite, 0, 1, 'composite');
        label = `${Math.round(composite * 100)}`;
      }

      return {
        type: 'Feature',
        properties: {
          id: dc.id,
          name: dc.name,
          metro: dc.metro || dc.name,
          operator: dc.operator,
          capacity_mw: dc.capacity_mw,
          co2_rate: dc.co2_rate,
          stress_score: dc.stress_score,
          stress_label: dc.stress_label,
          withdrawal_ratio: dc.withdrawal_ratio,
          egrid_region: dc.egrid_region,
          notes: dc.notes,
          color,
          label,
        },
        geometry: {
          type: 'Point',
          coordinates: [dc.lng, dc.lat],
        },
      };
    });

    source.setData({ type: 'FeatureCollection', features });

    if (clickHandlerRef.current) {
      map.current.off('click', 'dc-circles', clickHandlerRef.current);
    }

    const handler = (e) => {
      if (!e.features || !e.features.length) return;
      const props = e.features[0].properties;
      const coords = e.features[0].geometry.coordinates.slice();
      onSelectDC({
        ...props,
        lat: coords[1],
        lng: coords[0],
        carbonCostPerMWh: (props.co2_rate / 2000) * carbonPrice * pue,
      });
    };

    clickHandlerRef.current = handler;
    map.current.on('click', 'dc-circles', handler);

  }, [activeLayer, carbonPrice, pue, loaded, onSelectDC]);

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
