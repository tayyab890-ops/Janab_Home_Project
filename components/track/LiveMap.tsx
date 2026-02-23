"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
const createCustomIcon = (color: string) => {
    return L.divIcon({
        html: `<div style="background-color: ${color};" class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
               </div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const riderIcon = L.divIcon({
    html: `<div class="bg-primary p-2 rounded-full border-2 border-white shadow-lg animate-bounce">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
         </div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

interface LiveMapProps {
    order: any;
}

function ChangeView({ center }: { center: L.LatLngExpression }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

export default function LiveMap({ order }: LiveMapProps) {
    const HARIPUR_CENTER: [number, number] = [33.9946, 72.9341];
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getCoords = (data: any, type: 'pickup' | 'dropoff' | 'rider'): L.LatLngExpression => {
        if (!data) return HARIPUR_CENTER;

        try {
            if (type === 'pickup') {
                if (data.origin?.lat && data.origin?.lng) return [data.origin.lat, data.origin.lng];
                if (data.pickupLat && data.pickupLng) return [data.pickupLat, data.pickupLng];
                return [HARIPUR_CENTER[0] + 0.005, HARIPUR_CENTER[1] + 0.005];
            }

            if (type === 'dropoff') {
                if (data.destination?.lat && data.destination?.lng) return [data.destination.lat, data.destination.lng];
                if (data.deliveryLat && data.deliveryLng) return [data.deliveryLat, data.deliveryLng];
                return [HARIPUR_CENTER[0] - 0.005, HARIPUR_CENTER[1] - 0.005];
            }

            if (type === 'rider') {
                if (data.currentLocation?.lat && data.currentLocation?.lng) return [data.currentLocation.lat, data.currentLocation.lng];
                if (data.location?.latitude && data.location?.longitude) return [data.location.latitude, data.location.longitude];
                return HARIPUR_CENTER;
            }
        } catch (e) {
            return HARIPUR_CENTER;
        }

        return HARIPUR_CENTER;
    };

    if (!isMounted) return null;

    const pickup = getCoords(order, 'pickup');
    const dropoff = getCoords(order, 'dropoff');
    const rider = getCoords(order, 'rider');

    return (
        <div className="h-full w-full rounded-[2rem] overflow-hidden z-[1] shadow-inner bg-slate-100 min-h-[300px]">
            <MapContainer
                center={rider}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={pickup} icon={createCustomIcon('#2563eb')}>
                    <Popup>
                        <div className="font-bold">Pickup Point</div>
                        <div className="text-xs">{order?.pickupAddress || "Pickup location"}</div>
                    </Popup>
                </Marker>

                <Marker position={dropoff} icon={createCustomIcon('#e11d48')}>
                    <Popup>
                        <div className="font-bold">Destination</div>
                        <div className="text-xs">{order?.deliveryAddress || "Delivery destination"}</div>
                    </Popup>
                </Marker>

                <Marker position={rider} icon={riderIcon}>
                    <Popup>Rider is here</Popup>
                </Marker>

                {order && (
                    <Polyline
                        positions={[pickup, rider, dropoff]}
                        color="#facc15"
                        weight={5}
                        dashArray="1, 10"
                        opacity={0.8}
                        lineCap="round"
                        lineJoin="round"
                    />
                )}

                <ChangeView center={rider} />
            </MapContainer>
        </div>
    );
}
