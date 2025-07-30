import { useState, useRef, useEffect } from "react";
import { Phone } from "lucide-react";

interface EmergencyContact {
  name: string;
  number: string;
  isWhatsApp: boolean;
}

export default function EmergencyButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Daftar nomor telepon darurat
  const emergencyContacts: EmergencyContact[] = [
    {
      name: "Anang Yulianto (Kasun Kemiri) Ambulance",
      number: "+6281936979836",
      isWhatsApp: true,
    },
    {
      name: "Ade Sunjaya (nomer 1) Ambulance",
      number: "+6282232511173",
      isWhatsApp: true,
    },
    {
      name: "Ade Sunjaya (nomer 2) Ambulance",
      number: "+6285161730965",
      isWhatsApp: true,
    },
    {
      name: "Pak Kris RT Ambulance",
      number: "+6285755122815",
      isWhatsApp: true,
    },
    {
      name: "Hendro RT Ambulance",
      number: "+6281230092227",
      isWhatsApp: true,
    },
    {
      name: "Supar Sapu Ambulance",
      number: "+6282230635067",
      isWhatsApp: true,
    },
    {
      name: "Emergency Call dari Damkar",
      number: "911",
      isWhatsApp: false,
    },
    {
      name: "Pos Pemadam",
      number: "02155550456",
      isWhatsApp: false,
    },
    {
      name: "PLN",
      number: "123",
      isWhatsApp: false,
    },
    {
      name: "Babinsa",
      number: "+6285234500802",
      isWhatsApp: true,
    },
  ];

  // Fungsi untuk menangani klik pada item daftar
  const handleContactClick = (contact: EmergencyContact) => {
    if (contact.isWhatsApp) {
      // Membuka WhatsApp dengan nomor yang sesuai
      window.open(`https://wa.me/${contact.number}`, "_blank");
    } else {
      // Untuk nomor non-WhatsApp, buka dialer telepon
      window.open(`tel:${contact.number}`, "_self");
    }
    setIsDropdownOpen(false);
  };

  // Menutup dropdown ketika mengklik di luar area dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle tooltip
  const handleMouseEnter = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 0);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowTooltip(false);
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOutDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }

        .animate-fade-out-down {
          animation: fadeOutDown 0.3s ease-in forwards;
        }

        .animate-pulse-hover:hover {
          animation: pulse 0.6s ease-in-out infinite;
        }

        .animate-tooltip {
          animation: tooltipFadeIn 0.2s ease-out forwards;
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50" ref={dropdownRef}>
        {/* Tooltip */}
        {showTooltip && !isDropdownOpen && (
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-tooltip">
            Nomor Darurat
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
          </div>
        )}

        {/* Emergency Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-110 animate-pulse-hover"
          aria-label="Nomor Darurat"
        >
          <Phone className="h-6 w-6" />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute bottom-full right-0 mb-3 w-80 bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in-up border border-gray-200">
            {/* Header */}
            <div className="p-4 bg-red-600 text-white font-bold text-center">
              <Phone className="inline-block mr-2 h-5 w-5" />
              Nomor Darurat
            </div>

            {/* Contact List */}
            <div className="max-h-80 overflow-y-auto">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    onClick={() => handleContactClick(contact)}
                    className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:bg-red-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {contact.number}
                        </div>
                      </div>
                      <div className="ml-3">
                        {contact.isWhatsApp ? (
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            WhatsApp
                          </div>
                        ) : (
                          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            Call
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Klik nomor untuk menghubungi langsung
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
