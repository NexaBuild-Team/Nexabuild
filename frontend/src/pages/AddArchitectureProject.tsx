import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

// ─── Figma Image Assets ──────────────────────────────────────────────────────
const imgLivingRoom = "http://localhost:3845/assets/3043af767f79e72b199e17d2c4a62202c4b86fa6.png";
const imgBedroom = "http://localhost:3845/assets/e8ec5cf500f9420fe6f921df2f789758cb1c35ac.png";
const imgKitchen = "http://localhost:3845/assets/c621bfe2411c18de980f8a20e5219ac4f69f330b.png";

const imgExteriorView = "http://localhost:3845/assets/a8d12eac2242f2b4a168799cc4da0ecb026ede1c.png";
const imgInteriorView = "http://localhost:3845/assets/5ba867354489fb1b58c0cf2b91bfcb06471dd70d.png";

// Icon SVGs
const imgSvg = "http://localhost:3845/assets/3bb035f565bb04b2ac40aea4be42d08e076b003a.svg"; // Back arrow
const imgSvg1 = "http://localhost:3845/assets/197458c2b0ead7d6754ab3c44b3f429142be2d55.svg"; // Delete bin
const imgSvg2 = "http://localhost:3845/assets/0a87ce8f79fe54895d0a1f37a325477bbcc6a99f.svg"; // Save Draft
const imgSvg3 = "http://localhost:3845/assets/00e9633f6db21304bacebeafa24b53bcf75beb9f.svg"; // Preview eye
const imgSvg4 = "http://localhost:3845/assets/a0f56941466ae9a86c7aa94ce86f3fd050f9fc2d.svg"; // Publish check
const imgSvg5 = "http://localhost:3845/assets/e65876440686f67d7f9fc1f2ebf431558e2c6045.svg"; // Info icon
const imgSvg6 = "http://localhost:3845/assets/28e35b5295f55a3a73c1f171716eef26d79b7b0e.svg"; // Input name icon
const imgSvg7 = "http://localhost:3845/assets/d6ce1ecc441db66512723374776e34368c6c7b65.svg"; // Modern pill icon
const imgSvg8 = "http://localhost:3845/assets/ac3da4c284fcc2dbc99a2a505d8e02b391651a4f.svg"; // Modern check
const imgSvg9 = "http://localhost:3845/assets/388e5143fdf763dd40ae98d26df8faa4622b908f.svg"; // Luxury icon
const imgSvg10 = "http://localhost:3845/assets/fe02240f02a78f28e4c2c8429d667aafca695a1d.svg"; // Minimal icon
const imgSvg11 = "http://localhost:3845/assets/33bdd3b109392470d7caeb40ba6b3931c4800fed.svg"; // Traditional icon
const imgSvg12 = "http://localhost:3845/assets/ecda6173e94f740676cc1b30288ae74a79576a17.svg"; // Industrial icon
const imgSvg13 = "http://localhost:3845/assets/2363000bf747760ff8fd2425c90c310207340fd0.svg"; // Contemporary icon
const imgSvg14 = "http://localhost:3845/assets/351664ac88ecbe16004c97178136fae0720040a9.svg"; // Upload images icon
const imgSvg15 = "http://localhost:3845/assets/5a3de3e7402aa1e7f29cf59f60554e797a366613.svg"; // Dropzone cloud icon
const imgSvg16 = "http://localhost:3845/assets/a0d9a560dfb298badf252d36dadc2eca6209ba1c.svg"; // Gallery item close icon
const imgVector = "http://localhost:3845/assets/8b12e7f6614bacfa95328c24158eff4c6f14f127.svg"; // Add more plus path
const imgSvg17 = "http://localhost:3845/assets/9a5da6584cf33f30a07e66f4180a382af798b891.svg"; // House plan icon
const imgSvg18 = "http://localhost:3845/assets/90122cba65f30300667b8b09fef5672855f0551b.svg"; // Blueprints icon
const imgSvg19 = "http://localhost:3845/assets/b2d9f7c34ff4bd958c5cbec72841430808791400.svg"; // Upload PDF icon
const imgSvg20 = "http://localhost:3845/assets/44d8eb9ed45767bb8abc6133696f1d3a4b1b43e5.svg"; // 3D Render Icon
const imgSvg21 = "http://localhost:3845/assets/fdad51eccdfcb43d9b72baa84c774cc9fa1b5e88.svg"; // Close icon for 3D renders
const imgSvg22 = "http://localhost:3845/assets/45e1036ac1392b3ff21ec7e09435f38472a2a9e6.svg"; // Add 3D Render plus
const imgSvg23 = "http://localhost:3845/assets/4f624a273bffb6f5a25673703bae0c9054ea642d.svg"; // Details Specs Icon
const imgSvg33 = "http://localhost:3845/assets/44e216a9238bee75600862d00cf719136133dbba.svg"; // Sidebar header icon
const imgSvg34 = "http://localhost:3845/assets/f028177494de90f1e058719668a57e0f6346787b.svg"; // Sidebar dashboard
const imgSvg35 = "http://localhost:3845/assets/b8549f13ab3d8f7ace4ae17a8794ca1c3d16d763.svg"; // Sidebar portfolio
const imgSvg36 = "http://localhost:3845/assets/d5da241e6ae979716aad734647d1e778f54fae97.svg"; // Sidebar projects
const imgSvg37 = "http://localhost:3845/assets/89c2c0a8d86793f82c9b56168177dc5bd50c91e5.svg"; // Sidebar house plans
const imgSvg38 = "http://localhost:3845/assets/6017427a6c74b9a6e1baccc560413222aaf451ac.svg"; // Sidebar 3d designs
const imgSvg39 = "http://localhost:3845/assets/a3c9f2c5e2685b7c869e230fc8eb859c5c33f039.svg"; // Sidebar testimonials
const imgSvg40 = "http://localhost:3845/assets/e81308499613a594e2993bd351fb45fe1a91bcb8.svg"; // Sidebar profile
const imgSvg41 = "http://localhost:3845/assets/be8b6107101e075e44d4ba4d1641f5f6eaae9cec.svg"; // Sidebar settings
const imgSvg42 = "http://localhost:3845/assets/e8a5922078ed8e39a3135ebbf29c778636d325ca.svg"; // Sidebar logout

