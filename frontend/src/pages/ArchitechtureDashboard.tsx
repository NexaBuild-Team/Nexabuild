import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

// ─── Local Saved Image Assets ────────────────────────────────────────────────
const imgZenithResidence = "/property_card_1.png";
const imgSkylineTower = "/property_card_2.png";
const imgPalmCourt = "/property_card_3.png";
const imgMostViewed = "/hero_property.png";
const imgBlueprint = "/property_card_4.png";
const imgBlueprint1 = "/property_card_1.png";

const imgLivingRoom = "/property_card_1.png";
const imgKitchen = "/property_card_2.png";
const imgMasterSuite = "/property_card_3.png";
const imgOffice = "/property_card_4.png";
const imgRooftop = "/hero_property.png";

const imgContainer = "/svg/sparks-icon.svg"; // Add project plus icon
const imgContainer1 = "/svg/arrow-send.svg"; // Upload design upload icon
const imgContainer2 = "/svg/email.svg"; // Header Bell Icon
const imgContainer3 = "/svg/eye.svg"; // views eye icon
const imgContainer4 = "/svg/home.svg"; // project card folder icon
const imgContainer5 = "/svg/architect.svg"; // house plans floorplan icon
const imgContainer6 = "/svg/construction.svg"; // 3d design cube icon
const imgContainer7 = "/svg/agent.svg"; // followers people icon
const imgContainer8 = "/svg/eye.svg"; // small eye icon
const imgContainer9 = "/svg/heart.svg"; // small heart icon
const imgContainer10 = "/svg/eye.svg"; // eye icon trending
const imgContainer11 = "/svg/heart.svg"; // heart icon trending
const imgContainer12 = "/svg/bookmark.svg"; // download icon trending
const imgContainer13 = "/svg/checkMark.svg"; // trending badge check
const imgContainer14 = "/svg/bedroom-icon.svg"; // bed icon blueprint
const imgContainer15 = "/svg/bathroom-icon.svg"; // bath icon blueprint
const imgContainer16 = "/svg/l-ruler-icon.svg"; // area icon blueprint
const imgContainer19 = "/svg/architect.svg"; // project table row 3 icon
const imgContainer20 = "/svg/sparks-settings-icon.svg"; // edit pencil icon
const imgContainer21 = "/svg/clock.svg"; // delete trash icon
const imgContainer22 = "/svg/architect.svg"; // project table row 4 icon
const imgContainer23 = "/svg/architect.svg"; // project table row 5 icon
const imgContainer24 = "/svg/architect.svg"; // project table row 6 icon
const imgContainer25 = "/src/assets/logo.png"; // logo icon sidebar
const imgContainer26 = "/svg/home.svg"; // dashboard icon sidebar
const imgContainer27 = "/svg/architect.svg"; // portfolio icon sidebar
const imgContainer28 = "/svg/construction.svg"; // projects icon sidebar
const imgContainer29 = "/svg/sparks-icon.svg"; // 3d design icon sidebar
const imgContainer30 = "/svg/agent.svg"; // testimonials icon sidebar
const imgContainer31 = "/svg/agent.svg"; // profile icon sidebar
const imgContainer32 = "/svg/sparks-settings-icon.svg"; // settings icon sidebar
const imgContainer33 = "/svg/sign-in.svg"; // logout icon sidebar

interface TableProject {
  id: number;
  name: string;
  views: string;
  likes: string;
  status: 'Active' | 'Completed' | 'In Review' | 'Pending';
  date: string;
  icon: string;
}

