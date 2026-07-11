import { useState } from 'react';
import { Link } from 'react-router';




const SRI_LANKA_DISTRICTS = [
  "Colombo, Western Province",
  "Gampaha, Western Province",
  "Kalutara, Western Province",
  "Kandy, Central Province",
  "Matale, Central Province",
  "Nuwara Eliya, Central Province",
  "Galle, Southern Province",
  "Matara, Southern Province",
  "Hambantota, Southern Province",
  "Jaffna, Northern Province",
  "Mannar, Northern Province",
  "Vavuniya, Northern Province",
  "Mullaitivu, Northern Province",
  "Kilinochchi, Northern Province",
  "Batticaloa, Eastern Province",
  "Ampara, Eastern Province",
  "Trincomalee, Eastern Province",
  "Kurunegala, North Western Province",
  "Puttalam, North Western Province",
  "Anuradhapura, North Central Province",
  "Polonnaruwa, North Central Province",
  "Badulla, Uva Province",
  "Moneragala, Uva Province",
  "Ratnapura, Sabaragamuwa Province",
  "Kegalle, Sabaragamuwa Province"
];

const RegisterPage = () => {
  const [role, setRole] = useState<'buyer' | 'agent' | 'architect' | 'construction'>('buyer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    district: 'Colombo, Western Province',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: 'EMPTY', color: 'text-gray-400', barColors: ['bg-gray-300/30', 'bg-gray-300/30', 'bg-gray-300/30', 'bg-gray-300/30'] };
    
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    if (score <= 1) {
      return {
        score,
        text: 'WEAK',
        color: 'text-red-500 font-bold',
        barColors: ['bg-red-500', 'bg-gray-300/30', 'bg-gray-300/30', 'bg-gray-300/30']
      };
    } else if (score <= 3) {
      return {
        score,
        text: 'MEDIUM',
        color: 'text-yellow-500 font-bold',
        barColors: ['bg-yellow-500', 'bg-yellow-500', 'bg-yellow-500', 'bg-gray-300/30']
      };
    } else {
      return {
        score,
        text: 'STRONG',
        color: 'text-[#16a34a] font-bold',
        barColors: ['bg-[#345b79]', 'bg-[#345b79]', 'bg-[#345b79]', 'bg-[#345b79]']
      };
    }
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address format';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{9,10}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Must be 9 or 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="w-full h-full min-h-screen flex justify-start items-stretch overflow-x-hidden">
      
      {/* LEFT SIDE HERO PANEL - Hidden on mobile/tablet, visible on desktop */}
      <div 
        className="hidden lg:flex lg:w-[499.77px] relative shrink-0 overflow-hidden" 
        data-node-id="9:3" 
        data-name="Section - LEFT SIDE: HERO OVERLAY"
      >
        <div className="absolute inset-0">
          <img alt="Background" className="w-full h-full object-cover" src={'https://images.pexels.com/photos/8134750/pexels-photo-8134750.jpeg'} />
        </div>
        <div className="absolute bg-slate-800/50 inset-0 z-10" data-node-id="9:4" data-name="Overlay" />
        
        <div 
          className="flex flex-col gap-[24px] items-start sticky top-[60px] w-full h-[calc(100vh-60px)] justify-end p-[48px] z-20" 
          data-node-id="9:5" 
          data-name="Container"
        >
          
          {/* AI Badge */}
          <div className="backdrop-blur-[6px] bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.2)] border-solid flex gap-[8px] items-center px-[17px] py-[7px] relative rounded-[9999px] shrink-0" data-node-id="9:6" data-name="AI Badge">
            <div className="bg-[#be5d3f] rounded-[9999px] shrink-0 size-[8px]" data-node-id="9:7" data-name="Background" />
            <div className="relative shrink-0" data-node-id="9:8" data-name="Container">
              <span className="text-[10px] font-bold text-[rgba(255,255,255,0.9)] tracking-[1px] uppercase whitespace-nowrap leading-[15px]" data-node-id="9:9">
                AI-POWERED PLATFORM
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-start pt-[8px] relative shrink-0 w-full" data-node-id="9:10" data-name="Heading 1">
            <div className="flex flex-col font-extrabold justify-center leading-[75px] text-[60px] text-white w-full" data-node-id="9:11">
              <p className="mb-0">Build Your</p>
              <p className="mb-0 text-[#be5d3f]">Dream</p>
              <p className="mb-0">in Sri Lanka</p>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col items-start max-w-[448px] relative shrink-0 w-full" data-node-id="9:12" data-name="Container">
            <p className="text-[18px] font-normal leading-[28px] text-[rgba(255,255,255,0.8)] w-full" data-node-id="9:13">
              Sri Lanka's premier AI-powered property and construction platform. Join thousands of buyers, architects, and builders.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-[32px] h-[100px] items-start py-[24px] relative shrink-0 w-full" data-node-id="9:14" data-name="Stats">
            <div className="flex flex-col items-start relative self-stretch shrink-0 w-[116.48px]" data-node-id="9:15" data-name="Container">
              <span className="text-[30px] font-bold text-white leading-[36px] whitespace-nowrap" data-node-id="9:17">
                12,000+
              </span>
              <span className="text-[12px] font-normal text-[rgba(255,255,255,0.6)] tracking-[1.2px] uppercase whitespace-nowrap leading-[16px]" data-node-id="9:19">
                PROPERTIES
              </span>
            </div>
            <div className="flex flex-col items-start relative self-stretch shrink-0 w-[83.5px]" data-node-id="9:20" data-name="Container">
              <span className="text-[30px] font-bold text-white leading-[36px] whitespace-nowrap" data-node-id="9:22">
                340+
              </span>
              <span className="text-[12px] font-normal text-[rgba(255,255,255,0.6)] tracking-[1.2px] uppercase whitespace-nowrap leading-[16px]" data-node-id="9:24">
                ARCHITECTS
              </span>
            </div>
            <div className="flex flex-col items-start relative self-stretch shrink-0 w-[68.41px]" data-node-id="9:25" data-name="Container">
              <span className="text-[30px] font-bold text-white leading-[36px] whitespace-nowrap" data-node-id="9:27">
                180+
              </span>
              <span className="text-[12px] font-normal text-[rgba(255,255,255,0.6)] tracking-[1.2px] uppercase whitespace-nowrap leading-[16px]" data-node-id="9:29">
                BUILDERS
              </span>
            </div>
          </div>

          {/* Testimonial Glass Card */}
          <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] border-solid flex flex-col gap-[14.75px] items-start max-w-[384px] p-[25px] relative rounded-[16px] shrink-0 w-[384px]" data-node-id="9:30" data-name="Testimonial Glass Card">
            <div className="flex items-start justify-between relative w-full" data-node-id="9:31" data-name="Container">
              <div className="flex gap-[12px] items-center relative shrink-0" data-node-id="9:32" data-name="Container">
                <div className="bg-[#9ca3af] border-2 border-[rgba(255,255,255,0.5)] border-solid flex flex-col items-start justify-center overflow-clip p-[2px] relative rounded-full shrink-0 w-[40px] h-[40px]" data-node-id="9:33">
                  <img alt="Kasun Jayawardena" className="w-full h-full object-cover rounded-full" src={'/img/kasun-jayawardena.jpg'} />
                </div>
                <div className="flex flex-col items-start relative shrink-0" data-node-id="9:35">
                  <span className="text-[14px] font-bold text-white whitespace-nowrap leading-[20px]" data-node-id="9:37">
                    Kasun Jayawardena
                  </span>
                  <span className="text-[10px] font-normal text-[rgba(255,255,255,0.6)] whitespace-nowrap leading-[15px]" data-node-id="9:39">
                    Property Buyer — Colombo
                  </span>
                </div>
              </div>
              
              {/* Stars rating */}
              <div className="flex items-center gap-[2px] h-[10.03px]" data-node-id="9:40">
                {[...Array(5)].map((_, i) => (
                  <img key={i} alt="Star" className="w-[10.52px] h-[10.03px]" src={'/svg/star.svg'} />
                ))}
              </div>
            </div>
            
            <div className="relative shrink-0 w-full" data-node-id="9:51">
              <p className="text-[14px] font-normal leading-[22.75px] text-[rgba(255,255,255,0.9)] w-full" data-node-id="9:52">
                "NexaBuild helped me find my perfect villa in Kandy within a week. The AI matching is incredibly accurate."
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex gap-[24px] h-[40px] items-start pt-[24px] relative shrink-0 w-full border-t border-white/10" data-node-id="9:53" data-name="Trust Badges">
            <span className="text-[10px] font-semibold text-[rgba(255,255,255,0.6)] tracking-[1px] uppercase whitespace-nowrap" data-node-id="9:55">
              ✓ SSL SECURED
            </span>
            <span className="text-[10px] font-semibold text-[rgba(255,255,255,0.6)] tracking-[1px] uppercase whitespace-nowrap" data-node-id="9:57">
              ✓ VERIFIED LISTINGS
            </span>
            <span className="text-[10px] font-semibold text-[rgba(255,255,255,0.6)] tracking-[1px] uppercase whitespace-nowrap" data-node-id="9:59">
              ✓ AI MATCHED
            </span>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE REGISTRATION FORM */}
      <div 
        className="w-full lg:flex-1 min-h-screen bg-[#e6e0d4] flex flex-col items-center justify-center py-12 px-6 md:px-16 overflow-y-auto"
        data-node-id="9:60"
        data-name="Section - RIGHT SIDE: REGISTRATION FORM"
      >
        <div className="w-full max-w-[672px] flex flex-col gap-[32px] items-start" data-node-id="9:61" data-name="Container">
          
          {isSuccess ? (
            /* Registration Success Screen */
            <div className="w-full bg-white rounded-2xl p-8 shadow-xl text-center flex flex-col items-center justify-center gap-6 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-[#345b79] text-3xl font-extrabold">Account Created!</h2>
              <p className="text-[#6b7280] text-base max-w-md">
                Thank you for joining NexaBuild, {formData.firstName}. Your registration as a <strong>{role}</strong> was successful.
              </p>
              <Link
                to="/login"
                className="mt-4 bg-[#345b79] hover:bg-[#25465e] py-[16px] px-8 rounded-[12px] text-white font-bold uppercase tracking-[1.4px] text-[14px] shadow-lg transition-colors duration-200"
              >
                Sign In to Your Account
              </Link>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[32px]">
              
              {/* Header Title Section */}
              <div className="flex flex-col gap-[8px] items-start w-full" data-node-id="9:62" data-name="Container">
                <div className="flex gap-[8px] items-center w-full" data-node-id="9:63" data-name="Container">
                  <div className="bg-[#be5d3f] h-[24px] w-[4px]" data-node-id="9:64" data-name="Background" />
                  <div className="flex flex-col items-start" data-node-id="9:65" data-name="Container">
                    <span className="text-[#be5d3f] text-[12px] font-bold tracking-[1.2px] uppercase whitespace-nowrap" data-node-id="9:66">
                      CREATE ACCOUNT
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-start w-full" data-node-id="9:67" data-name="Heading 2">
                  <h2 className="text-[#345b79] text-[36px] font-extrabold leading-[40px] w-full" data-node-id="9:68">
                    Join NexaBuild
                  </h2>
                </div>
                
                <div className="flex flex-col items-start w-full" data-node-id="9:69" data-name="Container">
                  <div className="text-[#6b7280] text-[16px]" data-node-id="9:70">
                    <span className="leading-[24px]">Already have an account? </span>
                    <Link to="/auth/login" className="font-bold leading-[24px] text-[#be5d3f] hover:underline">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="flex flex-col gap-[16px] items-start w-full" data-node-id="9:71" data-name="Role Selection">
                <div className="flex flex-col items-start w-full" data-node-id="9:72" data-name="Label">
                  <span className="text-[#374151] text-[14px] font-bold leading-[20px] w-full" data-node-id="9:73">
                    I am a...
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] w-full" data-node-id="9:74" data-name="Container">
                  
                  {/* Property Buyer Card */}
                  <div 
                    onClick={() => setRole('buyer')}
                    className={`bg-white content-stretch flex flex-col justify-between items-center p-[18px] rounded-[12px] h-[174px] cursor-pointer border-2 transition-all relative ${
                      role === 'buyer' ? 'border-[#345b79] shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                    data-node-id="9:75"
                    data-name="Property Buyer Card"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-[40px] h-[40px] flex items-center justify-center rounded-[8px] transition-all ${
                        role === 'buyer' ? 'bg-[rgba(52,91,121,0.1)]' : 'bg-[#f3f4f6]'
                      }`} data-node-id="9:78">
                        <img className="w-[24px] h-[24px]" src={'/svg/home.svg'} alt="Buyer" />
                      </div>
                      <span className="text-[#1f2937] text-[12px] font-bold text-center leading-[15px] whitespace-nowrap" data-node-id="9:83">
                        Property Buyer
                      </span>
                      <p className="text-[#6b7280] text-[9px] text-center leading-[11.25px]" data-node-id="9:85">
                        Find your dream property or land across SL
                      </p>
                    </div>
                    {role === 'buyer' ? (
                      <div className="bg-[#345b79] flex items-center justify-center rounded-full w-[16px] h-[16px]" data-node-id="9:87">
                        <img className="w-[12px] h-[12px]" src={'/svg/check.svg'} alt="Checked" />
                      </div>
                    ) : (
                      <div className="w-[16px] h-[16px]" />
                    )}
                  </div>

                  {/* Agent Card */}
                  <div 
                    onClick={() => setRole('agent')}
                    className={`bg-white content-stretch flex flex-col justify-between items-center p-[18px] rounded-[12px] h-[174px] cursor-pointer border-2 transition-all relative ${
                      role === 'agent' ? 'border-[#345b79] shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                    data-node-id="9:90"
                    data-name="Agent Card"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-[40px] h-[40px] flex items-center justify-center rounded-[8px] transition-all ${
                        role === 'agent' ? 'bg-[rgba(52,91,121,0.1)]' : 'bg-[#f3f4f6]'
                      }`} data-node-id="9:92">
                        <img className="w-[24px] h-[24px]" src={'/svg/agent.svg'} alt="Agent" />
                      </div>
                      <span className="text-[#1f2937] text-[12px] font-bold text-center leading-[15px] whitespace-nowrap" data-node-id="9:97">
                        Agent / Realtor
                      </span>
                      <p className="text-[#6b7280] text-[9px] text-center leading-[11.25px]" data-node-id="9:99">
                        List and manage properties for clients
                      </p>
                    </div>
                    {role === 'agent' ? (
                      <div className="bg-[#345b79] flex items-center justify-center rounded-full w-[16px] h-[16px]">
                        <img className="w-[12px] h-[12px]" src={'/svg/check.svg'} alt="Checked" />
                      </div>
                    ) : (
                      <div className="w-[16px] h-[16px]" />
                    )}
                  </div>

                  {/* Architect Card */}
                  <div 
                    onClick={() => setRole('architect')}
                    className={`bg-white content-stretch flex flex-col justify-between items-center p-[18px] rounded-[12px] h-[174px] cursor-pointer border-2 transition-all relative ${
                      role === 'architect' ? 'border-[#345b79] shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                    data-node-id="9:100"
                    data-name="Architect Card"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-[40px] h-[40px] flex items-center justify-center rounded-[8px] transition-all ${
                        role === 'architect' ? 'bg-[rgba(52,91,121,0.1)]' : 'bg-[#f3f4f6]'
                      }`} data-node-id="9:102">
                        <img className="w-[24px] h-[24px]" src={'/svg/architect.svg'} alt="Architect" />
                      </div>
                      <span className="text-[#1f2937] text-[12px] font-bold text-center leading-[15px] whitespace-nowrap" data-node-id="9:107">
                        Architect
                      </span>
                      <p className="text-[#6b7280] text-[9px] text-center leading-[11.25px]" data-node-id="9:109">
                        Showcase designs and connect with clients
                      </p>
                    </div>
                    {role === 'architect' ? (
                      <div className="bg-[#345b79] flex items-center justify-center rounded-full w-[16px] h-[16px]">
                        <img className="w-[12px] h-[12px]" src={'/svg/check.svg'} alt="Checked" />
                      </div>
                    ) : (
                      <div className="w-[16px] h-[16px]" />
                    )}
                  </div>

                  {/* Construction Card */}
                  <div 
                    onClick={() => setRole('construction')}
                    className={`bg-white content-stretch flex flex-col justify-between items-center p-[18px] rounded-[12px] h-[174px] cursor-pointer border-2 transition-all relative ${
                      role === 'construction' ? 'border-[#345b79] shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                    data-node-id="9:110"
                    data-name="Construction Card"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-[40px] h-[40px] flex items-center justify-center rounded-[8px] transition-all ${
                        role === 'construction' ? 'bg-[rgba(52,91,121,0.1)]' : 'bg-[#f3f4f6]'
                      }`} data-node-id="9:112">
                        <img className="w-[24px] h-[24px]" src={'/svg/construction.svg'} alt="Construction" />
                      </div>
                      <span className="text-[#1f2937] text-[12px] font-bold text-center leading-[15px] whitespace-nowrap" data-node-id="9:117">
                        Construction
                      </span>
                      <p className="text-[#6b7280] text-[9px] text-center leading-[11.25px]" data-node-id="9:119">
                        Offer construction services to owners
                      </p>
                    </div>
                    {role === 'construction' ? (
                      <div className="bg-[#345b79] flex items-center justify-center rounded-full w-[16px] h-[16px]">
                        <img className="w-[12px] h-[12px]" src={'/svg/check.svg'} alt="Checked" />
                      </div>
                    ) : (
                      <div className="w-[16px] h-[16px]" />
                    )}
                  </div>

                </div>
              </div>

              {/* Registration Form inputs */}
              <div className="flex flex-col gap-[24px] items-start w-full" data-node-id="9:120" data-name="Registration Form">
                
                {/* First Name & Last Name */}
                <div className="flex flex-col md:flex-row gap-[24px] w-full" data-node-id="9:121" data-name="Container">
                  
                  {/* First Name */}
                  <div className="flex flex-col gap-[8px] items-start flex-1" data-node-id="9:122" data-name="Container">
                    <div className="flex flex-col items-start w-full" data-node-id="9:123" data-name="Label">
                      <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full" data-node-id="9:124">
                        First Name
                      </label>
                    </div>
                    <div className="w-full" data-node-id="9:125" data-name="Input">
                      <input
                        type="text"
                        placeholder="Kasun"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`bg-white w-full px-[16px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border outline-none text-[#1e293b] text-[14px] leading-[20px] transition-colors ${
                          errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-[8px] items-start flex-1" data-node-id="9:128" data-name="Container">
                    <div className="flex flex-col items-start w-full" data-node-id="9:129" data-name="Label">
                      <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full" data-node-id="9:130">
                        Last Name
                      </label>
                    </div>
                    <div className="w-full" data-node-id="9:131" data-name="Input">
                      <input
                        type="text"
                        placeholder="Jayawardena"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`bg-white w-full px-[16px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border outline-none text-[#1e293b] text-[14px] leading-[20px] transition-colors ${
                          errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-[11px] mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-[8px] items-start w-full" data-node-id="9:134" data-name="Container">
                  <div className="flex flex-col items-start w-full" data-node-id="9:135" data-name="Label">
                    <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full" data-node-id="9:136">
                      Email Address
                    </label>
                  </div>
                  <div className="w-full relative" data-node-id="9:137" data-name="Container">
                    <input
                      type="email"
                      placeholder="kasun@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`bg-white w-full pl-[40px] pr-[16px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border outline-none text-[#1e293b] text-[14px] leading-[20px] transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                      }`}
                    />
                    <div className="absolute bottom-0 flex items-center left-0 pl-[12px] top-0 pointer-events-none" data-node-id="9:141">
                      <div className="w-[16px] h-[16px]" data-node-id="9:142">
                        <img className="w-full h-full object-contain" src={'/svg/email.svg'} alt="Email Icon" />
                      </div>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-[8px] items-start w-full" data-node-id="9:144" data-name="Container">
                  <div className="flex flex-col items-start w-full" data-node-id="9:145" data-name="Label">
                    <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full" data-node-id="9:146">
                      Phone Number
                    </label>
                  </div>
                  <div className="flex gap-[8px] items-start w-full" data-node-id="9:147" data-name="Container">
                    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-gray-200 flex items-center pb-[12.5px] pt-[11.5px] px-[12px] rounded-[8px] shrink-0 h-[46px]" data-node-id="9:148">
                      <span className="text-[#6b7280] text-[14px] font-bold leading-[20px] whitespace-nowrap" data-node-id="9:149">
                        +94
                      </span>
                    </div>
                    <div className="relative flex-1" data-node-id="9:150">
                      <input
                        type="text"
                        placeholder="077 123 4567"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className={`bg-white w-full pl-[48px] pr-[16px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border outline-none text-[#1e293b] text-[14px] leading-[20px] h-[46px] transition-colors ${
                          errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                        }`}
                      />
                      <div className="absolute border-[#f3f4f6] border-r bottom-0 flex items-center left-0 pl-[12px] pr-[13px] top-0 pointer-events-none" data-node-id="9:154">
                        <div className="w-[16px] h-[16px]" data-node-id="9:155">
                          <img className="w-full h-full object-contain" src={'/svg/phone.svg'} alt="Phone Icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Password & Confirm Password */}
                <div className="flex flex-col md:flex-row gap-[24px] w-full" data-node-id="9:157" data-name="Container">
                  
                  {/* Password */}
                  <div className="flex flex-col gap-[8px] items-start flex-1" data-node-id="9:158" data-name="Container">
                    <div className="flex flex-col items-start w-full" data-node-id="9:159" data-name="Label">
                      <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full" data-node-id="9:160">
                        Password
                      </label>
                    </div>
                    <div className="w-full relative" data-node-id="9:161" data-name="Container">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`bg-white w-full pl-[16px] pr-[40px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border outline-none text-[#1e293b] text-[14px] leading-[20px] transition-colors ${
                          errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute bottom-0 flex items-center pr-[12px] py-[14px] right-0 top-0 cursor-pointer" 
                        data-node-id="9:165"
                      >
                        <div className="w-[16px] h-[16px]" data-node-id="9:166">
                          <img className={`w-full h-full object-contain ${showPassword ? 'opacity-100' : 'opacity-60'}`} src={'/svg/eye.svg'} alt="Eye Icon" />
                        </div>
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-[8px] items-start flex-1" data-node-id="9:169" data-name="Container">
                    <div className="flex flex-col items-start w-full" data-node-id="9:170" data-name="Label">
                      <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full" data-node-id="9:171">
                        Confirm Password
                      </label>
                    </div>
                    <div className="w-full relative" data-node-id="9:172" data-name="Container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`bg-white w-full pl-[16px] pr-[40px] py-[12px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border outline-none text-[#1e293b] text-[14px] leading-[20px] transition-colors ${
                          errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute bottom-0 flex items-center pr-[12px] py-[14px] right-0 top-0 cursor-pointer"
                        data-node-id="9:176"
                      >
                        <div className="w-[16px] h-[16px]" data-node-id="9:177">
                          <img className={`w-full h-full object-contain ${showConfirmPassword ? 'opacity-100' : 'opacity-60'}`} src={'/svg/eye.svg'} alt="Eye Icon" />
                        </div>
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                </div>

                {/* District / City Dropdown */}
                <div className="flex flex-col gap-[8px] items-start w-full relative" data-node-id="9:180" data-name="Container">
                  <div className="flex flex-col items-start w-full" data-node-id="9:181" data-name="Label">
                    <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full" data-node-id="9:182">
                      District / City
                    </label>
                  </div>
                  <div className="w-full relative" data-node-id="9:183" data-name="Container">
                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="bg-white border border-gray-200 cursor-pointer drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between pl-[40px] pr-[40px] py-[12px] rounded-[8px] w-full text-[14px] text-[#1e293b] select-none min-h-[46px]"
                      data-node-id="9:184"
                    >
                      <span>{formData.district}</span>
                    </div>
                    <div className="absolute bottom-0 flex items-center left-0 pl-[12px] top-0 pointer-events-none" data-node-id="9:190">
                      <div className="w-[16px] h-[16px]" data-node-id="9:191">
                        <img className="w-full h-full object-contain" src={'/svg/location.svg'} alt="Location Pin" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 flex items-center px-[16px] right-0 top-0 pointer-events-none" data-node-id="9:194">
                      <div className="w-[16px] h-[16px]" data-node-id="9:195">
                        <img className={`w-full h-full object-contain transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} src={'/svg/dropdown.svg'} alt="Dropdown Chevron" />
                      </div>
                    </div>

                    {/* Custom drop-down list */}
                    {isDropdownOpen && (
                      <div className="absolute top-[48px] left-0 w-full max-h-[220px] overflow-y-auto bg-white border border-gray-200 rounded-[8px] shadow-lg z-50 py-1">
                        {SRI_LANKA_DISTRICTS.map((district) => (
                          <div
                            key={district}
                            onClick={() => {
                              handleInputChange('district', district);
                              setIsDropdownOpen(false);
                            }}
                            className={`px-4 py-2 hover:bg-gray-100 text-[14px] cursor-pointer text-[#1e293b] ${
                              formData.district === district ? 'font-bold bg-gray-50' : 'font-normal'
                            }`}
                          >
                            {district}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Strength Indicator */}
                <div className="flex flex-col gap-[8px] items-start w-full" data-node-id="9:197" data-name="Password Strength">
                  <div className="flex items-center justify-between w-full" data-node-id="9:198" data-name="Container">
                    <span className="text-[#6b7280] text-[10px] font-bold uppercase tracking-wider" data-node-id="9:200">
                      PASSWORD STRENGTH
                    </span>
                    <span className={`text-[10px] uppercase ${pwdStrength.color}`} data-node-id="9:202">
                      {pwdStrength.text}
                    </span>
                  </div>
                  
                  {/* Strength Bar Segments */}
                  <div className="flex gap-[4px] h-[6px] w-full mt-1" data-node-id="9:203" data-name="Container">
                    {pwdStrength.barColors.map((colorClass, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-full rounded-[9999px] ${colorClass} transition-all duration-300`}
                        data-node-id={`9:20${4+idx}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Terms of Service agreement */}
                <div className="flex flex-col w-full">
                  <div className="flex gap-[12px] items-start pb-[16px] w-full select-none" data-node-id="9:208" data-name="Terms">
                    <button
                      type="button"
                      onClick={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
                      className={`flex flex-col items-center justify-center overflow-clip relative rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 size-[20px] cursor-pointer border ${
                        formData.agreeToTerms ? 'bg-[#345b79] border-[#345b79]' : 'bg-white border-gray-300'
                      }`}
                      data-node-id="9:209"
                      data-name="Input"
                    >
                      {formData.agreeToTerms && (
                        <div className="relative shrink-0 size-[20px]" data-node-id="9:210">
                          <img className="absolute block inset-0 max-w-none size-full" src={'/svg/checkMark.svg'} alt="Checked" />
                        </div>
                      )}
                    </button>
                    
                    <div className="flex flex-col items-start flex-1" data-node-id="9:212" data-name="Label">
                      <span className="text-[#4b5563] text-[12px] leading-[16px]" data-node-id="9:213">
                        I agree to the{' '}
                        <a href="#" className="font-bold text-[#345b79] hover:underline" onClick={(e) => e.preventDefault()}>
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="font-bold text-[#345b79] hover:underline" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>{' '}
                        of NexaBuild (Pvt) Ltd, Sri Lanka.
                      </span>
                    </div>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-[11px] mt-[-8px] mb-4">{errors.agreeToTerms}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#345b79] hover:bg-[#25465e] flex items-center justify-center py-[16px] rounded-[12px] w-full text-white text-[14px] font-bold tracking-[1.4px] uppercase whitespace-nowrap transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0px_10px_15px_-3px_rgba(52,91,121,0.3),0px_4px_6px_-4px_rgba(52,91,121,0.3)] cursor-pointer"
                  data-node-id="9:214"
                  data-name="Action → Button"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <span>CREATE MY ACCOUNT</span>
                  )}
                </button>

              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
};

export default RegisterPage;