export default function AddArchitectureProject() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form Field States
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [category, setCategory] = useState("Modern");

  // Upload Images
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([
    imgLivingRoom, imgBedroom, imgKitchen
  ]);

  // House Plan Document Mock
  const [housePlanFile, setHousePlanFile] = useState<{ name: string; size: string } | null>(null);

  // 3D Render Image States
  const [renderImages, setRenderImages] = useState<string[]>([
    imgExteriorView, imgInteriorView
  ]);

  // Details Metadata Specs
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [constructionCost, setConstructionCost] = useState("");
  const [completionYear, setCompletionYear] = useState("");

  // Tags widget states
  const [tags, setTags] = useState<string[]>(["Residential", "Luxury", "Smart Home", "Sustainable", "Modern"]);
  const [newTagInput, setNewTagInput] = useState("");

  // Visibility state
  const [visibility, setVisibility] = useState<'Public' | 'Private' | 'Portfolio Only'>('Public');

  // Dynamic progress tracker calculations
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState({
    info: false,
    images: false,
    housePlan: false,
    renders: false,
    details: false
  });

  useEffect(() => {
    const isInfoDone = !!(projectName && projectDescription && category);
    const isImagesDone = !!(coverImage || galleryImages.length > 0);
    const isHousePlanDone = !!housePlanFile;
    const isRendersDone = renderImages.length > 0;
    const isDetailsDone = !!(area && bedrooms && bathrooms && constructionCost && completionYear);

    setSteps({
      info: isInfoDone,
      images: isImagesDone,
      housePlan: isHousePlanDone,
      renders: isRendersDone,
      details: isDetailsDone
    });

    let completedCount = 0;
    if (isInfoDone) completedCount++;
    if (isImagesDone) completedCount++;
    if (isHousePlanDone) completedCount++;
    if (isRendersDone) completedCount++;
    if (isDetailsDone) completedCount++;

    setProgress(Math.round((completedCount / 5) * 100));
  }, [projectName, projectDescription, category, coverImage, galleryImages, housePlanFile, renderImages, area, bedrooms, bathrooms, constructionCost, completionYear]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(newTagInput.trim())) {
        setTags(prev => [...prev, newTagInput.trim()]);
      }
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleMockPdfUpload = () => {
    setHousePlanFile({
      name: "Blueprint-Zenith-Residence-Final.pdf",
      size: "4.8 MB"
    });
  };

  const handleMockAddGalleryImage = () => {
    setGalleryImages(prev => [...prev, imgLivingRoom]);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMockAdd3DRender = () => {
    setRenderImages(prev => [...prev, imgExteriorView]);
  };

  const handleRemove3DRender = (index: number) => {
    setRenderImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    alert("Project published successfully!");
    navigate("/architecture-dashboard");
  };

  const handleSaveDraft = () => {
    alert("Project draft saved!");
    navigate("/architecture-dashboard");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to discard this project draft?")) {
      navigate("/architecture-dashboard");
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-row items-start font-normal text-[#1d1d1d]"
      style={{ backgroundImage: "linear-gradient(90deg, rgb(230, 224, 212) 0%, rgb(230, 224, 212) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}
    >
      
      {/* ─── 1. Left Sidebar Navigation ─────────────────────────────────────── */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[256px] bg-[#345b79] flex flex-col justify-between pt-[76px] pb-[24px] px-[16px] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="absolute top-[11px] left-0 right-0 px-[24px] flex items-center gap-[12px] h-[52px]">
          <div className="bg-white/10 flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
            <img alt="" className="size-[24px] object-contain filter invert" src={imgSvg33} />
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-white leading-[18px]">NexaBuild</h1>
            <p className="text-[12px] text-[#94a3b8] leading-[16px] mt-[2px]">Architecture Studio</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-grow flex flex-col justify-between overflow-y-auto mt-[20px]">
          <nav className="flex flex-col gap-[4px] w-full">
            <Link 
              to="/architecture-dashboard" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Dashboard" className="size-[20px]" src={imgSvg34} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/view-all-properties" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Portfolio" className="size-[20px]" src={imgSvg35} />
              <span>Portfolio</span>
            </Link>
            <Link 
              to="/view-all-land" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] bg-[#3d4d5e] text-white font-medium text-[16px]"
            >
              <img alt="Projects" className="size-[20px]" src={imgSvg36} />
              <span>Projects</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="House Plans" className="size-[20px]" src={imgSvg37} />
              <span>House Plans</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="3D Designs" className="size-[20px]" src={imgSvg38} />
              <span>3D Designs</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Testimonials" className="size-[20px]" src={imgSvg39} />
              <span>Testimonials</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Profile" className="size-[20px]" src={imgSvg40} />
              <span>Profile</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]"
            >
              <img alt="Settings" className="size-[20px]" src={imgSvg41} />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Sidebar Footer Studio Info */}
          <div className="border-t border-white/10 pt-[20px] flex flex-col gap-[16px]">
            <Link 
              to="/auth/login" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] text-white/70 hover:text-white transition-all text-[16px]"
            >
              <img alt="Logout" className="size-[20px]" src={imgSvg42} />
              <span>Logout</span>
            </Link>

            <div className="bg-[#345b79] rounded-[12px] p-[12px] flex items-center gap-[12px]">
              <div className="bg-[#345b79] border border-white/15 rounded-[8px] size-[40px] flex items-center justify-center font-bold text-white shrink-0">
                AR
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-white truncate leading-[20px]">Arch. Firm Pro</p>
                <p className="text-[12px] text-[#94a3b8] leading-[16px]">Verified Studio</p>
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
      <main className="flex-grow lg:pl-[256px] min-w-0 flex flex-col pt-[32px] pb-[80px] px-[24px] lg:px-[32px]">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-[20px] pb-[32px]">
          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[8px] text-[14px] text-[#64748b]">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-[4px] border border-gray-200 rounded hover:bg-gray-50 focus:outline-none"
                aria-label="Open sidebar"
              >
                <svg className="size-[16px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/architecture-dashboard" className="hover:underline flex items-center gap-[4px]">
                <img alt="" className="size-[16px]" src={imgSvg} />
                <span>Back to Dashboard</span>
              </Link>
              <span>|</span>
              <span className="text-[#0f172a] font-medium">Upload Architecture Project</span>
            </div>
            <h2 className="text-[24px] font-bold text-[#1d1d1d] leading-[32px] mt-[4px]">
              Upload Architecture Project
            </h2>
          </div>

          {/* Top Header Actions */}
          <div className="flex flex-wrap items-center gap-[12px] self-end md:self-center">
            <button 
              onClick={handleDelete}
              className="bg-white border border-[#e2e8f0] hover:bg-red-50 text-[#334155] hover:text-red-600 text-[16px] px-[17px] py-[9px] rounded-[12px] flex items-center gap-[8px] cursor-pointer transition-colors"
            >
              <img alt="" className="size-[16px]" src={imgSvg1} />
              <span>Delete</span>
            </button>
            <button 
              onClick={handleSaveDraft}
              className="bg-white border border-[#e2e8f0] hover:bg-gray-50 text-[#334155] text-[16px] px-[17px] py-[9px] rounded-[12px] flex items-center gap-[8px] cursor-pointer transition-colors"
            >
              <img alt="" className="size-[16px]" src={imgSvg2} />
              <span>Save Draft</span>
            </button>
            <button 
              onClick={() => alert("Preview mode is not implemented.")}
              className="bg-white border border-[#be5d3f] hover:bg-[#be5d3f]/5 text-[#be5d3f] text-[16px] px-[17px] py-[9px] rounded-[12px] flex items-center gap-[8px] cursor-pointer transition-colors"
            >
              <img alt="" className="size-[16px]" src={imgSvg3} />
              <span>Preview</span>
            </button>
            <button 
              onClick={handlePublish}
              className="bg-[#345b79] hover:bg-[#345b79]/95 text-white text-[16px] px-[16px] py-[8px] rounded-[12px] flex items-center gap-[8px] cursor-pointer transition-colors"
            >
              <img alt="" className="size-[16px]" src={imgSvg4} />
              <span>Publish Project</span>
            </button>
          </div>
        </header>

        {/* Content Body Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-[32px] w-full max-w-[1400px]">
          
          {/* ─── 3. Left Columns: Form Fields ──────────────────────────────── */}
          <div className="xl:col-span-8 flex flex-col gap-[32px]">
            
            {/* Section 1: Project Information */}
            <section className="bg-white border border-gray-100 rounded-[16px] p-[32px] flex flex-col gap-[24px] shadow-sm">
              <div className="flex gap-[12px] items-center">
                <div className="bg-[#f1f5f9] flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
                  <img alt="" className="size-[24px]" src={imgSvg5} />
                </div>
                <h3 className="text-[20px] font-bold text-[#1d1d1d]">Project Information</h3>
              </div>

              <div className="flex flex-col gap-[24px]">
                {/* Project Name */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
                    Project Name
                  </label>
                  <div className="relative w-full">
                    <input 
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Zenith Residence Villa"
                      className="w-full bg-[#f3f0eb] border-0 rounded-[12px] pl-[44px] pr-[16px] py-[13.5px] text-[16px] text-gray-800 placeholder-[#6b7280] focus:outline-none focus:bg-white border-2 border-transparent focus:border-[#345b79]/30 transition-all"
                    />
                    <div className="absolute left-[16px] top-1/2 -translate-y-1/2">
                      <img alt="" className="size-[20px] opacity-60" src={imgSvg6} />
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
                    Project Description
                  </label>
                  <textarea 
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the architecture concept, materials used, design inspiration..."
                    className="w-full bg-[#f3f0eb] border-0 rounded-[12px] px-[16px] py-[12px] text-[16px] text-gray-800 placeholder-[#6b7280] focus:outline-none focus:bg-white border-2 border-transparent focus:border-[#345b79]/30 transition-all resize-none"
                  />
                </div>

                {/* Project Category */}
                <div className="flex flex-col gap-[16px]">
                  <label className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
                    Project Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-[12px]">
                    {[
                      { name: "Modern", icon: imgSvg7 },
                      { name: "Luxury", icon: imgSvg9 },
                      { name: "Minimal", icon: imgSvg10 },
                      { name: "Traditional", icon: imgSvg11 },
                      { name: "Industrial", icon: imgSvg12 },
                      { name: "Contemporary", icon: imgSvg13 }
                    ].map(item => (
                      <button 
                        key={item.name}
                        type="button"
                        onClick={() => setCategory(item.name)}
                        className={`flex gap-[8px] items-center justify-between px-[18px] py-[14px] rounded-[12px] border transition-all cursor-pointer ${
                          category === item.name
                            ? "bg-[#f8fafc] border-[#345b79] border-2 text-[#345b79] font-bold"
                            : "bg-white border-[#e2e8f0] text-[#475569] font-normal"
                        }`}
                      >
                        <div className="flex gap-[8px] items-center">
                          <img alt="" className={`size-[16px] ${category === item.name ? "filter-none" : "opacity-75"}`} src={item.icon} />
                          <span>{item.name}</span>
                        </div>
                        {category === item.name && (
                          <img alt="" className="size-[16px]" src={imgSvg8} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Upload Images */}
            <section className="bg-white border border-gray-100 rounded-[16px] p-[32px] flex flex-col gap-[24px] shadow-sm">
              <div className="flex gap-[12px] items-center">
                <div className="bg-[#f1f5f9] flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
                  <img alt="" className="size-[24px]" src={imgSvg14} />
                </div>
                <h3 className="text-[20px] font-bold text-[#1d1d1d]">Upload Images</h3>
              </div>

              {/* Cover Image Dropzone */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
                  Cover Image
                </label>

                {coverImage ? (
                  <div className="relative w-full h-[180px] rounded-[16px] overflow-hidden border border-[#e2e8f0]">
                    <img alt="Cover Preview" className="size-full object-cover" src={coverImage} />
                    <button 
                      onClick={() => setCoverImage(null)}
                      className="absolute top-[12px] right-[12px] bg-red-600 hover:bg-red-700 text-white rounded-full p-[6px] shadow transition-colors cursor-pointer"
                    >
                      <svg className="size-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => setCoverImage(imgLivingRoom)}
                    className="bg-[#f8fafc] border-2 border-[#e2e8f0] border-dashed rounded-[16px] py-[42px] flex flex-col items-center justify-center gap-[12px] cursor-pointer hover:bg-[#f8fafc]/50 transition-colors"
                  >
                    <div className="bg-white drop-shadow-sm rounded-full size-[48px] flex items-center justify-center shrink-0">
                      <img alt="" className="size-[24px]" src={imgSvg15} />
                    </div>
                    <div className="text-center">
                      <p className="text-[14px] font-semibold text-[#0f172a]">Drag & Drop or Click to Upload</p>
                      <p className="text-[12px] text-[#64748b] mt-[4px]">JPG, PNG or WEBP — Max 10MB</p>
                    </div>
                    <button type="button" className="bg-white border border-[#cbd5e1] hover:bg-gray-50 text-[14px] font-medium px-[25px] py-[9px] rounded-[8px] transition-colors cursor-pointer mt-[4px]">
                      Browse Files
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Images List */}
              <div className="flex flex-col gap-[16px] pt-[8px]">
                <label className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
                  Project Gallery
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-[16px]">
                  {galleryImages.map((src, index) => (
                    <div key={index} className="relative aspect-[4/3] rounded-[12px] overflow-hidden border border-gray-100 shrink-0">
                      <img alt="Gallery Preview" className="size-full object-cover" src={src} />
                      <button 
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-[8px] right-[8px] bg-[#be5d3f] hover:bg-[#be5d3f]/95 rounded-full size-[24px] flex items-center justify-center shadow transition-colors cursor-pointer"
                      >
                        <img alt="Close" className="size-[12px] filter invert" src={imgSvg16} />
                      </button>
                    </div>
                  ))}

                  <div 
                    onClick={handleMockAddGalleryImage}
                    className="border-2 border-dashed border-[#e2e8f0] hover:border-gray-300 rounded-[12px] bg-white flex flex-col items-center justify-center gap-[4px] cursor-pointer transition-colors aspect-[4/3]"
                  >
                    <img alt="" className="size-[24px]" src={imgVector} />
                    <span className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wider mt-[4px]">ADD MORE</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Upload House Plan PDF */}
            <section className="bg-white border border-gray-100 rounded-[16px] p-[32px] flex flex-col gap-[24px] shadow-sm">
              <div className="flex gap-[12px] items-center">
                <div className="bg-[#f1f5f9] flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
                  <img alt="" className="size-[24px]" src={imgSvg17} />
                </div>
                <h3 className="text-[20px] font-bold text-[#1d1d1d]">Upload House Plan PDF</h3>
              </div>

              <div className="bg-[#f3f0eb] rounded-[12px] p-[24px] flex flex-col md:flex-row items-center justify-between gap-[20px]">
                <div className="flex gap-[16px] items-center w-full md:w-auto">
                  <div className="bg-white rounded-[8px] size-[48px] flex items-center justify-center shrink-0 shadow-sm">
                    <img alt="" className="size-[24px]" src={imgSvg18} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold text-[#0f172a]">
                      {housePlanFile ? housePlanFile.name : "Upload Floor Plan Document"}
                    </h4>
                    <p className="text-[12px] text-[#64748b] mt-[4px]">
                      {housePlanFile ? `Size: ${housePlanFile.size}` : "PDF format — Architectural blueprints, Floor plans"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-[12px] w-full md:w-auto shrink-0 justify-end">
                  {housePlanFile && (
                    <button 
                      onClick={() => setHousePlanFile(null)}
                      className="bg-white border border-red-200 text-red-500 hover:bg-red-50 text-[14px] font-bold px-[18px] py-[9px] rounded-[8px] cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                  <button 
                    onClick={handleMockPdfUpload}
                    className="bg-white border border-[#cbd5e1] hover:bg-gray-50 text-[14px] font-bold px-[25px] py-[9px] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                  >
                    <img alt="" className="size-[16px]" src={imgSvg19} />
                    <span>{housePlanFile ? "Replace PDF" : "Upload PDF"}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Section 4: Upload 3D Render Images */}
            <section className="bg-white border border-gray-100 rounded-[16px] p-[32px] flex flex-col gap-[24px] shadow-sm">
              <div className="flex gap-[12px] items-center">
                <div className="bg-[#f1f5f9] flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
                  <img alt="" className="size-[24px]" src={imgSvg20} />
                </div>
                <h3 className="text-[20px] font-bold text-[#1d1d1d]">Upload 3D Render Images</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[24px] w-full">
                {renderImages.map((src, index) => (
                  <div key={index} className="relative h-[256px] rounded-[16px] overflow-hidden border border-gray-100 shadow-sm group">
                    <img alt="3D Render Preview" className="size-full object-cover group-hover:scale-102 transition-transform duration-300" src={src} />
                    
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-[16px]">
                      <span className="text-white text-[14px] font-medium">
                        {index === 0 ? "Exterior View" : index === 1 ? "Interior View" : `Design Render #${index + 1}`}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleRemove3DRender(index)}
                      className="absolute bottom-[16px] right-[16px] bg-[#be5d3f] hover:bg-[#be5d3f]/95 text-white rounded-full p-[8px] shadow cursor-pointer transition-colors"
                      aria-label="Remove render image"
                    >
                      <img alt="Close" className="size-[16px] filter invert" src={imgSvg21} />
                    </button>
                  </div>
                ))}

                <button 
                  onClick={handleMockAdd3DRender}
                  className="border-2 border-dashed border-[#e2e8f0] hover:border-gray-300 rounded-[16px] bg-white flex flex-col items-center justify-center gap-[8px] cursor-pointer transition-colors h-[256px] w-full"
                >
                  <img alt="" className="size-[20px]" src={imgSvg22} />
                  <span className="text-[14px] font-semibold text-[#64748b] uppercase tracking-wider">Add 3D Render</span>
                </button>
              </div>
            </section>

          </div>

          {/* ─── 4. Right Sidebar Columns: Metadata Widgets ────────────────── */}
          <div className="xl:col-span-4 flex flex-col gap-[24px]">
            
            {/* Widget 1: Publish Status */}
            <div className="bg-white border border-gray-100 rounded-[16px] p-[24px] flex flex-col gap-[20px] shadow-sm">
              <span className="text-[12px] font-bold text-[#1d1d1d] uppercase tracking-wider">
                Publish Status
              </span>
              
              {/* Checklist list */}
              <div className="flex flex-col gap-[14px]">
                {/* Step 1 */}
                <div className="flex items-center justify-between text-[13px] text-[#4b5563]">
                  <div className="flex items-center gap-[8px]">
                    <div className={`rounded-full size-[18px] flex items-center justify-center border ${
                      steps.info ? "bg-[#345b79] border-[#345b79] text-white" : "border-gray-300 text-transparent"
                    }`}>
                      ✓
                    </div>
                    <span className={steps.info ? "font-bold text-gray-700" : ""}>Project Info</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{steps.info ? "Done" : "Pending"}</span>
                </div>

                {/* Step 2 */}
                <div className="flex items-center justify-between text-[13px] text-[#4b5563]">
                  <div className="flex items-center gap-[8px]">
                    <div className={`rounded-full size-[18px] flex items-center justify-center border ${
                      steps.images ? "bg-[#345b79] border-[#345b79] text-white" : "border-gray-300 text-transparent"
                    }`}>
                      ✓
                    </div>
                    <span className={steps.images ? "font-bold text-gray-700" : ""}>Images Uploaded</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{steps.images ? "Done" : "Pending"}</span>
                </div>

                {/* Step 3 */}
                <div className="flex items-center justify-between text-[13px] text-[#4b5563]">
                  <div className="flex items-center gap-[8px]">
                    <div className={`rounded-full size-[18px] flex items-center justify-center border ${
                      steps.housePlan ? "bg-[#345b79] border-[#345b79] text-white" : "border-gray-300 text-transparent"
                    }`}>
                      ✓
                    </div>
                    <span className={steps.housePlan ? "font-bold text-gray-700" : ""}>House Plan</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{steps.housePlan ? "Done" : "Pending"}</span>
                </div>

                {/* Step 4 */}
                <div className="flex items-center justify-between text-[13px] text-[#4b5563]">
                  <div className="flex items-center gap-[8px]">
                    <div className={`rounded-full size-[18px] flex items-center justify-center border ${
                      steps.renders ? "bg-[#345b79] border-[#345b79] text-white" : "border-gray-300 text-transparent"
                    }`}>
                      ✓
                    </div>
                    <span className={steps.renders ? "font-bold text-gray-700" : ""}>3D Renders</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{steps.renders ? "Done" : "Pending"}</span>
                </div>

                {/* Step 5 */}
                <div className="flex items-center justify-between text-[13px] text-[#4b5563]">
                  <div className="flex items-center gap-[8px]">
                    <div className={`rounded-full size-[18px] flex items-center justify-center border ${
                      steps.details ? "bg-[#345b79] border-[#345b79] text-white" : "border-gray-300 text-transparent"
                    }`}>
                      ✓
                    </div>
                    <span className={steps.details ? "font-bold text-gray-700" : ""}>Project Details</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{steps.details ? "Done" : "Pending"}</span>
                </div>
              </div>

              {/* Progress completion bar */}
              <div className="flex flex-col gap-[8px] pt-[8px]">
                <div className="flex justify-between items-center text-[12px] font-bold">
                  <span className="text-gray-500 uppercase tracking-wide">COMPLETION</span>
                  <span className="text-[#345b79]">{progress}%</span>
                </div>
                <div className="bg-gray-100 h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#345b79] h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="flex flex-col gap-[10px] pt-[10px]">
                <button 
                  onClick={handlePublish}
                  className="bg-[#345b79] hover:bg-[#345b79]/95 text-white text-[14px] font-bold py-[12px] rounded-full transition-colors cursor-pointer"
                >
                  Publish Project
                </button>
                <button 
                  onClick={handleSaveDraft}
                  className="bg-white border border-[#cbd5e1] hover:bg-gray-50 text-gray-700 text-[14px] font-bold py-[12px] rounded-full transition-colors cursor-pointer"
                >
                  Save as Draft
                </button>
              </div>
            </div>

            {/* Widget 2: Project Details */}
            <div className="bg-white border border-gray-100 rounded-[16px] p-[24px] flex flex-col gap-[20px] shadow-sm">
              <div className="flex items-center gap-[8px]">
                <img alt="" className="size-[16px] opacity-75" src={imgSvg23} />
                <span className="text-[12px] font-bold text-[#1d1d1d] uppercase tracking-wider">
                  Project Details
                </span>
              </div>

              {/* Fields list */}
              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wide">Area (SQFT)</label>
                  <input 
                    type="text" 
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 3,500 sqft"
                    className="w-full bg-[#f3f0eb] border-0 rounded-[12px] px-[16px] py-[10px] text-[14px] text-gray-800 placeholder-[#6b7280] focus:outline-none focus:bg-white border-2 border-transparent focus:border-[#345b79]/30 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wide">Bedrooms</label>
                  <input 
                    type="text" 
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full bg-[#f3f0eb] border-0 rounded-[12px] px-[16px] py-[10px] text-[14px] text-gray-800 placeholder-[#6b7280] focus:outline-none focus:bg-white border-2 border-transparent focus:border-[#345b79]/30 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wide">Bathrooms</label>
                  <input 
                    type="text" 
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-full bg-[#f3f0eb] border-0 rounded-[12px] px-[16px] py-[10px] text-[14px] text-gray-800 placeholder-[#6b7280] focus:outline-none focus:bg-white border-2 border-transparent focus:border-[#345b79]/30 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wide">Construction Cost</label>
                  <input 
                    type="text" 
                    value={constructionCost}
                    onChange={(e) => setConstructionCost(e.target.value)}
                    placeholder="e.g. $250,000"
                    className="w-full bg-[#f3f0eb] border-0 rounded-[12px] px-[16px] py-[10px] text-[14px] text-gray-800 placeholder-[#6b7280] focus:outline-none focus:bg-white border-2 border-transparent focus:border-[#345b79]/30 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wide">Completion Year</label>
                  <input 
                    type="text" 
                    value={completionYear}
                    onChange={(e) => setCompletionYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full bg-[#f3f0eb] border-0 rounded-[12px] px-[16px] py-[10px] text-[14px] text-gray-800 placeholder-[#6b7280] focus:outline-none focus:bg-white border-2 border-transparent focus:border-[#345b79]/30 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Widget 3: Project Tags */}
            <div className="bg-white border border-gray-100 rounded-[16px] p-[24px] flex flex-col gap-[16px] shadow-sm">
              <span className="text-[12px] font-bold text-[#1d1d1d] uppercase tracking-wider">
                Project Tags
              </span>

              {/* Tag pill list */}
              <div className="flex flex-wrap gap-[6px] w-full">
                {tags.map(tag => (
                  <div 
                    key={tag}
                    className="bg-gray-100 rounded-full px-[12px] py-[4px] text-gray-700 text-[12px] font-semibold flex items-center gap-[6px] select-none"
                  >
                    <span>{tag}</span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Add tag input */}
              <input 
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="+ Add a tag..."
                className="w-full bg-[#f3f0eb] border-0 rounded-[12px] px-[16px] py-[10px] text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white border-2 border-transparent focus:border-[#345b79]/30 transition-all"
              />
            </div>

            {/* Widget 4: Visibility */}
            <div className="bg-white border border-gray-100 rounded-[16px] p-[24px] flex flex-col gap-[16px] shadow-sm">
              <span className="text-[12px] font-bold text-[#1d1d1d] uppercase tracking-wider">
                Visibility
              </span>

              <div className="flex flex-col gap-[10px] w-full select-none">
                {/* Public */}
                <div 
                  onClick={() => setVisibility('Public')}
                  className={`flex gap-[16px] items-center p-[17px] rounded-[12px] border cursor-pointer transition-all ${
                    visibility === 'Public' ? "border-[#345b79]/40 bg-[#f9fafc]" : "border-[#e2e8f0] bg-white"
                  }`}
                >
                  <div className={`rounded-full size-[20px] border flex items-center justify-center shrink-0 ${
                    visibility === 'Public' ? "border-[#345b79] bg-[#345b79]" : "border-gray-300"
                  }`}>
                    {visibility === 'Public' && <div className="bg-white rounded-full size-[8px]" />}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1d1d1d]">Public</p>
                    <p className="text-[12px] text-[#64748b]">Visible to all users</p>
                  </div>
                </div>

                {/* Private */}
                <div 
                  onClick={() => setVisibility('Private')}
                  className={`flex gap-[16px] items-center p-[17px] rounded-[12px] border cursor-pointer transition-all ${
                    visibility === 'Private' ? "border-[#345b79]/40 bg-[#f9fafc]" : "border-[#e2e8f0] bg-white"
                  }`}
                >
                  <div className={`rounded-full size-[20px] border flex items-center justify-center shrink-0 ${
                    visibility === 'Private' ? "border-[#345b79] bg-[#345b79]" : "border-gray-300"
                  }`}>
                    {visibility === 'Private' && <div className="bg-white rounded-full size-[8px]" />}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1d1d1d]">Private</p>
                    <p className="text-[12px] text-[#64748b]">Only visible to you</p>
                  </div>
                </div>

                {/* Portfolio Only */}
                <div 
                  onClick={() => setVisibility('Portfolio Only')}
                  className={`flex gap-[16px] items-center p-[17px] rounded-[12px] border cursor-pointer transition-all ${
                    visibility === 'Portfolio Only' ? "border-[#345b79]/40 bg-[#f9fafc]" : "border-[#e2e8f0] bg-white"
                  }`}
                >
                  <div className={`rounded-full size-[20px] border flex items-center justify-center shrink-0 ${
                    visibility === 'Portfolio Only' ? "border-[#345b79] bg-[#345b79]" : "border-gray-300"
                  }`}>
                    {visibility === 'Portfolio Only' && <div className="bg-white rounded-full size-[8px]" />}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1d1d1d]">Portfolio Only</p>
                    <p className="text-[12px] text-[#64748b]">Visible in your portfolio</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
