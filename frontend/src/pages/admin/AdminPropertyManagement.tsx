import { useState, useEffect } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  status: "PENDING" | "APPROVED" | "REJECTED";
  owner: string;
  details: string;
}

const initialProperties: Property[] = [
  {
    id: "1",
    title: "Skyline Residences Tower A",
    location: "Colombo 03",
    price: "LKR 45.0M",
    type: "RESIDENTIAL",
    status: "PENDING",
    owner: "James Harrington",
    details: "3 Beds • 2 Baths • 1,500 sqft",
  },
  {
    id: "2",
    title: "Metro Business Hub",
    location: "Colombo 02",
    price: "LKR 125.0M",
    type: "COMMERCIAL",
    status: "APPROVED",
    owner: "Sarah Jenkins",
    details: "10 Offices • 4,500 sqft",
  },
  {
    id: "3",
    title: "Greenfield Estate Land",
    location: "Gampaha",
    price: "LKR 12.0M",
    type: "LAND",
    status: "PENDING",
    owner: "Priyantha Perera",
    details: "20 Perches Land",
  },
  {
    id: "4",
    title: "Coral Bay Beach Villa Land",
    location: "Galle",
    price: "LKR 28.5M",
    type: "LAND",
    status: "APPROVED",
    owner: "Nimal Perera",
    details: "15 Perches Beachfront",
  },
  {
    id: "5",
    title: "North Park Industrial Warehouse",
    location: "Ja-Ela",
    price: "LKR 85.0M",
    type: "COMMERCIAL",
    status: "REJECTED",
    owner: "Devinda Goonewardene",
    details: "Industrial • 6,000 sqft",
  },
  {
    id: "6",
    title: "Merchant Quarter Apartment",
    location: "Kandy",
    price: "LKR 16.5M",
    type: "RESIDENTIAL",
    status: "APPROVED",
    owner: "Abdul Cader",
    details: "2 Beds • 2 Baths • 1,100 sqft",
  },
];

