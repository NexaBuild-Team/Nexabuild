import React, { useState, useEffect } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface AdminPropertyRecord {
  id: string;
  title: string;
  location: string;
  price: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  owner: string;
  details: string;
  imageUrl?: string;
}

export interface AdminPropertyMetrics {
  totalCount?: number;
  pendingCount?: number;
  approvedCount?: number;
  rejectedCount?: number;
}

export interface AdminPropertyManagementPageData {
  metrics?: AdminPropertyMetrics;
  properties?: AdminPropertyRecord[];
}

export interface AdminPropertyManagementProps {
  data?: AdminPropertyManagementPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onApproveProperty?: (id: string) => void;
  onRejectProperty?: (id: string) => void;
  onAddProperty?: (property: Partial<AdminPropertyRecord>) => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultProperties: AdminPropertyRecord[] = [
  {
    id: '1',
    title: 'Skyline Residences Tower A',
    location: 'Colombo 03',
    price: 'LKR 45.0M',
    type: 'RESIDENTIAL',
    status: 'PENDING',
    owner: 'James Harrington',
    details: '3 Beds • 2 Baths • 1,500 sqft',
    imageUrl: '/property_card_1.png'
  },
  {
    id: '2',
    title: 'Metro Business Hub',
    location: 'Colombo 02',
    price: 'LKR 125.0M',
    type: 'COMMERCIAL',
    status: 'APPROVED',
    owner: 'Sarah Jenkins',
    details: '10 Offices • 4,500 sqft',
    imageUrl: '/property_card_2.png'
  },
  {
    id: '3',
    title: 'Greenfield Estate Land',
    location: 'Gampaha',
    price: 'LKR 12.0M',
    type: 'LAND',
    status: 'PENDING',
    owner: 'Priyantha Perera',
    details: '20 Perches Land',
    imageUrl: '/property_card_3.png'
  },
  {
    id: '4',
    title: 'Coral Bay Beach Villa Land',
    location: 'Galle',
    price: 'LKR 28.5M',
    type: 'LAND',
    status: 'APPROVED',
    owner: 'Nimal Perera',
    details: '15 Perches Beachfront',
    imageUrl: '/property_card_4.png'
  },
  {
    id: '5',
    title: 'North Park Industrial Warehouse',
    location: 'Ja-Ela',
    price: 'LKR 85.0M',
    type: 'COMMERCIAL',
    status: 'REJECTED',
    owner: 'Devinda Goonewardene',
    details: 'Industrial • 6,000 sqft',
    imageUrl: '/hero_property.png'
  },
  {
    id: '6',
    title: 'Merchant Quarter Apartment',
    location: 'Kandy',
    price: 'LKR 16.5M',
    type: 'RESIDENTIAL',
    status: 'APPROVED',
    owner: 'Abdul Cader',
    details: '2 Beds • 2 Baths • 1,100 sqft',
    imageUrl: '/property_card_1.png'
  }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function AdminPropertyManagement({
  data = null,
  isLoading = false,
  error = null,
  onApproveProperty,
  onRejectProperty,
  onAddProperty
}: AdminPropertyManagementProps) {
  const [propertiesState, setPropertiesState] = useState<AdminPropertyRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newType, setNewType] = useState<'RESIDENTIAL' | 'COMMERCIAL' | 'LAND'>('RESIDENTIAL');
  const [newOwner, setNewOwner] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const properties = data?.properties !== undefined 
    ? data.properties 
    : (propertiesState.length > 0 ? propertiesState : defaultProperties);

  const metrics = data?.metrics;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleApprove = (id: string) => {
    if (onApproveProperty) {
      onApproveProperty(id);
    } else {
      setPropertiesState(prev => {
        const source = prev.length > 0 ? prev : defaultProperties;
        return source.map((p) => (p.id === id ? { ...p, status: 'APPROVED' } : p));
      });
    }
  };

  const handleReject = (id: string) => {
    if (onRejectProperty) {
      onRejectProperty(id);
    } else {
      setPropertiesState(prev => {
        const source = prev.length > 0 ? prev : defaultProperties;
        return source.map((p) => (p.id === id ? { ...p, status: 'REJECTED' } : p));
      });
    }
  };

  const totalCount = metrics?.totalCount ?? properties.length;
  const pendingCount = metrics?.pendingCount ?? properties.filter((p) => p.status === 'PENDING').length;
  const approvedCount = metrics?.approvedCount ?? properties.filter((p) => p.status === 'APPROVED').length;
  const rejectedCount = metrics?.rejectedCount ?? properties.filter((p) => p.status === 'REJECTED').length;

  const filteredProperties = properties.filter((p) => {
    const matchesTab = activeTab === 'ALL' || p.status === activeTab;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation || !newPrice || !newOwner) return;

    const newProp: AdminPropertyRecord = {
      id: String(properties.length + 1),
      title: newTitle,
      location: newLocation,
      price: `LKR ${parseFloat(newPrice).toFixed(1)}M`,
      type: newType,
      status: 'PENDING',
      owner: newOwner,
      details: newType === 'LAND' ? '20 Perches Land' : '3 Beds • 2 Baths • 1,500 sqft',
      imageUrl: '/hero_property.png'
    };

    if (onAddProperty) {
      onAddProperty(newProp);
    } else {
      setPropertiesState(prev => [newProp, ...(prev.length > 0 ? prev : defaultProperties)]);
    }

    setNewTitle('');
    setNewLocation('');
    setNewPrice('');
    setNewOwner('');
    setShowAddPropertyModal(false);
  };

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 lg:p-8 space-y-8 bg-gradient-to-r from-[#e6e0d4] to-[#fcf9f8]">
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        
        {/* Global Error Banner */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src="/svg/info.svg" alt="Error" className="size-5 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
            <button onClick={() => window.location.reload()} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold">
              Retry
            </button>
          </div>
        )}

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1d1d1d] tracking-tight">Property Moderation & Management</h1>
            <p className="text-xs text-gray-500 mt-1">Review, approve, or reject incoming property and land listings</p>
          </div>
          <button
            onClick={() => setShowAddPropertyModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#be5d3f] hover:bg-[#be5d3f]/90 px-5 py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer"
          >
            <span className="text-base font-bold">+</span>
            <span>Add Property</span>
          </button>
        </div>

        {/* Stats Counter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-12 rounded-xl bg-[#345b79]/10 flex items-center justify-center text-[#345b79] shrink-0">
              <img src="/svg/home.svg" alt="" className="size-6" />
            </div>
            <div className="leading-tight">
              <h4 className="text-2xl font-extrabold text-[#1d1d1d]">{totalCount}</h4>
              <span className="text-xs text-gray-500 font-bold">Total Listings</span>
            </div>
          </div>

          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
              <img src="/svg/clock.svg" alt="" className="size-6" />
            </div>
            <div className="leading-tight">
              <h4 className="text-2xl font-extrabold text-[#be5d3f]">{pendingCount}</h4>
              <span className="text-xs text-gray-500 font-bold">Pending Review</span>
            </div>
          </div>

          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <img src="/svg/checkMark.svg" alt="" className="size-6 filter drop-shadow" />
            </div>
            <div className="leading-tight">
              <h4 className="text-2xl font-extrabold text-emerald-700">{approvedCount}</h4>
              <span className="text-xs text-gray-500 font-bold">Approved</span>
            </div>
          </div>

          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-12 rounded-xl bg-red-50 flex items-center justify-center text-red-700 shrink-0">
              <img src="/svg/info.svg" alt="" className="size-6" />
            </div>
            <div className="leading-tight">
              <h4 className="text-2xl font-extrabold text-red-600">{rejectedCount}</h4>
              <span className="text-xs text-gray-500 font-bold">Rejected</span>
            </div>
          </div>
        </div>

        {/* Moderation Toolbar Options */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          {/* Status Filter Tabs */}
          <div className="inline-flex rounded-full bg-white border border-[#ccb7a3]/20 p-1 shadow-sm self-start">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#345b79] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#1d1d1d]'
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-[#1d1d1d] placeholder-gray-400 border border-[#ccb7a3]/40 focus:outline-none focus:border-[#345b79] shadow-sm"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <img src="/svg/eye.svg" alt="" className="size-4 opacity-50" />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {paginatedProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white border border-[#ccb7a3]/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Header Image Canvas Box */}
              <div className="h-48 bg-gray-100 border-b border-gray-100 relative overflow-hidden group">
                <img
                  src={prop.imageUrl || '/hero_property.png'}
                  alt={prop.title}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Type Badge */}
                <div className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold text-gray-700 tracking-wider uppercase">
                  {prop.type}
                </div>

                {/* Status Badge */}
                <div
                  className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[9px] font-bold tracking-wider uppercase ${
                    prop.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : prop.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {prop.status}
                </div>
              </div>

              {/* Content Panel */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#1d1d1d] line-clamp-1">{prop.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                    <img src="/svg/location-pin-icon.svg" alt="" className="size-3.5" />
                    <span>{prop.location}</span>
                  </div>
                </div>

                {/* Price & Details */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Owner</span>
                    <span className="font-bold text-[#1d1d1d]">{prop.owner}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Price</span>
                    <span className="font-extrabold text-[#345b79] text-sm">{prop.price}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 font-bold bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {prop.details}
                </div>

                {/* Moderation Controls */}
                {prop.status === 'PENDING' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleReject(prop.id)}
                      className="flex-1 rounded-xl border border-red-200 text-red-600 py-2 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(prop.id)}
                      className="flex-1 rounded-xl bg-emerald-600 text-white py-2 text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls Bar */}
        <div className="p-4 bg-white border border-[#ccb7a3]/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-500 shadow-sm w-full">
          <span className="text-gray-400">
            Showing {filteredProperties.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredProperties.length)} of {filteredProperties.length} properties
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-colors ${
                    currentPage === page ? 'bg-[#345b79] text-white' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
            <h4 className="text-lg font-bold text-[#1d1d1d]">Submit Listing</h4>
            <p className="text-xs text-gray-400 mb-5">Register a new property moderation request manually.</p>

            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-[#6b879c] uppercase tracking-wider mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Lagoon Villa"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-[#1d1d1d] outline-none focus:border-[#345b79]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#6b879c] uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Negombo"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-[#1d1d1d] outline-none focus:border-[#345b79]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-[#6b879c] uppercase tracking-wider mb-1">Price (M LKR)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 24.5"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-[#1d1d1d] outline-none focus:border-[#345b79]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#6b879c] uppercase tracking-wider mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-[#1d1d1d] outline-none cursor-pointer"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="LAND">Land</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-[#6b879c] uppercase tracking-wider mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ruwan Silva"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-[#1d1d1d] outline-none focus:border-[#345b79]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddPropertyModal(false)} className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#345b79] text-white rounded-full text-xs font-bold shadow-sm cursor-pointer">
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
