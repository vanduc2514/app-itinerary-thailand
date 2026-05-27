import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar, Clock, Plane, CheckCircle2, XCircle, 
  AlertCircle, ChevronDown, ChevronUp, Info, Navigation, Globe
} from 'lucide-react';

// Dữ liệu đa ngôn ngữ
const TRANSLATIONS = {
  vi: {
    header: {
      title: "Chương Trình Thái Lan",
      subtitle: "Hà Nội - Bangkok - Pattaya | 5 Ngày 4 Đêm",
      brand: "My Travel Itinerary",
      slogan: "Khám phá thế giới qua từng bước chân",
      updated: "Cập nhật: 2026",
      langToggle: "English"
    },
    map: {
      title: "Bản Đồ Hành Trình (Google Maps)",
      loading: "Đang tải bản đồ Google Maps...",
      note: "* Click vào điểm trên bản đồ để mở Google Maps hoặc ứng dụng bản đồ trên Android",
      searchBtn: "🗺️ Mở Google Maps",
      searchSuffix: "Thái Lan"
    },
    highlights: {
      title: "ĐIỂM NỔI BẬT",
      items: [
        "Khách sạn tiêu chuẩn 4-5 sao.",
        "Cafe máy bay Boeing 747 Bangkok.",
        "Quần thể di tích Muang Boran độc đáo.",
        "Buffet du thuyền 5* sông Chao Phraya.",
        "Thưởng thức Buffet nướng BBQ."
      ]
    },
    itinerary: {
      title: "Lịch Trình Chi Tiết",
      mealLabel: "Ăn",
      googleLink: "Tìm hiểu về điểm này trên Google ↗",
      days: [
        {
          day: 1, title: "NGÀY 01: HÀ NỘI - BANGKOK – PATAYA – CHỢ NỔI - PD SHOW", meals: "Trưa mb, Tối", dateInfo: "Hành trình khởi hành",
          activities: [
            { id: "suvarnabhumi", name: "Sân bay Suvarnabhumi", lat: 13.6900, lng: 100.7501, time: "10:55 - 13:00", desc: "Đến sân bay Suvarnabhumi, làm thủ tục nhập cảnh. Xe và HDV đưa đoàn khởi hành tới Thành Phố Pattaya." },
            { id: "floating-market", name: "Chợ nổi 4 miền", lat: 12.8683, lng: 100.9125, time: "Buổi chiều", desc: "Tham quan Chợ nổi 4 miền nổi tiếng của Thái Lan. Khám phá 4 khu vực Bắc, Trung, Nam và Đông Bắc với các sản vật đặc trưng." },
            { id: "colosseum", name: "Colloseum Show & Massage", lat: 12.9066, lng: 100.8872, time: "Buổi tối", desc: "Ăn tối. Thưởng thức biểu diễn Colloseum Show. Trải nghiệm dịch vụ Massage cổ truyền Thái Lan. Nghỉ ngơi tại Pattaya." }
          ]
        },
        {
          day: 2, title: "NGÀY 02: PATTAYA – ĐẢO CORAL - MODERN LATEX – NÚI PHẬT VÀNG", meals: "Sáng, Trưa, Tối", dateInfo: "Khám phá biển đảo & thiên nhiên",
          activities: [
            { id: "coral-island", name: "Đảo San Hô (Coral Island)", lat: 12.9222, lng: 100.7850, time: "Buổi sáng", desc: "Lên tàu cao tốc ra Đảo San Hô. Tự do tắm biển hoặc tham gia các trò chơi: dù bay, thám hiểm đáy biển... Trở lại đất liền ăn trưa." },
            { id: "khao-chee-chan", name: "Núi Phật Vàng & Trung tâm cao hổ", lat: 12.7648, lng: 100.9561, time: "Buổi chiều", desc: "Tham quan Núi Phật Vàng, Trung tâm cao hổ cốt. Trải nghiệm bắn súng thật tại trường bắn Hoàng Gia." },
            { id: "modern-latex", name: "Modern Latex", lat: 12.9466, lng: 100.8950, time: "Buổi chiều", desc: "Trung Tâm Nghiên Cứu Giấc Ngủ Hoàng Gia. Tìm hiểu cách phòng trị bệnh liên quan cột sống." },
            { id: "bbq-pattaya", name: "Buffet Nướng BBQ Pattaya", lat: 12.9350, lng: 100.8880, time: "Buổi tối", desc: "Ăn tối nướng BBQ. Về khách sạn nghỉ ngơi. Có thể xem Sexy Show hoặc Kaan Show (Tự túc)." }
          ]
        },
        {
          day: 3, title: "NGÀY 03: PATAYA – TRẦM HƯƠNG – MUANG BORAN - BANGKOK - BIG C", meals: "Sáng, Trưa, Tối", dateInfo: "Hành trình văn hóa & mua sắm",
          activities: [
            { id: "agarwood", name: "Bảo Tàng Trầm Hương", lat: 12.9510, lng: 100.9000, time: "Buổi sáng", desc: "Trả phòng. Thăm Bảo Tàng Quốc Tế Trầm Hương, tìm hiểu kiến thức về sức khỏe, phong thủy." },
            { id: "muang-boran", name: "Quần thể Muang Boran", lat: 13.5393, lng: 100.6230, time: "Gần trưa", desc: "Khám phá Thái Lan thu nhỏ với 115 công trình kiến trúc tái tạo. Nơi lưu trữ văn hóa, lịch sử. Ăn trưa." },
            { id: "central-world", name: "Big C, Central World & Đền Erawan", lat: 13.7460, lng: 100.5404, time: "Chiều & Tối", desc: "Tự do mua sắm. Ăn tối. Sau đó đi lễ tại đền thờ Phật 4 mặt linh thiêng Erawan. Nhận phòng tại Bangkok." }
          ]
        },
        {
          day: 4, title: "NGÀY 04: WAT ARUN - TRUNG TÂM RẮN ĐỘC – BUFFET DU THUYỀN", meals: "Sáng, Trưa, Tối", dateInfo: "Trải nghiệm hoàng gia & sông nước",
          activities: [
            { id: "wat-arun", name: "Chùa Wat Arun & Dạo sông", lat: 13.7437, lng: 100.4889, time: "Buổi sáng", desc: "Tham quan chùa Bình Minh (Wat Arun). Dạo thuyền trên dòng sông huyền thoại Chao Phraya." },
            { id: "snake-farm", name: "Viện nghiên cứu Rắn Snake Farm", lat: 13.7322, lng: 100.5323, time: "Gần trưa", desc: "Thưởng thức xiếc rắn, lấy nọc. Tìm hiểu thuốc gia truyền từ Rắn. Ăn trưa tại nhà hàng." },
            { id: "boeing-747", name: "Boeing 747 Cafe Bangkok", lat: 13.7291, lng: 100.7744, time: "Buổi chiều", desc: "Trải nghiệm và thưởng thức cafe trên máy bay độc đáo tại Boeing 747 Cafe Bangkok." },
            { id: "asiatique", name: "Buffet Du Thuyền & Asiatique", lat: 13.7042, lng: 100.5034, time: "17:00 - Tối", desc: "Lên du thuyền 5 sao sông Chao Phraya thưởng thức Buffet ngắm hoàng hôn. Khám phá chợ đêm Asiatique." }
          ]
        },
        {
          day: 5, title: "NGÀY 05: BANGKOK - HÀ NỘI", meals: "Sáng, Trưa", dateInfo: "Trở về Việt Nam",
          activities: [
            { id: "wat-yannawa", name: "Chùa Thuyền - Wat Yannawa", lat: 13.7171, lng: 100.5140, time: "Buổi sáng", desc: "Tham quan ngôi chùa kiến trúc hình con thuyền, nơi lưu giữ nhiều xá lợi nhất." },
            { id: "suvarnabhumi-return", name: "Sân bay Suvarnabhumi (Về VN)", lat: 13.6899, lng: 100.7500, time: "Trưa - Chiều", desc: "Khởi hành ra sân bay làm thủ tục chuyến bay về Nội Bài. Kết thúc hành trình." }
          ]
        }
      ]
    },
    info: {
      title: "Thông Tin Chi Tiết Lịch Trình",
      tableHeaders: ["Tháng", "Ngày KH", "Hàng Không", "Giá (VNĐ)", "Hành Lý"],
      flights: [
        { month: "07/2026", dates: "03, 04, 10", airline: "Vietravel Airlines", price: "12.290.000", baggage: "20kg" },
        { month: "07/2026", dates: "03, 04, 10", airline: "Vietjet Air", price: "12.290.000", baggage: "20kg" }
      ],
      childPrice: "Giá trẻ em: 02-11 tuổi (90%), Dưới 2 tuổi (30%).",
      acc1: { title: "Dịch Vụ Bao Gồm", items: ["Vé máy bay khứ hồi (07kg xách tay + 20kg ký gửi).", "Khách sạn 4-5* (2 khách/phòng, lẻ ghép 3).", "07 bữa ăn chính (1 bữa du thuyền, 1 bữa BBQ) + Ăn sáng buffet.", "Phí tham quan vào cửa 01 lần.", "Xe ô tô đưa đón theo chương trình.", "01 HDV đi từ VN + 01 HDV Thái Lan nhiệt tình.", "Bảo hiểm du lịch quốc tế trọn gói."] },
      acc2: { title: "Dịch Vụ Không Bao Gồm", items: ["Chi tiêu cá nhân, ngoài chương trình.", "Tiền tip HDV: 05 USD/ngày/khách (Bắt buộc).", "Thuế VAT.", "Phí Visa tái nhập khách quốc tịch nước ngoài.", "Phụ thu phòng đơn 80$.", "Phụ thu 25 USD/điểm nếu không tham gia các điểm mua sắm chỉ định."] },
      acc3: { title: "Điều Kiện Hủy Tour & Thanh Toán", text1: "Quy định thanh toán:", text2: "Cọc 50% tổng giá tour ngay sau khi đăng ký. Phần còn lại thanh toán trước 20 ngày khởi hành.", text3: "Điều kiện hủy tour (Tính theo ngày làm việc):", text4: "Sau khi đăng ký: Phạt 50% tiền cọc. Trước 20 ngày: Phạt 50%. Trước 7 ngày: Phạt 75%. Sau thời gian trên: Phạt 100%.", note: "* Công ty không nhận báo hủy qua điện thoại." },
      acc4: { title: "Lưu Ý Quan Trọng Khác", items: ["Hộ chiếu phải còn hạn trên 06 tháng.", "Không nhận khách mang thai từ 8 tháng trở lên.", "Chương trình và giờ bay có thể thay đổi.", "Khách từ 70 tuổi trở lên yêu cầu có giấy xác nhận sức khỏe.", "Công ty du lịch giữ quyền thay đổi lộ trình do thiên tai, sự cố để đảm bảo an toàn.", "TỪ CHỐI NHẬP CẢNH: Công ty từ chối không chịu trách nhiệm thanh toán chi phí phát sinh."] }
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} My Personal Travel. All rights reserved.`,
      note: "Lịch trình được thiết kế và tổng hợp cho mục đích tham khảo cá nhân."
    }
  },
  en: {
    header: {
      title: "Thailand Tour Program",
      subtitle: "Hanoi - Bangkok - Pattaya | 5 Days 4 Nights",
      brand: "My Travel Itinerary",
      slogan: "Discover the world one step at a time",
      updated: "Updated: 2026",
      langToggle: "Tiếng Việt"
    },
    map: {
      title: "Interactive Journey Map (Google Maps)",
      loading: "Loading Google Maps...",
      note: "* Click a point on the map to open Google Maps or the Android maps app",
      searchBtn: "🗺️ Open Google Maps",
      searchSuffix: "Thailand"
    },
    highlights: {
      title: "TOUR HIGHLIGHTS",
      items: [
        "Standard 4-5 star hotels.",
        "Boeing 747 airplane cafe in Bangkok.",
        "Unique Muang Boran architectural complex.",
        "5-star cruise buffet on the Chao Phraya River.",
        "Enjoy BBQ Buffet dinner."
      ]
    },
    itinerary: {
      title: "Detailed Itinerary",
      mealLabel: "Meals",
      googleLink: "Learn more about this place on Google ↗",
      days: [
        {
          day: 1, title: "DAY 01: HANOI - BANGKOK – PATTAYA – FLOATING MARKET", meals: "Lunch (Flight), Dinner", dateInfo: "Departure Journey",
          activities: [
            { id: "suvarnabhumi", name: "Suvarnabhumi Airport", lat: 13.6900, lng: 100.7501, time: "10:55 - 13:00", desc: "Arrive at Suvarnabhumi airport, complete immigration procedures. Transfer to Pattaya City." },
            { id: "floating-market", name: "Four Regions Floating Market", lat: 12.8683, lng: 100.9125, time: "Afternoon", desc: "Visit the famous Four Regions Floating Market. Explore zones representing Northern, Central, Southern, and Northeastern Thailand." },
            { id: "colosseum", name: "Colosseum Show & Massage", lat: 12.9066, lng: 100.8872, time: "Evening", desc: "Dinner at a restaurant. Enjoy the special Colosseum Show. Experience Thai Traditional Massage. Rest in Pattaya." }
          ]
        },
        {
          day: 2, title: "DAY 02: PATTAYA – CORAL ISLAND - MODERN LATEX – KHAO CHEE CHAN", meals: "Breakfast, Lunch, Dinner", dateInfo: "Explore Islands & Nature",
          activities: [
            { id: "coral-island", name: "Coral Island", lat: 12.9222, lng: 100.7850, time: "Morning", desc: "Take a speedboat to Coral Island. Free to swim or join optional games: parasailing, scuba diving. Return to mainland for lunch." },
            { id: "khao-chee-chan", name: "Khao Chee Chan & Tiger Center", lat: 12.7648, lng: 100.9561, time: "Afternoon", desc: "Visit Khao Chee Chan (Laser Buddha), Tiger Bone Center. Experience real shooting at the Royal Military shooting range." },
            { id: "modern-latex", name: "Modern Latex", lat: 12.9466, lng: 100.8950, time: "Afternoon", desc: "Royal Sleep Research Center. Learn how to prevent spinal diseases and improve sleep quality." },
            { id: "bbq-pattaya", name: "BBQ Buffet Pattaya", lat: 12.9350, lng: 100.8880, time: "Evening", desc: "BBQ dinner. Return to the hotel. Optional: Sexy Show or Kaan Show (Self-funded)." }
          ]
        },
        {
          day: 3, title: "DAY 03: PATTAYA – AGARWOOD – MUANG BORAN - BANGKOK", meals: "Breakfast, Lunch, Dinner", dateInfo: "Culture & Shopping",
          activities: [
            { id: "agarwood", name: "Agarwood Museum", lat: 12.9510, lng: 100.9000, time: "Morning", desc: "Check out. Visit the International Agarwood Museum, learn about health and feng shui." },
            { id: "muang-boran", name: "Muang Boran Ancient City", lat: 13.5393, lng: 100.6230, time: "Late Morning", desc: "Explore miniature Thailand with 115 recreated architectural structures. A hub of Thai culture and history. Lunch." },
            { id: "central-world", name: "Big C, Central World & Erawan Shrine", lat: 13.7460, lng: 100.5404, time: "Afternoon & Eve", desc: "Free shopping at Big C, Central World. Dinner. Pray at the sacred four-faced Erawan Shrine. Check in Bangkok hotel." }
          ]
        },
        {
          day: 4, title: "DAY 04: WAT ARUN - SNAKE FARM – CRUISE BUFFET", meals: "Breakfast, Lunch, Dinner", dateInfo: "Royal & River Experience",
          activities: [
            { id: "wat-arun", name: "Wat Arun & Chao Phraya River", lat: 13.7437, lng: 100.4889, time: "Morning", desc: "Visit the Temple of Dawn (Wat Arun). Cruise on the legendary Chao Phraya River." },
            { id: "snake-farm", name: "Snake Farm Research Center", lat: 13.7322, lng: 100.5323, time: "Late Morning", desc: "Enjoy snake circus, venom extraction. Learn about traditional snake medicine. Lunch at a local restaurant." },
            { id: "boeing-747", name: "Boeing 747 Cafe Bangkok", lat: 13.7291, lng: 100.7744, time: "Afternoon", desc: "Experience and enjoy unique coffee on an airplane at Boeing 747 Cafe Bangkok." },
            { id: "asiatique", name: "Cruise Buffet & Asiatique", lat: 13.7042, lng: 100.5034, time: "17:00 - Eve", desc: "Board a 5-star cruise on the Chao Phraya River, enjoy a Buffet and sunset. Explore Asiatique night market." }
          ]
        },
        {
          day: 5, title: "DAY 05: BANGKOK - HANOI", meals: "Breakfast, Lunch", dateInfo: "Return to Vietnam",
          activities: [
            { id: "wat-yannawa", name: "Wat Yannawa (Boat Temple)", lat: 13.7171, lng: 100.5140, time: "Morning", desc: "Visit the boat-shaped temple, home to numerous Buddhist relics." },
            { id: "suvarnabhumi-return", name: "Suvarnabhumi Airport (Return)", lat: 13.6899, lng: 100.7500, time: "Lunch - Aft", desc: "Transfer to Suvarnabhumi airport for the flight back to Hanoi. End of the journey." }
          ]
        }
      ]
    },
    info: {
      title: "Detailed Tour Information",
      tableHeaders: ["Month", "Departure Date", "Airlines", "Price (VND)", "Baggage"],
      flights: [
        { month: "07/2026", dates: "03, 04, 10", airline: "Vietravel Airlines", price: "12.290.000", baggage: "20kg" },
        { month: "07/2026", dates: "03, 04, 10", airline: "Vietjet Air", price: "12.290.000", baggage: "20kg" }
      ],
      childPrice: "Child rate: 02-11 years old (90%), Under 2 years old (30%).",
      acc1: { title: "Included Services", items: ["Round-trip air tickets (7kg carry-on + 20kg checked bag).", "4-5* Hotels (2 pax/room).", "07 main meals (1 cruise buffet, 1 BBQ) + Buffet breakfasts.", "1-time entrance fees to attractions.", "Air-conditioned tourist vehicles.", "01 Guide from VN + 01 enthusiastic Thai Guide.", "Comprehensive international travel insurance."] },
      acc2: { title: "Excluded Services", items: ["Personal expenses, outside the itinerary.", "Tour guide tipping: 05 USD/day/pax (Mandatory).", "VAT.", "Re-entry Visa fees for foreign passport holders.", "Single room supplement: $80.", "Surcharge of 25 USD/place if skipping designated shopping stops."] },
      acc3: { title: "Cancellation & Payment Policy", text1: "Payment Rules:", text2: "Deposit 50% upon registration. The rest must be paid 20 days prior to departure.", text3: "Cancellation Policy (Working days):", text4: "After registration: 50% of deposit. 20 days prior: 50%. 7 days prior: 75%. Later than above: 100% of tour value.", note: "* Cancellations are not accepted via phone." },
      acc4: { title: "Other Important Notes", items: ["Passport must be valid for at least 06 months.", "Not accepting pregnant women from 8 months for safety.", "Itinerary and flight times are subject to change.", "Guests over 70 must have a health certificate.", "The company reserves the right to change the route due to force majeure for safety.", "DENIED ENTRY: The company is not responsible for any costs incurred if denied entry by local authorities."] }
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} My Personal Travel. All rights reserved.`,
      note: "Itinerary designed and compiled for personal reference purposes."
    }
  }
};