export default function AdminPropertyManagement() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [activeTab, setActiveTab] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newType, setNewType] = useState<"RESIDENTIAL" | "COMMERCIAL" | "LAND">(
    "RESIDENTIAL",
  );
  const [newOwner, setNewOwner] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Handle Approve
  const handleApprove = (id: string) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, status: "APPROVED" } : p)),
    );
  };

  // Handle Reject
  const handleReject = (id: string) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, status: "REJECTED" } : p)),
    );
  };

  // Count helper
  const totalCount = properties.length;
  const pendingCount = properties.filter((p) => p.status === "PENDING").length;
  const approvedCount = properties.filter(
    (p) => p.status === "APPROVED",
  ).length;
  const rejectedCount = properties.filter(
    (p) => p.status === "REJECTED",
  ).length;

  // Filter listings
  const filteredProperties = properties.filter((p) => {
    const matchesTab = activeTab === "ALL" || p.status === activeTab;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation || !newPrice || !newOwner) return;

    const newProp: Property = {
      id: String(properties.length + 1),
      title: newTitle,
      location: newLocation,
      price: `LKR ${parseFloat(newPrice).toFixed(1)}M`,
      type: newType,
      status: "PENDING",
      owner: newOwner,
      details:
        newType === "LAND"
          ? "20 Perches Land"
          : "3 Beds • 2 Baths • 1,500 sqft",
    };

    setProperties([newProp, ...properties]);
    setNewTitle("");
    setNewLocation("");
    setNewPrice("");
    setNewOwner("");
    setShowAddPropertyModal(false);
  };

  return (
    <div className="h-full overflow-y-auto p-[20px] md:p-[32px] space-y-[32px] bg-[#e6e0d4]">
      {/* Stats Counter Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[25px] shadow-sm flex items-center gap-[20px]">
          <div className="size-[48px] rounded-[12px] bg-[#345b79]/10 flex items-center justify-center text-[#345b79] shrink-0">
            <svg
              className="size-[24px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <h4 className="text-[24px] font-extrabold text-[#1d1d1d]">
              {totalCount}
            </h4>
            <span className="text-[12px] text-gray-500 font-bold">
              Total Listings
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[25px] shadow-sm flex items-center gap-[20px]">
          <div className="size-[48px] rounded-[12px] bg-[#be5d3f]/10 flex items-center justify-center text-[#be5d3f] shrink-0">
            <svg
              className="size-[24px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <h4 className="text-[24px] font-extrabold text-[#be5d3f]">
              {pendingCount}
            </h4>
            <span className="text-[12px] text-gray-500 font-bold">
              Pending Review
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[25px] shadow-sm flex items-center gap-[20px]">
          <div className="size-[48px] rounded-[12px] bg-[#495d38]/10 flex items-center justify-center text-[#495d38] shrink-0">
            <svg
              className="size-[24px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <h4 className="text-[24px] font-extrabold text-[#495d38]">
              {approvedCount}
            </h4>
            <span className="text-[12px] text-gray-500 font-bold">
              Approved
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[25px] shadow-sm flex items-center gap-[20px]">
          <div className="size-[48px] rounded-[12px] bg-[#be5d3f]/15 flex items-center justify-center text-[#be5d3f] shrink-0">
            <svg
              className="size-[24px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <h4 className="text-[24px] font-extrabold text-red-600">
              {rejectedCount}
            </h4>
            <span className="text-[12px] text-gray-500 font-bold">
              Rejected
            </span>
          </div>
        </div>
      </div>

      {/* Moderation Toolbar Options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[20px]">
        {/* Status Filter Tabs */}
        <div className="inline-flex rounded-[9999px] bg-white border border-[#ccb7a3]/20 p-[4px] shadow-sm">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-[9999px] px-[20px] py-[8px] text-[13px] font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#345b79] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#1d1d1d]"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex gap-2"> 
          <div className="flex items-center self-end gap-[12px] self-start md:self-auto w-full md:w-auto">
            <div className="relative flex-1 md:w-[280px]">
              <input
                type="text"
                placeholder="Search by title, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[8px] bg-white py-[10px] pl-[40px] pr-[16px] text-[13px] font-semibold text-[#1d1d1d] placeholder-gray-400 border border-[#ccb7a3]/40 focus:outline-none focus:ring-1 focus:ring-[#345b79]/30 shadow-sm"
              />
              <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  className="size-[16px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddPropertyModal(true)}
            className="flex self-end items-center gap-[8px] rounded-[8px] bg-[#be5d3f] px-[24px] py-[12px] text-[13px] font-bold text-white hover:bg-[#be5d3f]/90 shadow-sm self-start sm:self-auto"
          >
            <svg
              className="size-[16px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Property
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
        {paginatedProperties.map((prop) => (
          <div
            key={prop.id}
            className="bg-white border border-[#ccb7a3]/20 rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Header image canvas box */}
            <div className="h-[200px] bg-[#ccb7a3]/30 border-b border-[#ccb7a3]/20 relative flex items-center justify-center text-[#1d1d1d]/60 font-extrabold text-[12px]">
              {/* Type Badge */}
              <div className="absolute left-[16px] top-[16px] rounded-[9999px] bg-white/90 backdrop-blur-[2px] px-[12px] py-[4px] text-[9px] font-bold text-gray-700 tracking-wider">
                {prop.type}
              </div>

              {/* Status Badge */}
              <div
                className={`absolute right-[16px] top-[16px] rounded-[9999px] px-[12px] py-[4px] text-[9px] font-bold tracking-wider ${
                  prop.status === "APPROVED"
                    ? "bg-[#495d38]/10 text-[#495d38]"
                    : prop.status === "REJECTED"
                      ? "bg-[#be5d3f]/20 text-[#be5d3f]"
                      : "bg-[#be5d3f]/10 text-[#be5d3f]"
                }`}
              >
                {prop.status}
              </div>

              <div className="flex flex-col items-center gap-[6px]">
                <svg
                  className="size-[32px] text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Image Placeholder</span>
              </div>
            </div>

            {/* Content panel */}
            <div className="p-[20px] space-y-[16px]">
              <div className="space-y-[4px]">
                <h4 className="text-[16px] font-extrabold text-[#1d1d1d] line-clamp-1">
                  {prop.title}
                </h4>
                <div className="flex items-center gap-[4px] text-[12px] text-gray-500 font-semibold">
                  <svg
                    className="size-[12px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{prop.location}</span>
                </div>
              </div>

              {/* Price & details */}
              <div className="flex items-center justify-between pt-[12px] border-t border-gray-50 text-[12px]">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">
                    Owner
                  </span>
                  <span className="font-bold text-[#1d1d1d]">{prop.owner}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">
                    Price
                  </span>
                  <span className="font-extrabold text-[#345b79] text-[14px]">
                    {prop.price}
                  </span>
                </div>
              </div>

              <div className="text-[12px] text-gray-500 font-bold bg-[#ccb7a3]/10 p-[8px] rounded-[6px]">
                {prop.details}
              </div>

              {/* Moderation Controls */}
              {prop.status === "PENDING" && (
                <div className="flex gap-[12px] pt-[8px]">
                  <button
                    onClick={() => handleReject(prop.id)}
                    className="flex-1 rounded-[6px] border border-[#be5d3f]/40 text-[#be5d3f] py-[8px] text-[12px] font-bold hover:bg-[#be5d3f]/10 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(prop.id)}
                    className="flex-1 rounded-[6px] bg-[#495d38] text-white py-[8px] text-[12px] font-bold hover:bg-[#495d38]/90 transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-[16px] bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[16px] shadow-sm select-none">
          <div className="text-[13px] font-semibold text-gray-500">
            Showing{" "}
            <span className="font-bold text-[#1d1d1d]">
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredProperties.length,
              )}
            </span>{" "}
            to{" "}
            <span className="font-bold text-[#1d1d1d]">
              {Math.min(currentPage * itemsPerPage, filteredProperties.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#1d1d1d]">
              {filteredProperties.length}
            </span>{" "}
            properties
          </div>
          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] text-[12px] font-bold tracking-[0.6px] transition-all border ${
                currentPage === 1
                  ? "border-[#ccb7a3]/10 bg-[#ccb7a3]/5 text-[#ccb7a3]/50 cursor-not-allowed"
                  : "border-[#ccb7a3]/40 bg-white text-[#345b79] hover:bg-[#345b79]/5"
              }`}
            >
              <svg
                className="size-[14px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-[4px]">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-[36px] flex items-center justify-center rounded-[8px] text-[12px] font-bold transition-all border ${
                      currentPage === pageNum
                        ? "bg-[#345b79] text-white border-[#345b79] shadow-sm"
                        : "border-[#ccb7a3]/40 bg-white text-[#1d1d1d] hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] text-[12px] font-bold tracking-[0.6px] transition-all border ${
                currentPage === totalPages
                  ? "border-[#ccb7a3]/10 bg-[#ccb7a3]/5 text-[#ccb7a3]/50 cursor-not-allowed"
                  : "border-[#ccb7a3]/40 bg-white text-[#345b79] hover:bg-[#345b79]/5"
              }`}
            >
              Next
              <svg
                className="size-[14px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px] backdrop-blur-[2px]">
          <div className="w-full max-w-[420px] rounded-[12px] bg-white p-[24px] shadow-lg border border-[#ccb7a3]/30">
            <h4 className="text-[18px] font-extrabold text-[#1d1d1d] mb-[4px]">
              Submit Listing
            </h4>
            <p className="text-[12px] text-gray-400 mb-[20px] font-semibold">
              Register a new property moderation request manually.
            </p>

            <form onSubmit={handleAddProperty} className="space-y-[16px]">
              <div>
                <label className="block text-[11px] font-bold text-[#6b879c] uppercase tracking-wider mb-[6px]">
                  Property Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Lagoon Villa"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-[8px] border border-[#ccb7a3]/40 px-[16px] py-[10px] text-[13px] font-semibold text-[#1d1d1d] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <label className="block text-[11px] font-bold text-[#6b879c] uppercase tracking-wider mb-[6px]">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Negombo"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-[8px] border border-[#ccb7a3]/40 px-[16px] py-[10px] text-[13px] font-semibold text-[#1d1d1d] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6b879c] uppercase tracking-wider mb-[6px]">
                    Price (M LKR)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 24.5"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full rounded-[8px] border border-[#ccb7a3]/40 px-[16px] py-[10px] text-[13px] font-semibold text-[#1d1d1d] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <label className="block text-[11px] font-bold text-[#6b879c] uppercase tracking-wider mb-[6px]">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-[8px] border border-[#ccb7a3]/40 px-[16px] py-[10px] text-[13px] font-bold text-[#1d1d1d] focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="LAND">Land</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6b879c] uppercase tracking-wider mb-[6px]">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ruwan Silva"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full rounded-[8px] border border-[#ccb7a3]/40 px-[16px] py-[10px] text-[13px] font-semibold text-[#1d1d1d] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-[12px] pt-[8px]">
                <button
                  type="button"
                  onClick={() => setShowAddPropertyModal(false)}
                  className="px-[16px] py-[10px] border border-[#ccb7a3]/40 rounded-[8px] text-[13px] font-bold hover:bg-gray-50 text-[#1d1d1d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-[20px] py-[10px] bg-[#345b79] text-white rounded-[8px] text-[13px] font-bold hover:bg-[#345b79]/90 shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
