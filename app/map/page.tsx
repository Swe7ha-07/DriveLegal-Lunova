"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function HeatMapPage() {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const loadMap = async () => {
      const L = require("leaflet");
      require("leaflet.heat");

      // remove old map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map("map").setView([11.1271, 78.6569], 7);
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap",
        }
      ).addTo(map);

      // 🔥 REALISTIC HEATMAP (RED = HIGH VIOLATION)
      const heatData = [
        [13.0827, 80.2707, 1.0], // Chennai (high)
        [11.0168, 76.9558, 0.9],
        [9.9252, 78.1198, 0.8],
        [10.7905, 78.7047, 0.7],
        [11.6643, 78.1460, 0.6],
        [8.7139, 77.7567, 0.5],
      ];

      L.heatLayer(heatData, {
        radius: 45,
        blur: 30,
        maxZoom: 10,

        // 🎯 CUSTOM COLORS (RED FOCUS)
        gradient: {
          0.2: "yellow",
          0.4: "orange",
          0.6: "red",
          1.0: "darkred",
        },
      }).addTo(map);

      // 🚑 EMERGENCY CENTRES

      const emergencyPlaces = [
        {
          name: "Apollo Hospital - Chennai",
          coords: [13.0604, 80.2496],
          type: "hospital",
        },
        {
          name: "Government Hospital - Madurai",
          coords: [9.9250, 78.1190],
          type: "hospital",
        },
        {
          name: "Police HQ - Chennai",
          coords: [13.0827, 80.2707],
          type: "police",
        },
      ];

      const hospitalIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",
        iconSize: [30, 30],
      });

      const policeIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
        iconSize: [30, 30],
      });

      emergencyPlaces.forEach((place: any) => {
        const icon =
          place.type === "hospital"
            ? hospitalIcon
            : policeIcon;

        L.marker(place.coords, { icon })
          .addTo(map)
          .bindPopup(
            `<b>${place.name}</b><br/>🚑 Emergency Center`
          );
      });
    };

    loadMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        height: "100vh",
        width: "100%",
      }}
    />
  );
}