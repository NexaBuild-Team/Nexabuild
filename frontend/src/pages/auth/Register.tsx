import React, { useState } from 'react';
import { Link } from 'react-router';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export type UserRole = 'buyer' | 'agent' | 'architect' | 'construction';

export interface RegisterFormData {
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  district: string;
  agreeToTerms: boolean;
}

export interface RegisterPageData {
  heroTagline?: string;
  heroHeadingLine1?: string;
  heroHeadingLine2?: string;
  heroHeadingLine3?: string;
  heroSubheading?: string;
  testimonial?: {
    avatarUrl: string;
    quote: string;
    authorName: string;
    authorLocation: string;
  };
}

export interface RegisterPageProps {
  data?: RegisterPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onSubmit?: (formData: RegisterFormData) => void;
}

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

const RegisterPage: React.FC<RegisterPageProps> = ({
  data = null,
  isLoading = false,
  error = null,
  onSubmit
}) => {
  const [role, setRole] = useState<UserRole>('buyer');
  const [formData, setFormData] = useState<RegisterFormData>({
    role: 'buyer',
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

  // Fallbacks for data props
  const heroTagline = data?.heroTagline || "AI-POWERED PLATFORM";
  const heroHeadingLine1 = data?.heroHeadingLine1 || "Build Your";
  const heroHeadingLine2 = data?.heroHeadingLine2 || "Dream";
  const heroHeadingLine3 = data?.heroHeadingLine3 || "in Sri Lanka";
  const heroSubheading = data?.heroSubheading || "Sri Lanka's premier AI-powered property and construction platform. Join thousands of buyers, architects, and builders.";
  const testimonial = data?.testimonial || {
    avatarUrl: "/hero_property.png",
    quote: '"NexaBuild helped me find my perfect villa in Kandy within a week. The AI matching is incredibly accurate."',
    authorName: "Kasun Jayawardena",
    authorLocation: "Property Buyer — Colombo"
  };

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

  const handleInputChange = (field: keyof RegisterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setFormData(prev => ({ ...prev, role: selectedRole }));
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (onSubmit) {
      onSubmit(formData);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1200);
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex justify-start items-stretch overflow-x-hidden">
      
      {/* LEFT SIDE HERO PANEL - Hidden on mobile/tablet, visible on desktop */}
      <div 
        className="hidden lg:flex lg:w-[499px] xl:w-[540px] relative shrink-0 overflow-hidden" 
        data-node-id="9:3" 
        data-name="Section - LEFT SIDE: HERO OVERLAY"
      >
        <div className="absolute inset-0 z-0">
          <img alt="Background" className="w-full h-full object-cover" src="https://images.pexels.com/photos/8134750/pexels-photo-8134750.jpeg" />
        </div>
        <div className="absolute bg-slate-800/50 inset-0 z-10" data-node-id="9:4" data-name="Overlay" />
        
        <div 
          className="flex flex-col gap-[20px] items-start sticky top-0 w-full h-screen justify-end p-[40px] xl:p-[48px] z-20 overflow-y-auto" 
          data-node-id="9:5" 
          data-name="Container"
        >
          
          {/* AI Badge */}
          <div className="backdrop-blur-[6px] bg-black/40 border border-white/20 flex gap-[8px] items-center px-[17px] py-[7px] relative rounded-full shrink-0" data-node-id="9:6" data-name="AI Badge">
            <div className="bg-[#be5d3f] rounded-full shrink-0 size-[8px]" data-node-id="9:7" data-name="Background" />
            <span className="text-[10px] font-bold text-white/90 tracking-[1px] uppercase whitespace-nowrap leading-[15px]" data-node-id="9:9">
              {heroTagline}
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-node-id="9:10" data-name="Heading 1">
            <h1 className="flex flex-col font-extrabold text-[48px] xl:text-[54px] leading-[1.15] text-white w-full" data-node-id="9:11">
              <p className="mb-0">{heroHeadingLine1}</p>
              <p className="mb-0 text-[#be5d3f]">{heroHeadingLine2}</p>
              <p className="mb-0">{heroHeadingLine3}</p>
            </h1>
          </div>

          {/* Description */}
          <div className="flex flex-col items-start max-w-[448px] relative shrink-0 w-full" data-node-id="9:12" data-name="Container">
            <p className="text-[15px] xl:text-[16px] font-normal leading-[26px] text-white/80 w-full" data-node-id="9:13">
              {heroSubheading}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-[24px] xl:gap-[32px] items-start py-[16px] relative shrink-0 w-full border-t border-b border-white/10" data-node-id="9:14" data-name="Stats">
            <div className="flex flex-col items-start shrink-0" data-node-id="9:15">
              <span className="text-[26px] xl:text-[28px] font-bold text-white leading-[32px]">12,000+</span>
              <span className="text-[11px] font-semibold text-white/60 tracking-[1.2px] uppercase">PROPERTIES</span>
            </div>
            <div className="flex flex-col items-start shrink-0" data-node-id="9:20">
              <span className="text-[26px] xl:text-[28px] font-bold text-white leading-[32px]">340+</span>
              <span className="text-[11px] font-semibold text-white/60 tracking-[1.2px] uppercase">ARCHITECTS</span>
            </div>
            <div className="flex flex-col items-start shrink-0" data-node-id="9:25">
              <span className="text-[26px] xl:text-[28px] font-bold text-white leading-[32px]">180+</span>
              <span className="text-[11px] font-semibold text-white/60 tracking-[1.2px] uppercase">BUILDERS</span>
            </div>
          </div>

          {/* Testimonial Glass Card */}
          <div className="backdrop-blur-[6px] bg-white/10 border border-white/20 flex flex-col gap-[12px] items-start p-[20px] relative rounded-[16px] shrink-0 w-full max-w-[384px]" data-node-id="9:30" data-name="Testimonial Glass Card">
            <div className="flex items-center justify-between relative w-full" data-node-id="9:31">
              <div className="flex gap-[12px] items-center shrink-0" data-node-id="9:32">
                <div className="border-2 border-white/50 rounded-full overflow-hidden size-[40px] shrink-0">
                  <img alt={testimonial.authorName} className="size-full object-cover" src={testimonial.avatarUrl} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[14px] font-bold text-white leading-[20px]">{testimonial.authorName}</span>
                  <span className="text-[10px] text-white/60 leading-[15px]">{testimonial.authorLocation}</span>
                </div>
              </div>
              <div className="flex items-center gap-[2px]">
                {[...Array(5)].map((_, i) => (
                  <img key={i} alt="Star" className="size-[12px]" src="/svg/star.svg" />
                ))}
              </div>
            </div>
            <p className="text-[13px] font-normal leading-[20px] text-white/90">
              {testimonial.quote}
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE REGISTRATION FORM */}
      <div 
        className="w-full lg:flex-1 min-h-screen bg-[#e6e0d4] flex flex-col items-center justify-center py-10 px-4 sm:px-8 lg:px-12 overflow-y-auto"
        data-node-id="9:60"
        data-name="Section - RIGHT SIDE: REGISTRATION FORM"
      >
        <div className="w-full max-w-[672px] flex flex-col gap-[24px] items-start" data-node-id="9:61" data-name="Container">
          
          {/* Global Backend Error Alert */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2 shadow-sm">
              <img src="/svg/info.svg" alt="Error" className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess ? (
            /* Registration Success Screen */
            <div className="w-full bg-white rounded-2xl p-8 shadow-xl text-center flex flex-col items-center justify-center gap-6 border border-gray-100 animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <img src="/svg/checkMark.svg" alt="Success" className="size-8" />
              </div>
              <h2 className="text-[#345b79] text-3xl font-extrabold">Account Created!</h2>
              <p className="text-[#6b7280] text-base max-w-md">
                Thank you for joining NexaBuild, {formData.firstName}. Your registration as a <strong>{role}</strong> was successful.
              </p>
              <Link
                to="/auth/login"
                className="mt-4 bg-[#345b79] hover:bg-[#25465e] py-[16px] px-8 rounded-[12px] text-white font-bold uppercase tracking-[1.4px] text-[14px] shadow-lg transition-colors duration-200"
              >
                Sign In to Your Account
              </Link>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-[24px]">
              
              {/* Header Title Section */}
              <div className="flex flex-col gap-[6px] items-start w-full" data-node-id="9:62" data-name="Container">
                <div className="flex gap-[8px] items-center w-full" data-node-id="9:63" data-name="Container">
                  <div className="bg-[#be5d3f] h-[20px] w-[4px]" data-node-id="9:64" data-name="Background" />
                  <span className="text-[#be5d3f] text-[12px] font-bold tracking-[1.2px] uppercase">
                    CREATE ACCOUNT
                  </span>
                </div>
                
                <h2 className="text-[#345b79] text-[32px] sm:text-[36px] font-extrabold leading-[40px] w-full" data-node-id="9:68">
                  Join NexaBuild
                </h2>
                
                <div className="text-[#6b7280] text-[15px]" data-node-id="9:70">
                  <span>Already have an account? </span>
                  <Link to="/auth/login" className="font-bold text-[#be5d3f] hover:underline">
                    Sign In
                  </Link>
                </div>
              </div>

              {/* Role Selection */}
              <div className="flex flex-col gap-[12px] items-start w-full" data-node-id="9:71" data-name="Role Selection">
                <span className="text-[#374151] text-[14px] font-bold leading-[20px] w-full">
                  I am a...
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px] w-full" data-node-id="9:74" data-name="Container">
                  
                  {/* Property Buyer Card */}
                  <div 
                    onClick={() => handleRoleSelect('buyer')}
                    className={`bg-white flex flex-col justify-between items-center p-[14px] sm:p-[16px] rounded-[12px] min-h-[160px] cursor-pointer border-2 transition-all relative ${
                      role === 'buyer' ? 'border-[#345b79] shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`size-[38px] flex items-center justify-center rounded-[8px] transition-all ${
                        role === 'buyer' ? 'bg-[#345b79]/10' : 'bg-[#f3f4f6]'
                      }`}>
                        <img className="size-[20px]" src="/svg/home.svg" alt="Buyer" />
                      </div>
                      <span className="text-[#1f2937] text-[12px] font-bold text-center leading-[15px]">
                        Property Buyer
                      </span>
                      <p className="text-[#6b7280] text-[9px] text-center leading-[12px]">
                        Find your dream property or land across SL
                      </p>
                    </div>
                    {role === 'buyer' ? (
                      <div className="bg-[#345b79] flex items-center justify-center rounded-full size-[16px] mt-1">
                        <img className="size-[10px] filter invert" src="/svg/check.svg" alt="Checked" />
                      </div>
                    ) : (
                      <div className="size-[16px] mt-1" />
                    )}
                  </div>

                  {/* Agent Card */}
                  <div 
                    onClick={() => handleRoleSelect('agent')}
                    className={`bg-white flex flex-col justify-between items-center p-[14px] sm:p-[16px] rounded-[12px] min-h-[160px] cursor-pointer border-2 transition-all relative ${
                      role === 'agent' ? 'border-[#345b79] shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`size-[38px] flex items-center justify-center rounded-[8px] transition-all ${
                        role === 'agent' ? 'bg-[#345b79]/10' : 'bg-[#f3f4f6]'
                      }`}>
                        <img className="size-[20px]" src="/svg/agent.svg" alt="Agent" />
                      </div>
                      <span className="text-[#1f2937] text-[12px] font-bold text-center leading-[15px]">
                        Agent / Realtor
                      </span>
                      <p className="text-[#6b7280] text-[9px] text-center leading-[12px]">
                        List and manage properties for clients
                      </p>
                    </div>
                    {role === 'agent' ? (
                      <div className="bg-[#345b79] flex items-center justify-center rounded-full size-[16px] mt-1">
                        <img className="size-[10px] filter invert" src="/svg/check.svg" alt="Checked" />
                      </div>
                    ) : (
                      <div className="size-[16px] mt-1" />
                    )}
                  </div>

                  {/* Architect Card */}
                  <div 
                    onClick={() => handleRoleSelect('architect')}
                    className={`bg-white flex flex-col justify-between items-center p-[14px] sm:p-[16px] rounded-[12px] min-h-[160px] cursor-pointer border-2 transition-all relative ${
                      role === 'architect' ? 'border-[#345b79] shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`size-[38px] flex items-center justify-center rounded-[8px] transition-all ${
                        role === 'architect' ? 'bg-[#345b79]/10' : 'bg-[#f3f4f6]'
                      }`}>
                        <img className="size-[20px]" src="/svg/architect.svg" alt="Architect" />
                      </div>
                      <span className="text-[#1f2937] text-[12px] font-bold text-center leading-[15px]">
                        Architect
                      </span>
                      <p className="text-[#6b7280] text-[9px] text-center leading-[12px]">
                        Showcase designs and connect with clients
                      </p>
                    </div>
                    {role === 'architect' ? (
                      <div className="bg-[#345b79] flex items-center justify-center rounded-full size-[16px] mt-1">
                        <img className="size-[10px] filter invert" src="/svg/check.svg" alt="Checked" />
                      </div>
                    ) : (
                      <div className="size-[16px] mt-1" />
                    )}
                  </div>

                  {/* Construction Card */}
                  <div 
                    onClick={() => handleRoleSelect('construction')}
                    className={`bg-white flex flex-col justify-between items-center p-[14px] sm:p-[16px] rounded-[12px] min-h-[160px] cursor-pointer border-2 transition-all relative ${
                      role === 'construction' ? 'border-[#345b79] shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`size-[38px] flex items-center justify-center rounded-[8px] transition-all ${
                        role === 'construction' ? 'bg-[#345b79]/10' : 'bg-[#f3f4f6]'
                      }`}>
                        <img className="size-[20px]" src="/svg/construction.svg" alt="Construction" />
                      </div>
                      <span className="text-[#1f2937] text-[12px] font-bold text-center leading-[15px]">
                        Construction
                      </span>
                      <p className="text-[#6b7280] text-[9px] text-center leading-[12px]">
                        Offer construction services to owners
                      </p>
                    </div>
                    {role === 'construction' ? (
                      <div className="bg-[#345b79] flex items-center justify-center rounded-full size-[16px] mt-1">
                        <img className="size-[10px] filter invert" src="/svg/check.svg" alt="Checked" />
                      </div>
                    ) : (
                      <div className="size-[16px] mt-1" />
                    )}
                  </div>

                </div>
              </div>

              {/* Registration Form inputs */}
              <div className="flex flex-col gap-[18px] items-start w-full" data-node-id="9:120" data-name="Registration Form">
                
                {/* First Name & Last Name */}
                <div className="flex flex-col sm:flex-row gap-[16px] w-full">
                  
                  {/* First Name */}
                  <div className="flex flex-col gap-[6px] items-start flex-1">
                    <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full">
                      First Name
                    </label>
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="Kasun"
                        value={formData.firstName}
                        disabled={isLoading || isSubmitting}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`bg-white w-full px-[14px] py-[11px] rounded-[8px] shadow-sm border outline-none text-[#1e293b] text-[14px] transition-colors ${
                          errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-[6px] items-start flex-1">
                    <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full">
                      Last Name
                    </label>
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="Jayawardena"
                        value={formData.lastName}
                        disabled={isLoading || isSubmitting}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`bg-white w-full px-[14px] py-[11px] rounded-[8px] shadow-sm border outline-none text-[#1e293b] text-[14px] transition-colors ${
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
                <div className="flex flex-col gap-[6px] items-start w-full">
                  <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full">
                    Email Address
                  </label>
                  <div className="w-full relative">
                    <input
                      type="email"
                      placeholder="kasun@example.com"
                      value={formData.email}
                      disabled={isLoading || isSubmitting}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`bg-white w-full pl-[38px] pr-[14px] py-[11px] rounded-[8px] shadow-sm border outline-none text-[#1e293b] text-[14px] transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                      }`}
                    />
                    <img className="size-[16px] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" src="/svg/email.svg" alt="Email Icon" />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-[6px] items-start w-full">
                  <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full">
                    Phone Number
                  </label>
                  <div className="flex gap-[8px] items-start w-full">
                    <div className="bg-white border border-gray-200 flex items-center px-[12px] rounded-[8px] shrink-0 h-[44px]">
                      <span className="text-[#6b7280] text-[14px] font-bold">
                        +94
                      </span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="077 123 4567"
                        value={formData.phoneNumber}
                        disabled={isLoading || isSubmitting}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className={`bg-white w-full pl-[38px] pr-[14px] py-[11px] rounded-[8px] shadow-sm border outline-none text-[#1e293b] text-[14px] h-[44px] transition-colors ${
                          errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                        }`}
                      />
                      <img className="size-[16px] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" src="/svg/phone.svg" alt="Phone Icon" />
                    </div>
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Password & Confirm Password */}
                <div className="flex flex-col sm:flex-row gap-[16px] w-full">
                  
                  {/* Password */}
                  <div className="flex flex-col gap-[6px] items-start flex-1">
                    <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full">
                      Password
                    </label>
                    <div className="w-full relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.password}
                        disabled={isLoading || isSubmitting}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`bg-white w-full pl-[14px] pr-[38px] py-[11px] rounded-[8px] shadow-sm border outline-none text-[#1e293b] text-[14px] transition-colors ${
                          errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                        }`}
                      />
                      <button
                        type="button"
                        disabled={isLoading || isSubmitting}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        <img className={`size-[16px] ${showPassword ? 'opacity-100' : 'opacity-60'}`} src="/svg/eye.svg" alt="Eye Icon" />
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-[6px] items-start flex-1">
                    <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full">
                      Confirm Password
                    </label>
                    <div className="w-full relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.confirmPassword}
                        disabled={isLoading || isSubmitting}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`bg-white w-full pl-[14px] pr-[38px] py-[11px] rounded-[8px] shadow-sm border outline-none text-[#1e293b] text-[14px] transition-colors ${
                          errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#345b79]'
                        }`}
                      />
                      <button
                        type="button"
                        disabled={isLoading || isSubmitting}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        <img className={`size-[16px] ${showConfirmPassword ? 'opacity-100' : 'opacity-60'}`} src="/svg/eye.svg" alt="Eye Icon" />
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                </div>

                {/* District / City Dropdown */}
                <div className="flex flex-col gap-[6px] items-start w-full relative">
                  <label className="text-[#374151] text-[12px] font-bold leading-[16px] w-full">
                    District / City
                  </label>
                  <div className="w-full relative">
                    <div
                      onClick={() => !isLoading && !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                      className="bg-white border border-gray-200 cursor-pointer shadow-sm flex items-center justify-between pl-[38px] pr-[38px] py-[11px] rounded-[8px] w-full text-[14px] text-[#1e293b] select-none min-h-[44px]"
                    >
                      <span>{formData.district}</span>
                    </div>
                    <img className="size-[16px] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" src="/svg/location.svg" alt="Location Pin" />
                    <img className={`size-[16px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} src="/svg/dropdown.svg" alt="Dropdown Chevron" />

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-[48px] left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-200 rounded-[8px] shadow-lg z-50 py-1">
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
                <div className="flex flex-col gap-[6px] items-start w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[#6b7280] text-[10px] font-bold uppercase tracking-wider">
                      PASSWORD STRENGTH
                    </span>
                    <span className={`text-[10px] uppercase ${pwdStrength.color}`}>
                      {pwdStrength.text}
                    </span>
                  </div>
                  
                  <div className="flex gap-[4px] h-[5px] w-full">
                    {pwdStrength.barColors.map((colorClass, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-full rounded-full ${colorClass} transition-all duration-300`}
                      />
                    ))}
                  </div>
                </div>

                {/* Terms of Service agreement */}
                <div className="flex flex-col w-full mt-1">
                  <div className="flex gap-[10px] items-start w-full select-none">
                    <button
                      type="button"
                      disabled={isLoading || isSubmitting}
                      onClick={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
                      className={`flex items-center justify-center rounded-[4px] border shrink-0 size-[18px] cursor-pointer mt-0.5 transition-colors ${
                        formData.agreeToTerms ? 'bg-[#345b79] border-[#345b79]' : 'bg-white border-gray-300'
                      }`}
                    >
                      {formData.agreeToTerms && (
                        <img className="size-[10px] filter invert" src="/svg/checkMark.svg" alt="Checked" />
                      )}
                    </button>
                    
                    <span className="text-[#4b5563] text-[12px] leading-[16px]">
                      I agree to the{' '}
                      <a href="#" className="font-bold text-[#345b79] hover:underline" onClick={(e) => e.preventDefault()}>
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="font-bold text-[#345b79] hover:underline" onClick={(e) => e.preventDefault()}>
                        Privacy Policy
                      </a>{' '}
                      of NexaBuild (Pvt) Ltd.
                    </span>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.agreeToTerms}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="bg-[#345b79] hover:bg-[#25465e] flex items-center justify-center py-[14px] rounded-[12px] w-full text-white text-[14px] font-bold tracking-[1.2px] uppercase transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md cursor-pointer mt-2"
                >
                  {(isLoading || isSubmitting) ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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