export default function App() {
  const [lang, setLang] = useState('vi'); // Mặc định là Tiếng Việt
  const [activeActivityId, setActiveActivityId] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef(null);
  const markersGroupRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);

  const t = TRANSLATIONS[lang];
  const GOOGLE_MAPS_QUERY_BY_ACTIVITY_ID: Record<string, string> = {
    suvarnabhumi: 'Suvarnabhumi Airport Bangkok',
    'floating-market': 'Pattaya Floating Market',
    colosseum: 'Colosseum Show Pattaya',
    'coral-island': 'Koh Larn Pattaya',
    'khao-chee-chan': 'Khao Chi Chan Pattaya',
    'modern-latex': 'Modern Latex Pattaya',
    'bbq-pattaya': 'Pattaya BBQ Buffet',
    agarwood: '12.9510,100.9000',
    'muang-boran': 'Ancient City Muang Boran Samut Prakan',
    'central-world': 'CentralWorld Bangkok',
    'wat-arun': 'Wat Arun Bangkok',
    'snake-farm': 'Snake Farm Bangkok',
    'boeing-747': 'Boeing 747 Cafe Bangkok',
    asiatique: 'Asiatique The Riverfront Bangkok',
    'wat-yannawa': 'Wat Yannawa Bangkok',
    'suvarnabhumi-return': 'Suvarnabhumi Airport Bangkok'
  };

  const GOOGLE_SEARCH_QUERY_BY_ACTIVITY_ID: Record<string, string> = {
    'coral-island': 'Koh Larn Pattaya',
    'khao-chee-chan': 'Khao Chee Chan Pattaya',
    'modern-latex': 'Modern Latex Pattaya Thailand',
    agarwood: 'Agarwood Museum Pattaya Thailand',
  };

  const getPlaceQuery = (act: { id: string; name: string }) =>
    GOOGLE_MAPS_QUERY_BY_ACTIVITY_ID[act.id] ?? `${act.name} Thailand`;

  const getSearchQuery = (act: { id: string; name: string }) =>
    GOOGLE_SEARCH_QUERY_BY_ACTIVITY_ID[act.id] ?? act.name;

  const getGoogleMapsUrl = (query: string) => {
    if (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)) {
      return `intent://maps.google.com/maps?q=${encodeURIComponent(query)}#Intent;scheme=https;package=com.google.android.apps.maps;end`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const getGoogleSearchUrl = (act: { id: string; name: string }) =>
    `https://www.google.com/search?q=${encodeURIComponent(getSearchQuery(act))}`;

  useEffect(() => {
    // Load Leaflet CSS + JS via CDN
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement("link");
      link.id = 'leaflet-css';
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement("script");
      script.id = 'leaflet-js';
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapLoaded || !window.L || mapRef.current) return;

    const map = window.L.map('tour-map').setView([13.3, 100.7], 8);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapRef.current = map;
    markersGroupRef.current = window.L.layerGroup().addTo(map);
  }, [mapLoaded]);

  // Update markers when language changes or map loads
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    markersRef.current = {};

    const customIcon = window.L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    t.itinerary.days.forEach(day => {
      day.activities.forEach(act => {
        const marker = window.L.marker([act.lat, act.lng], { icon: customIcon })
          .addTo(markersGroupRef.current);

        const googleMapsUrl = getGoogleMapsUrl(getPlaceQuery(act));
        const popupContent = `
          <div style="font-family:sans-serif;min-width:200px;max-width:260px">
            <h3 style="font-weight:bold;font-size:15px;color:#1d4ed8;margin:0 0 4px">${act.name}</h3>
            <p style="font-size:12px;margin:0 0 10px;color:#4b5563;line-height:1.4">${act.desc}</p>
            <a href="${googleMapsUrl}" target="_blank" rel="noreferrer"
               style="display:inline-flex;align-items:center;gap:4px;background:#1d4ed8;color:white;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600">
              🗺️ ${t.map.searchBtn}
            </a>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 280 });
        marker.on('click', () => handleActivityClick(act.id, false));
        markersRef.current[act.id] = marker;
      });
    });

    if (activeActivityId && markersRef.current[activeActivityId]) {
      markersRef.current[activeActivityId].openPopup();
    }
  }, [lang, mapLoaded]);

  const handleActivityClick = (actId, scrollToCard = true) => {
    setActiveActivityId(actId);

    let currentDayActivities = [];
    let act = null;

    for (const day of t.itinerary.days) {
      const actIdx = day.activities.findIndex(a => a.id === actId);
      if (actIdx !== -1) {
        currentDayActivities = day.activities.slice(0, actIdx + 1);
        act = day.activities[actIdx];
        break;
      }
    }

    if (act && mapRef.current && markersRef.current[actId]) {
      if (polylineRef.current) {
        mapRef.current.removeLayer(polylineRef.current);
      }

      const latlngs = currentDayActivities.map(a => [a.lat, a.lng]);

      if (latlngs.length > 1) {
        polylineRef.current = window.L.polyline(latlngs, {
          color: '#ef4444',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10'
        }).addTo(mapRef.current);
        mapRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [50, 50], maxZoom: 13 });
      } else {
        mapRef.current.setView([act.lat, act.lng], 13, { animate: true });
      }

      markersRef.current[actId].openPopup();
    }

    // Smooth scroll to itinerary card (only when triggered from the itinerary, not from the map)
    if (scrollToCard) {
      const el = document.getElementById(`activity-${actId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const AccordionSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm bg-white">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-5 py-4 bg-gray-50 flex justify-between items-center font-bold text-gray-800 hover:bg-gray-100 transition"
        >
          {title}
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isOpen && <div className="p-5 text-gray-700 text-sm leading-relaxed">{children}</div>}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header & Tour Info */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide">{t.header.title}</h1>
                <button 
                  onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm transition-all border border-white/40"
                >
                  <Globe size={14} />
                  {t.header.langToggle}
                </button>
              </div>
              <p className="text-blue-200 text-sm md:text-base mt-1">{t.header.subtitle}</p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="font-bold text-lg">{t.header.brand}</p>
              <p className="text-xs text-blue-200">{t.header.slogan}</p>
              <p className="text-xs text-blue-200">{t.header.updated}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Top Column: Map (Sticky) */}
        <div className="lg:col-span-5 h-fit lg:sticky lg:top-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
              <Navigation className="text-blue-600" size={20} />
              <h2 className="font-bold text-blue-900">{t.map.title}</h2>
            </div>
            
            <div id="tour-map" className="w-full h-[400px] lg:h-[550px] bg-gray-200 relative z-0">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                  {t.map.loading}
                </div>
              )}
            </div>
            
            <div className="p-3 text-xs text-gray-500 text-center bg-gray-50 italic">
              {t.map.note}
            </div>
          </div>

          {/* Quick Highlights */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-5 border border-gray-200">
             <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-3">{t.highlights.title}</h3>
             <ul className="space-y-2 text-sm text-gray-600">
               {t.highlights.items.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-2">
                   <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={16}/> 
                   {item}
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Right/Bottom Column: Itinerary & Info */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-lg p-1 border border-gray-200 mb-6">
             <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center gap-2">
               <MapPin size={24} />
               <h2 className="text-xl font-bold">{t.itinerary.title}</h2>
             </div>
             
             <div className="p-4 md:p-6 space-y-8">
                {t.itinerary.days.map((day) => (
                  <div key={day.day} className="relative">
                    {/* Day Header */}
                    <div className="flex flex-wrap items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-lg text-blue-900 w-full md:w-auto">{day.title}</h3>
                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-2 md:mt-0">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {day.dateInfo}</span>
                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          <Clock size={14}/> {t.itinerary.mealLabel}: {day.meals}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Container */}
                    <div className="ml-2 md:ml-4 border-l-2 border-blue-200 pl-4 space-y-6">
                      {day.activities.map((act) => (
                        <div 
                          key={act.id} 
                          id={`activity-${act.id}`}
                          onClick={() => handleActivityClick(act.id)}
                          className={`relative cursor-pointer transition-all duration-300 p-4 rounded-xl border-2 ${
                            activeActivityId === act.id 
                            ? 'bg-blue-50 border-blue-500 shadow-md scale-[1.02]' 
                            : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                        >
                          <div className={`absolute -left-[23px] top-5 w-3 h-3 rounded-full border-2 ${activeActivityId === act.id ? 'bg-blue-600 border-white ring-4 ring-blue-200' : 'bg-white border-blue-300'}`}></div>
                          
                          <div className="flex justify-between items-start mb-2">
                            <h4 className={`font-bold text-base md:text-lg ${activeActivityId === act.id ? 'text-blue-700' : 'text-gray-800'}`}>
                              {act.name}
                            </h4>
                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                              {act.time}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{act.desc}</p>
                          
                          {activeActivityId === act.id && (
                             <div className="mt-3">
                               <a 
                                href={getGoogleSearchUrl(act)}
                                target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-full font-medium transition"
                                onClick={(e) => e.stopPropagation()}
                               >
                                 {t.itinerary.googleLink}
                               </a>
                             </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Full Information Section */}
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4 border-l-4 border-blue-600 pl-3">{t.info.title}</h2>
             
             {/* Flight & Price Table */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                      <tr>
                        {t.info.tableHeaders.map((h, i) => <th key={i} className="px-4 py-3">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {t.info.flights.map((f, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{f.month}</td>
                          <td className="px-4 py-3 font-bold text-blue-600">{f.dates}</td>
                          <td className="px-4 py-3">{f.airline}</td>
                          <td className="px-4 py-3 font-bold text-red-600">{f.price}</td>
                          <td className="px-4 py-3">{f.baggage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-orange-50 p-3 text-sm text-orange-800 flex items-start gap-2 border-t border-orange-100">
                  <Info className="shrink-0 mt-0.5" size={16} />
                  <p><strong>{t.info.childPrice}</strong></p>
                </div>
             </div>

             <AccordionSection title={t.info.acc1.title} defaultOpen={true}>
               <ul className="space-y-2 list-none">
                 {t.info.acc1.items.map((item, i) => (
                    <li key={i} className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0" size={18}/> {item}</li>
                 ))}
               </ul>
             </AccordionSection>

             <AccordionSection title={t.info.acc2.title}>
               <ul className="space-y-2 list-none">
                 {t.info.acc2.items.map((item, i) => (
                   <li key={i} className="flex gap-2"><XCircle className="text-red-500 shrink-0" size={18}/> {item}</li>
                 ))}
               </ul>
             </AccordionSection>

             <AccordionSection title={t.info.acc3.title}>
               <div className="space-y-4">
                 <div>
                   <h4 className="font-bold text-gray-800">{t.info.acc3.text1}</h4>
                   <p>{t.info.acc3.text2}</p>
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-800">{t.info.acc3.text3}</h4>
                   <p className="mt-1">{t.info.acc3.text4}</p>
                 </div>
                 <p className="text-xs text-gray-500 italic mt-2">{t.info.acc3.note}</p>
               </div>
             </AccordionSection>

             <AccordionSection title={t.info.acc4.title}>
               <ul className="space-y-2 list-disc ml-5 text-sm">
                 {t.info.acc4.items.map((item, i) => (
                    <li key={i} className={i === t.info.acc4.items.length - 1 ? "font-bold text-red-600" : ""}>{item}</li>
                 ))}
               </ul>
             </AccordionSection>

          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-6 text-center mt-8 text-sm">
        <p>{t.footer.copyright}</p>
        <p className="text-xs text-gray-500 mt-1">{t.footer.note}</p>
      </footer>
    </div>
  );
}