import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import toast from 'react-hot-toast';

// Import marker images using ES modules
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Draggable marker component
function DraggableMarker({ position, setPosition }) {
  const markerRef = React.useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        setPosition(marker.getLatLng());
      }
    },
  };

  return (
    <Marker draggable position={position} ref={markerRef} eventHandlers={eventHandlers}>
      <Popup>Drag me to adjust your delivery location.</Popup>
    </Marker>
  );
}

function Delivery() {
  const [position, setPosition] = useState(null);
  const [shareableLink, setShareableLink] = useState("");

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Error retrieving location:", err);
          toast.error("Unable to retrieve your location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const generateLink = () => {
    if (position) {
      // Generate an OpenStreetMap link with the coordinates
      const { lat, lng } = position;
      const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
      setShareableLink(url);
    }
  };

  const handleCopy = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink).then(() => {
        toast.success("Link copied to clipboard!");
      }).catch((error) => {
        console.error("Error copying link:", error);
        toast.error("Failed to copy link.");
      });
    }
  };

  if (!position) return <div>Loading map...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Delivery Location</h1>
      <div className="w-full max-w-4xl h-96">
        <MapContainer center={position} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
      <div className="mt-4 p-4 bg-white rounded shadow w-full max-w-4xl">
        <h2 className="text-xl font-bold">Current Coordinates:</h2>
        <p>Latitude: {position.lat.toFixed(6)}</p>
        <p>Longitude: {position.lng.toFixed(6)}</p>
        <button 
          onClick={generateLink}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Generate Shareable Link
        </button>
        {shareableLink && (
          <div className="mt-4 flex items-center space-x-2">
            <label className="block font-semibold mb-2">Shareable Link:</label>
            <input 
              type="text"
              readOnly
              value={shareableLink}
              onClick={(e) => e.target.select()}
              className="w-full p-2 border rounded"
            />
            <button onClick={handleCopy} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Delivery;
