import React, { useEffect, useState } from "react";
import { Phone, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "/src/components/BottomNav";
import Preloader from "/src/components/Preloader";

export default function Contacts() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://sheetdb.io/api/v1/mtp1z8i362ul2"; // google таблица

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки локаций:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-20">
      <button onClick={() => navigate("/")} className="text-blue-600 flex items-center mb-4">
        <ArrowLeft className="mr-2" /> Назад
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Наши дилеры
      </h1>

      {loading ? (
        <Preloader />
      ) : locations.length === 0 ? (
        <p className="text-center text-gray-500">Нет доступных локаций</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => {
            const [lat, lon] = loc.location.split(",").map(Number);

            // Мини-карта через iframe Яндекс/Google Map с маркером
            const mapSrc = `https://yandex.ru/map-widget/v1/?um=constructor%3A0&source=constructor&ll=${lon},${lat}&z=16`;

            return (
              <div key={loc.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-1">{loc.diler}</h2>
                  <p className="text-sm text-gray-700 mb-1">{loc.adress}</p>
                  {loc.Time && <p className="text-sm text-gray-600 mb-1"><strong>Время работы:</strong> {loc.Time}</p>}
                  <p className="text-sm flex items-center gap-1 mb-2">
                    <Phone className="w-4 h-4" /> {loc.Phone}
                  </p>
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm flex items-center gap-1 mb-2"
                  >
                    <MapPin className="w-4 h-4" /> На карте
                  </a>
                  <iframe
                    title={`map-${loc.id}`}
                    src={mapSrc}
                    width="100%"
                    height="150"
                    className="border rounded"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            );
          })}
        </div>
      )}
        <BottomNav />
    </div>
  );
}