export default function ArchitectureDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Table Data State
  const [projects, setProjects] = useState<TableProject[]>([
    { id: 1, name: "Zenith Residence", views: "8,240", likes: "342", status: "Active", date: "Jun 12, 2025", icon: imgContainer19 },
    { id: 2, name: "Lakeview Office Complex", views: "5,880", likes: "214", status: "Completed", date: "May 28, 2025", icon: imgContainer22 },
    { id: 3, name: "Palm Court Villas", views: "4,120", likes: "178", status: "In Review", date: "Jun 02, 2025", icon: imgContainer23 },
    { id: 4, name: "Heritage Heights", views: "3,740", likes: "156", status: "Pending", date: "Jun 18, 2025", icon: imgContainer24 }
  ]);

  // Gallery State
  const [galleryItems, setGalleryItems] = useState([
    { name: "Living Room", img: imgLivingRoom },
    { name: "Kitchen", img: imgKitchen },
    { name: "Master Suite", img: imgMasterSuite },
    { name: "Office", img: imgOffice },
    { name: "Rooftop", img: imgRooftop }
  ]);

  // Add Project Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjStatus, setNewProjStatus] = useState<'Active' | 'Completed' | 'In Review' | 'Pending'>("Active");

  // Edit Project Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<TableProject | null>(null);

  // Upload Design Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDesignName, setNewDesignName] = useState("");

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;
    const newProj: TableProject = {
      id: Date.now(),
      name: newProjName,
      views: "1,200",
      likes: "45",
      status: newProjStatus,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      icon: imgContainer19
    };
    setProjects(prev => [newProj, ...prev]);
    setNewProjName("");
    setAddModalOpen(false);
  };

  const handleEditProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj) return;
    setProjects(prev => prev.map(p => p.id === editingProj.id ? editingProj : p));
    setEditingProj(null);
    setEditModalOpen(false);
  };

  const handleDeleteProject = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    const statuses: Array<'Active' | 'Completed' | 'In Review' | 'Pending'> = ['Active', 'Completed', 'In Review', 'Pending'];
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const nextIndex = (statuses.indexOf(p.status) + 1) % statuses.length;
        return { ...p, status: statuses[nextIndex] };
      }
      return p;
    }));
  };

  const handleUploadDesignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesignName) return;
    const newItem = {
      name: newDesignName,
      img: imgLivingRoom // Mock image replacement
    };
    setGalleryItems(prev => [newItem, ...prev.slice(0, 4)]);
    setNewDesignName("");
    setUploadModalOpen(false);
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-row items-start font-normal text-[#1d1d1d]"
      style={{ backgroundImage: "linear-gradient(90deg, rgb(230, 224, 212) 0%, rgb(230, 224, 212) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}
    >
      
      {/* ─── 1. Left Sidebar Navigation ─────────────────────────────────────── */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#345b79] flex flex-col justify-between pt-[76px] pb-[24px] px-[16px] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="absolute top-[11px] left-0 right-0 px-[24px] flex items-center gap-[12px] h-[52px]">
          <div className="bg-white/10 flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
            <img alt="" className="size-[20px] object-contain" src={imgContainer25} />
          </div>
          <div>
            <h1 className="text-[20px] font-extrabold text-white leading-[25px]">NexaBuild</h1>
            <p className="text-[10px] text-white/50 tracking-[1px] uppercase leading-[15px]">Architecture Studio</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-grow flex flex-col justify-between overflow-y-auto mt-[20px]">
          <nav className="flex flex-col gap-[4px] w-full">
            <Link 
              to="/architecture-dashboard" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] bg-[#3d4d5e] text-white font-semibold text-[16px]"
            >
              <img alt="Dashboard" className="size-[18px]" src={imgContainer26} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/view-all-properties" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Portfolio" className="size-[20px] filter brightness-200" src={imgContainer27} />
              <span>Portfolio</span>
            </Link>
            <Link 
              to="/view-all-land" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Projects" className="size-[18px] filter brightness-200" src={imgContainer28} />
              <span>Projects</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <span className="text-[24px] leading-[0] text-white/70 select-none font-bold">🗺️</span>
              <span>House Plans</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="3D Designs" className="size-[20px] filter brightness-200" src={imgContainer29} />
              <span>3D Designs</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Testimonials" className="size-[20px] filter brightness-200" src={imgContainer30} />
              <span>Testimonials</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Profile" className="size-[16px] filter brightness-200" src={imgContainer31} />
              <span>Profile</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Settings" className="size-[20px] filter brightness-200" src={imgContainer32} />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Sidebar Footer Studio Info */}
          <div className="border-t border-white/10 pt-[20px] flex flex-col gap-[16px]">
            <Link 
              to="/auth/login" 
              className="flex items-center gap-[12px] px-[16px] py-[8px] text-white/70 hover:text-white transition-all text-[16px]"
            >
              <img alt="Logout" className="size-[18px] filter brightness-200" src={imgContainer33} />
              <span>Logout</span>
            </Link>

            <div className="bg-white/5 rounded-[16px] p-[12px] flex items-center gap-[12px]">
              <div className="bg-[#345b79] rounded-full size-[40px] flex items-center justify-center font-bold text-white shrink-0">
                AR
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-white truncate leading-[20px]">Arch. Firm Pro</p>
                <p className="text-[10px] text-white/40 leading-[15px]">Verified Studio</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-45 bg-black/45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── 2. Main Content Area ───────────────────────────────────────────── */}
      <main className="flex-1 lg:pl-[260px] min-w-0 flex flex-col pt-[32px] pb-[60px] px-[16px] sm:px-[24px] lg:px-[32px] gap-[32px] max-w-[1400px] w-full mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-[8px]">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-[4px] border border-gray-200 rounded hover:bg-gray-50 focus:outline-none"
                aria-label="Open sidebar"
              >
                <svg className="size-[16px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <p className="text-[14px] font-medium text-[#6b7280]">Good morning,</p>
            </div>
            <h2 className="text-[30px] font-bold text-[#1d1d1d] tracking-tight leading-[36px] mt-[4px]">
              Architecture Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-[16px]">
            <button 
              onClick={() => navigate('/add-architecture-project')}
              className="bg-[#345b79] hover:bg-[#345b79]/95 text-white text-[14px] font-bold px-[24px] py-[10px] rounded-full flex items-center gap-[8px] shadow-md shadow-[#345b79]/20 transition-all cursor-pointer"
            >
              <img alt="" className="size-[7px]" src={imgContainer} />
              <span>Add Project</span>
            </button>
            
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="bg-[#be5d3f] hover:bg-[#be5d3f]/95 text-white text-[14px] font-bold px-[24px] py-[10px] rounded-full flex items-center gap-[8px] shadow-md shadow-[#be5d3f]/20 transition-all cursor-pointer"
            >
              <img alt="" className="h-[9.1px] w-[8.4px]" src={imgContainer1} />
              <span>Upload Design</span>
            </button>

            <div className="bg-[#e5e7eb] flex items-center justify-center rounded-full size-[40px] shrink-0 relative cursor-pointer hover:bg-gray-200">
              <img alt="Notifications" className="h-[20px] w-[16px]" src={imgContainer2} />
              <div className="absolute top-[10px] right-[12px] bg-red-500 rounded-full size-[6px]" />
            </div>
          </div>
        </header>

        {/* ─── 3. Metric Cards Grid ────────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[24px] w-full">
          {/* views */}
          <div className="bg-white rounded-[24px] p-[24px] flex flex-col justify-between shadow-sm border border-gray-100/50">
            <div className="flex items-start justify-between pb-[16px]">
              <div className="bg-[#eff6ff] flex items-center justify-center rounded-[12px] size-[40px]">
                <img alt="" className="h-[15px] w-[22px]" src={imgContainer3} />
              </div>
              <span className="text-[11px] font-bold text-[#16a34a]">+12.4%</span>
            </div>
            <div>
              <p className="text-[24px] font-extrabold text-[#1d1d1d] leading-[32px]">24,580</p>
              <p className="text-[12px] font-medium text-[#6b7280] mt-[4px]">Portfolio Views</p>
            </div>
          </div>

          {/* projects */}
          <div className="bg-white rounded-[24px] p-[24px] flex flex-col justify-between shadow-sm border border-gray-100/50">
            <div className="flex items-start justify-between pb-[16px]">
              <div className="bg-[#fff7ed] flex items-center justify-center rounded-[12px] size-[40px]">
                <img alt="" className="h-[16px] w-[21.5px]" src={imgContainer4} />
              </div>
              <span className="text-[11px] font-bold text-[#16a34a]">+3</span>
            </div>
            <div>
              <p className="text-[24px] font-extrabold text-[#1d1d1d] leading-[32px]">{projects.length + 34}</p>
              <p className="text-[12px] font-medium text-[#6b7280] mt-[4px]">Projects</p>
            </div>
          </div>

          {/* house plans */}
          <div className="bg-white rounded-[24px] p-[24px] flex flex-col justify-between shadow-sm border border-gray-100/50">
            <div className="flex items-start justify-between pb-[16px]">
              <div className="bg-[#f0fdf4] flex items-center justify-center rounded-[12px] size-[40px]">
                <img alt="" className="h-[18px] w-[16px]" src={imgContainer5} />
              </div>
              <span className="text-[11px] font-bold text-[#16a34a]">+8</span>
            </div>
            <div>
              <p className="text-[24px] font-extrabold text-[#1d1d1d] leading-[32px]">64</p>
              <p className="text-[12px] font-medium text-[#6b7280] mt-[4px]">House Plans</p>
            </div>
          </div>

          {/* 3d designs */}
          <div className="bg-white rounded-[24px] p-[24px] flex flex-col justify-between shadow-sm border border-gray-100/50">
            <div className="flex items-start justify-between pb-[16px]">
              <div className="bg-[#f9fafb] flex items-center justify-center rounded-[12px] size-[40px]">
                <img alt="" className="size-[20px]" src={imgContainer6} />
              </div>
              <span className="text-[11px] font-bold text-[#16a34a]">+2</span>
            </div>
            <div>
              <p className="text-[24px] font-extrabold text-[#1d1d1d] leading-[32px]">21</p>
              <p className="text-[12px] font-medium text-[#6b7280] mt-[4px]">3D Designs</p>
            </div>
          </div>

          {/* followers */}
          <div className="bg-white rounded-[24px] p-[24px] flex flex-col justify-between shadow-sm border border-gray-100/50">
            <div className="flex items-start justify-between pb-[16px]">
              <div className="bg-[#eef2ff] flex items-center justify-center rounded-[12px] size-[40px]">
                <img alt="" className="h-[12px] w-[24px]" src={imgContainer7} />
              </div>
              <span className="text-[11px] font-bold text-[#16a34a]">+5.1%</span>
            </div>
            <div>
              <p className="text-[24px] font-extrabold text-[#1d1d1d] leading-[32px]">4,820</p>
              <p className="text-[12px] font-medium text-[#6b7280] mt-[4px]">Followers</p>
            </div>
          </div>
        </section>

        {/* ─── 4. Latest Portfolio & Most Viewed ───────────────────────────── */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-[32px] w-full">
          {/* Latest Portfolio List */}
          <div className="xl:col-span-8 flex flex-col gap-[24px]">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#1d1d1d]">Latest Portfolio</h3>
              <Link to="/view-all-properties" className="text-[#345b79] text-[12px] font-bold tracking-[0.6px] uppercase hover:underline">
                VIEW ALL
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
              {/* Zenith Residence Card */}
              <div className="bg-white rounded-[24px] overflow-hidden shadow-sm flex flex-col group border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="h-[160px] overflow-hidden relative bg-gray-100">
                  <img alt="Zenith Residence" className="size-full object-cover group-hover:scale-102 transition-transform duration-300" src={imgZenithResidence} />
                </div>
                <div className="p-[20px] flex flex-col gap-[4px]">
                  <span className="text-[10px] font-bold tracking-wider text-[#9ca3af] uppercase">MODERN VILLA</span>
                  <h4 className="text-[16px] font-bold text-[#1d1d1d]">Zenith Residence</h4>
                  <div className="flex gap-[16px] items-center pt-[8px] text-[11px] font-bold text-[#6b7280]">
                    <div className="flex items-center gap-[4px]">
                      <img alt="" className="h-[8.4px] w-[12.6px]" src={imgContainer8} />
                      <span>4,210</span>
                    </div>
                    <div className="flex items-center gap-[4px]">
                      <img alt="" className="h-[10.1px] w-[11.2px]" src={imgContainer9} />
                      <span>189</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skyline Tower Card */}
              <div className="bg-white rounded-[24px] overflow-hidden shadow-sm flex flex-col group border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="h-[160px] overflow-hidden relative bg-gray-100">
                  <img alt="Skyline Tower" className="size-full object-cover group-hover:scale-102 transition-transform duration-300" src={imgSkylineTower} />
                </div>
                <div className="p-[20px] flex flex-col gap-[4px]">
                  <span className="text-[10px] font-bold tracking-wider text-[#9ca3af] uppercase">COMMERCIAL</span>
                  <h4 className="text-[16px] font-bold text-[#1d1d1d]">Skyline Tower</h4>
                  <div className="flex gap-[16px] items-center pt-[8px] text-[11px] font-bold text-[#6b7280]">
                    <div className="flex items-center gap-[4px]">
                      <img alt="" className="h-[8.4px] w-[12.6px]" src={imgContainer8} />
                      <span>3,840</span>
                    </div>
                    <div className="flex items-center gap-[4px]">
                      <img alt="" className="h-[10.1px] w-[11.2px]" src={imgContainer9} />
                      <span>152</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Palm Court Card */}
              <div className="bg-white rounded-[24px] overflow-hidden shadow-sm flex flex-col group border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="h-[160px] overflow-hidden relative bg-gray-100">
                  <img alt="Palm Court" className="size-full object-cover group-hover:scale-102 transition-transform duration-300" src={imgPalmCourt} />
                </div>
                <div className="p-[20px] flex flex-col gap-[4px]">
                  <span className="text-[10px] font-bold tracking-wider text-[#9ca3af] uppercase">RESORT</span>
                  <h4 className="text-[16px] font-bold text-[#1d1d1d]">Palm Court</h4>
                  <div className="flex gap-[16px] items-center pt-[8px] text-[11px] font-bold text-[#6b7280]">
                    <div className="flex items-center gap-[4px]">
                      <img alt="" className="h-[8.4px] w-[12.6px]" src={imgContainer8} />
                      <span>2,990</span>
                    </div>
                    <div className="flex items-center gap-[4px]">
                      <img alt="" className="h-[10.1px] w-[11.2px]" src={imgContainer9} />
                      <span>134</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Most Viewed Design (Sidebar card) */}
          <div className="xl:col-span-4 flex flex-col gap-[24px]">
            <h3 className="text-[18px] font-bold text-[#1d1d1d]">Most Viewed Design</h3>
            
            <div className="bg-white rounded-[24px] overflow-hidden shadow-lg border border-gray-100 relative flex flex-col group">
              <div className="h-[224px] overflow-hidden relative bg-gray-100">
                <img alt="Apex Penthouse Series" className="size-full object-cover group-hover:scale-102 transition-transform duration-300" src={imgMostViewed} />
              </div>
              <div className="p-[24px] flex flex-col gap-[4px]">
                <span className="text-[10px] font-bold tracking-wider text-[#9ca3af] uppercase">LUXURY RESIDENTIAL</span>
                <h4 className="text-[20px] font-bold text-[#1d1d1d]">Apex Penthouse Series</h4>
                <div className="flex gap-[24px] items-center pt-[12px] text-[12px] font-bold text-[#6b7280]">
                  <div className="flex gap-[6px] items-center">
                    <img alt="" className="h-[9.6px] w-[14.4px]" src={imgContainer10} />
                    <span>12,480</span>
                  </div>
                  <div className="flex gap-[6px] items-center">
                    <img alt="" className="h-[11.6px] w-[12.8px]" src={imgContainer11} />
                    <span>580</span>
                  </div>
                  <div className="flex gap-[6px] items-center">
                    <img alt="" className="h-[12.8px] w-[11.2px]" src={imgContainer12} />
                    <span>214</span>
                  </div>
                </div>
              </div>

              {/* Trending Badge Overlay */}
              <div className="absolute top-[16px] right-[16px] bg-[#345b79] rounded-full px-[12px] py-[4px] flex items-center gap-[4px] text-white text-[10px] font-extrabold shadow-sm select-none">
                <img alt="" className="h-[5.8px] w-[9.6px] filter invert" src={imgContainer13} />
                <span>#1 Trending</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. House Plans & Analytics ─────────────────────────────────── */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-[32px] w-full pt-[8px]">
          {/* Latest House Plans (Blueprint list) */}
          <div className="xl:col-span-6 flex flex-col gap-[24px]">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#1d1d1d]">Latest House Plans</h3>
              <Link to="#" className="text-[#345b79] text-[12px] font-bold tracking-[0.6px] uppercase hover:underline">
                VIEW ALL
              </Link>
            </div>

            <div className="flex flex-col gap-[16px] w-full">
              {/* Row 1 */}
              <div className="bg-white rounded-[24px] p-[24px] flex flex-row items-center gap-[24px] shadow-sm border border-gray-100/50">
                <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-[12px] p-[8px] size-[100px] flex items-center justify-center shrink-0">
                  <img alt="Blueprint A-4" className="size-[84px] object-contain" src={imgBlueprint} />
                </div>
                <div className="flex flex-col gap-[12px]">
                  <h4 className="text-[18px] font-bold text-[#1d1d1d]">Blueprint A-4 Series</h4>
                  <div className="flex flex-wrap gap-[16px] text-[11px] font-bold text-[#6b7280]">
                    <div className="flex items-center gap-[6px]">
                      <img alt="" className="h-[8px] w-[12.8px]" src={imgContainer14} />
                      <span>4 Beds</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <img alt="" className="size-[12.8px]" src={imgContainer15} />
                      <span>3 Baths</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <img alt="" className="size-[10.8px]" src={imgContainer16} />
                      <span>3,200 sqft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="bg-white rounded-[24px] p-[24px] flex flex-row items-center gap-[24px] shadow-sm border border-gray-100/50">
                <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-[12px] p-[8px] size-[100px] flex items-center justify-center shrink-0">
                  <img alt="Compact Studio X2" className="size-[84px] object-contain" src={imgBlueprint1} />
                </div>
                <div className="flex flex-col gap-[12px]">
                  <h4 className="text-[18px] font-bold text-[#1d1d1d]">Compact Studio X2</h4>
                  <div className="flex flex-wrap gap-[16px] text-[11px] font-bold text-[#6b7280]">
                    <div className="flex items-center gap-[6px]">
                      <img alt="" className="h-[8px] w-[12.8px]" src={imgContainer14} />
                      <span>2 Beds</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <img alt="" className="size-[12.8px]" src={imgContainer15} />
                      <span>1 Baths</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <img alt="" className="size-[10.8px]" src={imgContainer16} />
                      <span>1,100 sqft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Subgrid */}
          <div className="xl:col-span-6 flex flex-col gap-[24px]">
            <h3 className="text-[18px] font-bold text-[#1d1d1d]">Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {/* Portfolio Growth custom SVG bar chart */}
              <div className="bg-white rounded-[24px] p-[24px] shadow-sm border border-gray-100/50 flex flex-col justify-between h-[180px]">
                <h4 className="text-[12px] font-bold text-[#1d1d1d]">Portfolio Growth</h4>
                
                {/* SVG Visual Bars */}
                <div className="flex items-end justify-between h-[80px] px-[8px] mt-[16px]">
                  {[35, 55, 75, 45, 65, 85, 95].map((height, i) => (
                    <div key={i} className="flex flex-col items-center gap-[4px] w-full">
                      <div className="w-[12px] bg-[#345b79]/90 hover:bg-[#345b79] transition-all rounded-t-sm" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[9px] text-[#9ca3af] font-bold px-[4px] mt-[8px]">
                  <span>Jan</span>
                  <span>Apr</span>
                  <span>Jul</span>
                </div>
              </div>

              {/* Views Trend custom SVG line chart */}
              <div className="bg-white rounded-[24px] p-[24px] shadow-sm border border-gray-100/50 flex flex-col justify-between h-[180px]">
                <h4 className="text-[12px] font-bold text-[#1d1d1d]">Views Trend</h4>
                
                {/* SVG Line Graph */}
                <div className="h-[80px] w-full relative mt-[16px]">
                  <svg className="size-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path 
                      d="M 0 30 Q 15 25 30 35 T 60 15 T 90 22 T 100 5" 
                      fill="none" 
                      stroke="#be5d3f" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="flex justify-between text-[9px] text-[#9ca3af] font-bold px-[4px] mt-[8px]">
                  <span>Jan</span>
                  <span>Apr</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>

            {/* Popular Design Styles Pill list */}
            <div className="bg-white rounded-[24px] p-[24px] shadow-sm border border-gray-100/50 flex flex-col gap-[16px]">
              <h4 className="text-[12px] font-bold text-[#1d1d1d]">Popular Design Styles</h4>
              
              <div className="flex flex-wrap gap-[8px]">
                {[
                  { name: "Modern", count: 142 },
                  { name: "Luxury", count: 98 },
                  { name: "Minimal", count: 87 },
                  { name: "Traditional", count: 64 },
                  { name: "Industrial", count: 51 },
                  { name: "Contemporary", count: 45 }
                ].map((style, idx) => (
                  <div 
                    key={style.name}
                    className={`px-[12px] py-[6px] rounded-full text-[12px] font-bold flex items-center gap-[6px] select-none ${
                      idx === 0 
                        ? "bg-[#345b79] text-white" 
                        : "bg-[#f3f4f6] text-[#4b5563]"
                    }`}
                  >
                    <span>{style.name}</span>
                    <span className={idx === 0 ? "text-white/70" : "text-gray-400"}>{style.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. Project Gallery Section ─────────────────────────────────── */}
        <section className="flex flex-col gap-[24px] w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
            <h3 className="text-[18px] font-bold text-[#1d1d1d]">Project Gallery</h3>
            
            <div className="flex items-center gap-[12px]">
              <button 
                onClick={() => alert("Upload house plan (Mock).")}
                className="border border-[#e5e7eb] hover:bg-gray-50 text-[12px] font-bold px-[16px] py-[8px] rounded-full flex items-center gap-[6px] cursor-pointer"
              >
                <span>Upload House Plan</span>
              </button>
              <button 
                onClick={() => alert("Upload 3D design (Mock).")}
                className="border border-[#e5e7eb] hover:bg-gray-50 text-[12px] font-bold px-[16px] py-[8px] rounded-full flex items-center gap-[6px] cursor-pointer"
              >
                <span>Upload 3D Design</span>
              </button>
            </div>
          </div>

          {/* Horizontal scroll/flex gallery list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[16px] w-full">
            {galleryItems.map(item => (
              <div 
                key={item.name} 
                className="relative rounded-[16px] overflow-hidden aspect-[4/3] group shadow-sm border border-gray-100/50"
              >
                <img alt={item.name} className="size-full object-cover group-hover:scale-103 transition-transform duration-300" src={item.img} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-[12px]">
                  <span className="text-white text-[12px] font-bold tracking-tight">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 7. Project Statistics Table ────────────────────────────────── */}
        <section className="flex flex-col gap-[24px] w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-[#1d1d1d]">Project Statistics</h3>
            <button 
              onClick={() => alert("Exporting report as PDF...")}
              className="text-[#345b79] hover:underline text-[12px] font-bold tracking-[0.5px] uppercase cursor-pointer"
            >
              EXPORT REPORT
            </button>
          </div>

          {/* Responsive Table Wrapper */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100/50 overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold tracking-wider text-[#9ca3af] uppercase">
                  <th className="py-[16px] px-[24px] w-[30%]">PROJECT NAME</th>
                  <th className="py-[16px] px-[24px] text-center w-[15%]">VIEWS</th>
                  <th className="py-[16px] px-[24px] text-center w-[15%]">LIKES</th>
                  <th className="py-[16px] px-[24px] w-[15%]">STATUS</th>
                  <th className="py-[16px] px-[24px] w-[15%]">DATE</th>
                  <th className="py-[16px] px-[24px] text-right w-[10%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[14px]">
                {projects.map(proj => {
                  let badgeBg = "bg-[#f3f4f6] text-gray-500";
                  if (proj.status === "Active") badgeBg = "bg-[#dcfce7] text-[#16a34a]";
                  if (proj.status === "Completed") badgeBg = "bg-[#e0e7ff] text-[#4f46e5]";
                  if (proj.status === "In Review") badgeBg = "bg-[#ffedd5] text-[#ea580c]";

                  return (
                    <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Name with icon preview */}
                      <td className="py-[20px] px-[24px] font-bold text-[#1d1d1d] flex items-center gap-[12px]">
                        <div className="bg-[#f3f4f6] flex items-center justify-center rounded-[4px] size-[32px]">
                          <img alt="" className="size-[10px]" src={proj.icon} />
                        </div>
                        <span>{proj.name}</span>
                      </td>

                      {/* Views */}
                      <td className="py-[20px] px-[24px] text-center text-[#6b7280] font-medium">
                        {proj.views}
                      </td>

                      {/* Likes */}
                      <td className="py-[20px] px-[24px] text-center text-[#6b7280] font-medium">
                        {proj.likes}
                      </td>

                      {/* Status badge toggler */}
                      <td className="py-[20px] px-[24px]">
                        <button 
                          onClick={() => toggleStatus(proj.id)}
                          className={`px-[12px] py-[2px] rounded-full text-[10px] font-extrabold uppercase tracking-wide cursor-pointer transition-colors ${badgeBg}`}
                          title="Click to toggle status"
                        >
                          {proj.status}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-[20px] px-[24px] text-[#9ca3af] font-medium">
                        {proj.date}
                      </td>

                      {/* Action buttons edit & delete */}
                      <td className="py-[20px] px-[24px] text-right">
                        <div className="flex items-center justify-end gap-[8px]">
                          <button 
                            onClick={() => {
                              setEditingProj(proj);
                              setEditModalOpen(true);
                            }}
                            className="p-[6px] hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
                            aria-label="Edit project"
                          >
                            <img alt="Edit" className="size-[13px]" src={imgContainer20} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-[6px] hover:bg-red-50 rounded-full cursor-pointer transition-colors"
                            aria-label="Delete project"
                          >
                            <img alt="Delete" className="size-[13px]" src={imgContainer21} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* ─── 8. Modals UI ─────────────────────────────────────────────────── */}
      
      {/* Add Project Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px] backdrop-blur-[1px]">
          <div className="bg-white rounded-[24px] p-[32px] w-full max-w-[480px] shadow-xl relative border border-gray-100">
            <h3 className="text-[20px] font-bold text-[#1d1d1d]">Add New Project</h3>
            <p className="text-[12px] text-gray-400 mt-[4px]">Introduce a new design project into the studio portfolio</p>
            
            <form onSubmit={handleAddProjectSubmit} className="mt-[24px] flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Project Name</label>
                <input 
                  type="text" 
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. Marina Horizon Towers"
                  className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[16px] py-[12px] text-[15px] focus:outline-none focus:border-[#345b79]/45"
                  required
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Initial Status</label>
                <select 
                  value={newProjStatus}
                  onChange={(e) => setNewProjStatus(e.target.value as any)}
                  className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[16px] py-[12px] text-[15px] focus:outline-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="In Review">In Review</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex justify-end gap-[12px] pt-[8px]">
                <button 
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-[20px] py-[10px] rounded-full text-gray-500 hover:bg-gray-50 text-[14px] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#345b79] hover:bg-[#345b79]/95 text-white px-[24px] py-[10px] rounded-full text-[14px] font-bold cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editModalOpen && editingProj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px] backdrop-blur-[1px]">
          <div className="bg-white rounded-[24px] p-[32px] w-full max-w-[480px] shadow-xl relative border border-gray-100">
            <h3 className="text-[20px] font-bold text-[#1d1d1d]">Edit Project Specifications</h3>
            <p className="text-[12px] text-gray-400 mt-[4px]">Modify key settings for {editingProj.name}</p>
            
            <form onSubmit={handleEditProjectSubmit} className="mt-[24px] flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Project Name</label>
                <input 
                  type="text" 
                  value={editingProj.name}
                  onChange={(e) => setEditingProj({ ...editingProj, name: e.target.value })}
                  className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[16px] py-[12px] text-[15px] focus:outline-none focus:border-[#345b79]/45"
                  required
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</label>
                <select 
                  value={editingProj.status}
                  onChange={(e) => setEditingProj({ ...editingProj, status: e.target.value as any })}
                  className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[16px] py-[12px] text-[15px] focus:outline-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="In Review">In Review</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex justify-end gap-[12px] pt-[8px]">
                <button 
                  type="button"
                  onClick={() => {
                    setEditingProj(null);
                    setEditModalOpen(false);
                  }}
                  className="px-[20px] py-[10px] rounded-full text-gray-500 hover:bg-gray-50 text-[14px] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#345b79] hover:bg-[#345b79]/95 text-white px-[24px] py-[10px] rounded-full text-[14px] font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Design Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px] backdrop-blur-[1px]">
          <div className="bg-white rounded-[24px] p-[32px] w-full max-w-[480px] shadow-xl relative border border-gray-100">
            <h3 className="text-[20px] font-bold text-[#1d1d1d]">Upload Design Photo</h3>
            <p className="text-[12px] text-gray-400 mt-[4px]">Upload rendering images to showcase in project gallery</p>
            
            <form onSubmit={handleUploadDesignSubmit} className="mt-[24px] flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Design Name / Room Type</label>
                <input 
                  type="text" 
                  value={newDesignName}
                  onChange={(e) => setNewDesignName(e.target.value)}
                  placeholder="e.g. Master Bedroom, Terrace Lounge"
                  className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[16px] py-[12px] text-[15px] focus:outline-none focus:border-[#345b79]/45"
                  required
                />
              </div>

              <div className="border-2 border-dashed border-gray-200 hover:border-[#345b79]/50 rounded-[12px] p-[24px] text-center flex flex-col items-center justify-center gap-[6px] bg-[#f9fafb] cursor-pointer">
                <span className="text-[18px] font-light text-gray-400">+</span>
                <span className="text-[11px] font-bold text-gray-400">Select Image File</span>
              </div>

              <div className="flex justify-end gap-[12px] pt-[8px]">
                <button 
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-[20px] py-[10px] rounded-full text-gray-500 hover:bg-gray-50 text-[14px] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#be5d3f] hover:bg-[#be5d3f]/95 text-white px-[24px] py-[10px] rounded-full text-[14px] font-bold cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
