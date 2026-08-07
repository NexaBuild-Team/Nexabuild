import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { authService } from '../../services/authService';

// ─── Backend Interfaces ─────────────────────────────────────────────────────

export interface HeroStatItem {
  value: string;
  label: string;
}

export interface TestimonialData {
  avatarUrl: string;
  quote: string;
  authorName: string;
  authorLocation: string;
}

export interface LoginPageData {
  heroTagline?: string;
  heroHeadingLine1?: string;
  heroHeadingLine2?: string;
  heroSubheading?: string;
  stats?: HeroStatItem[];
  testimonial?: TestimonialData;
}

export interface LoginPageProps {
  data?: LoginPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onSubmit?: (credentials: { email: string; password: string; rememberMe: boolean }) => void;
}

// ─── Main Component Implementation ──────────────────────────────────────────

const LoginPage: React.FC<LoginPageProps> = ({
  data = null,
  isLoading = false,
  error = null,
  onSubmit
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation & Internal Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fallback defaults for Hero Banner
  const heroTagline = data?.heroTagline || "AI-POWERED INTELLIGENCE";
  const heroSubheading = data?.heroSubheading || "Connect with verified architects, builders, and property listings — all powered by AI.";
  const stats = data?.stats || [
    { value: "12,400+", label: "Properties Listed" },
    { value: "340+", label: "Architecture Designs" },
    { value: "200+", label: "Verified Builders" }
  ];
  const testimonial = data?.testimonial || {
    avatarUrl: "https://images.pexels.com/photos/8134750/pexels-photo-8134750.jpeg",
    quote: '"NexaBuild helped me find my dream plot in Kandy and connect with an incredible architect — all in one place."',
    authorName: "Nimali Fernando",
    authorLocation: "Kandy"
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (onSubmit) {
      onSubmit({ email, password, rememberMe });
    } else {
      setIsSubmitting(true);
      setErrors({});
      try {
        await authService.login({ email, password });
        setIsSubmitting(false);
        navigate('/');
      } catch (err: any) {
        setIsSubmitting(false);
        setErrors({
          auth: err.response?.data?.message || 'Invalid email or password. Please try again.',
        });
      }
    }
  };

  return (
    <div 
      className="w-full h-full min-h-screen flex justify-start items-stretch overflow-x-hidden"
      data-node-id="4:55"
      data-name="Main Split-Screen Container"
    >
      
      {/* LEFT SECTION: Architectural Hero Banner */}
      <div 
        className="hidden lg:flex lg:w-[58%] xl:w-[55%] relative overflow-hidden shrink-0"
        data-node-id="4:56"
        data-name="Left Section: Architectural Hero (Hero/Branding)"
      >
        <div className="absolute inset-0 z-0" data-node-id="4:57" data-name="Hero Image">
          <img 
            alt="Modern luxury architecture in Sri Lanka" 
            className="w-full h-full object-cover" 
            src="https://images.pexels.com/photos/8134750/pexels-photo-8134750.jpeg" 
          />
          <div 
            className="absolute bg-slate-800/50 inset-0" 
            data-node-id="4:59" 
            data-name="Overlay Gradient for Readability" 
          />
        </div>

        <div 
          className="flex flex-col items-start justify-between sticky top-0 w-full h-screen pb-[48px] pt-[80px] px-[48px] xl:px-[64px] relative z-10 overflow-y-auto" 
          data-node-id="4:60" 
          data-name="Content Container"
        >
          
          {/* Tagline & Heading */}
          <div className="flex flex-col gap-[20px] items-start max-w-[576px] w-full" data-node-id="4:61" data-name="Hero Text">
            <div className="flex gap-[12px] items-center w-full" data-node-id="4:62" data-name="Container">
              <div className="bg-[#be5d3f] h-[32px] w-[4px]" data-node-id="4:63" data-name="Background" />
              <div className="flex flex-col items-start" data-node-id="4:64" data-name="Container">
                <span className="text-[12px] font-bold text-white tracking-[1.2px] uppercase whitespace-nowrap leading-[12px]" data-node-id="4:65">
                  {heroTagline}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start w-full" data-node-id="4:66" data-name="Heading 1">
              <h1 className="flex flex-col font-bold text-[48px] xl:text-[56px] text-white tracking-[-1.12px] w-full leading-[1.1]" data-node-id="4:67">
                <p className="mb-0">Sri Lanka's Premier</p>
                <p className="mb-0">Property &</p>
                <p className="mb-0">Construction</p>
                <p className="mb-0">Platform</p>
              </h1>
            </div>

            <div className="flex flex-col items-start pt-[4px] w-full" data-node-id="4:68" data-name="Container">
              <p className="text-[16px] xl:text-[18px] font-normal leading-[28px] text-white/90 w-full" data-node-id="4:69">
                {heroSubheading}
              </p>
            </div>
          </div>

          {/* Stats and Testimonial */}
          <div className="flex flex-col gap-[32px] items-start w-full mt-6" data-node-id="4:70" data-name="Footer Stats & Testimonial">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-[16px] xl:gap-[24px] w-full" data-node-id="4:71" data-name="Stats Grid">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="backdrop-blur-[12px] bg-white/10 border border-white/20 flex flex-col gap-[4px] items-start p-[20px] rounded-[12px] shadow-lg" 
                >
                  <span className="text-[16px] font-bold text-white leading-[24px]">{stat.value}</span>
                  <span className="text-[12px] font-bold text-white/70 leading-[16px]">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Testimonial Glass Block */}
            <div 
              className="backdrop-blur-[12px] bg-white/10 border border-white/20 flex gap-[20px] items-center max-w-[672px] p-[24px] rounded-[16px] shadow-lg w-full" 
              data-node-id="4:87" 
              data-name="Testimonial Glass Block"
            >
              <div className="shrink-0" data-node-id="4:88">
                <div className="border-2 border-white/30 rounded-full size-[56px] overflow-hidden">
                  <img alt={testimonial.authorName} className="size-full object-cover" src={testimonial.avatarUrl} />
                </div>
              </div>
              <div className="flex flex-col gap-[6px] items-start flex-1" data-node-id="4:90">
                <p className="text-[15px] font-normal leading-[22px] text-white" data-node-id="4:92">
                  {testimonial.quote}
                </p>
                <span className="text-[11px] font-bold text-white/60 leading-[15px]" data-node-id="4:94">
                  {testimonial.authorName}, {testimonial.authorLocation}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Login Form */}
      <div 
        className="w-full lg:w-[42%] xl:w-[45%] min-h-screen bg-[#e6e0d4] flex flex-col items-center justify-center px-6 md:px-[48px] xl:px-[64px] py-[48px] overflow-y-auto"
        data-node-id="4:95"
        data-name="Right Section: Login Form"
      >
        <div className="w-full max-w-[448px] flex flex-col gap-[8px] items-start" data-node-id="4:96" data-name="Container">
          
          {/* Server Error Alert Banner */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2 mb-4 shadow-sm">
              <img src="/svg/info.svg" alt="Error" className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

            <form onSubmit={handleFormSubmit} className="w-full flex flex-col">
              
              {/* Header Title */}
              <div className="flex flex-col items-start w-full" data-node-id="4:97" data-name="Heading 3 - Form Header">
                <h3 className="text-[#1b1b1b] text-[20px] font-bold leading-[28px]" data-node-id="4:98">
                  Welcome Back
                </h3>
              </div>
              <div className="flex flex-col items-start w-full mt-1" data-node-id="4:99" data-name="Container">
                <p className="text-[#42474d] text-[15px] font-normal leading-[22px]" data-node-id="4:100">
                  Sign in to access your NexaBuild account
                </p>
              </div>

              {/* Separator line */}
              <div className="w-full h-px border-t border-[#c2c7ce] mt-6" data-node-id="4:103" />

              {/* Auth error message */}
              {errors.auth && (
                <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-4">
                  {errors.auth}
                </div>
              )}

              {/* Inputs Form */}
              <div className="flex flex-col gap-[20px] items-start w-full mt-6" data-node-id="4:104" data-name="Login Form">
                
                {/* Email Address */}
                <div className="flex flex-col gap-[8px] items-start w-full" data-node-id="4:105" data-name="Container">
                  <label className="text-[#42474d] text-[12px] tracking-[1.2px] uppercase font-bold leading-[12px]" data-node-id="4:107">
                    EMAIL ADDRESS
                  </label>
                  <div className="w-full relative" data-node-id="4:108" data-name="Container">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      disabled={isLoading || isSubmitting}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className={`bg-white border w-full pl-[49px] pr-[17px] py-[16px] rounded-[12px] outline-none text-[15px] text-gray-800 transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#c2c7ce] focus:border-[#345b79]'
                      }`}
                    />
                    <div className="absolute bottom-[50%] translate-y-1/2 flex flex-col items-start left-[16px] pointer-events-none" data-node-id="4:112">
                      <img alt="Email Icon" className="w-[20px] h-[20px] object-contain" src="/svg/email.svg" />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-[8px] items-start w-full" data-node-id="4:114" data-name="Container">
                  <label className="text-[#42474d] text-[12px] tracking-[1.2px] uppercase font-bold leading-[12px]" data-node-id="4:116">
                    PASSWORD
                  </label>
                  <div className="w-full relative" data-node-id="4:117" data-name="Container">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      disabled={isLoading || isSubmitting}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      className={`bg-white border w-full pl-[49px] pr-[49px] py-[16px] rounded-[12px] outline-none text-[15px] text-gray-800 transition-colors ${
                        errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#c2c7ce] focus:border-[#345b79]'
                      }`}
                    />
                    <div className="absolute bottom-[50%] translate-y-1/2 flex flex-col items-start left-[16px] pointer-events-none" data-node-id="4:121">
                      <img alt="Lock Icon" className="w-[18px] h-[20px] object-contain" src="/svg/lock.svg" />
                    </div>
                    <button
                      type="button"
                      disabled={isLoading || isSubmitting}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute bottom-[50%] translate-y-1/2 flex flex-col items-center justify-center right-[16px] cursor-pointer"
                      data-node-id="4:123"
                    >
                      <img alt="Eye Icon" className={`w-[20px] h-[20px] object-contain ${showPassword ? 'opacity-100' : 'opacity-60'}`} src="/svg/eye.svg" />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-between pr-[0.01px] w-full mt-1" data-node-id="4:126" data-name="Container">
                  <div className="flex gap-[8px] items-center select-none" data-node-id="4:127" data-name="Label">
                    <button
                      type="button"
                      disabled={isLoading || isSubmitting}
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`relative rounded-[4px] shrink-0 size-[20px] cursor-pointer border flex items-center justify-center transition-colors ${
                        rememberMe ? 'bg-[#345b79] border-[#345b79]' : 'bg-white border-[#c2c7ce]'
                      }`}
                      data-node-id="4:128"
                    >
                      {rememberMe && (
                        <img className="w-[12px] h-[12px] object-contain" src="/svg/checkMark.svg" alt="Checked" />
                      )}
                    </button>
                    <span 
                      onClick={() => setRememberMe(!rememberMe)}
                      className="text-[#42474d] text-[14px] font-normal cursor-pointer leading-[20px]" 
                      data-node-id="4:130"
                    >
                      Remember me
                    </span>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-[#be5d3f] text-[14px] font-semibold hover:underline leading-[20px]"
                    data-node-id="4:132"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="bg-[#345b79] hover:bg-[#25465e] flex gap-[8px] items-center justify-center py-[15px] rounded-[12px] w-full text-white text-[15px] font-bold whitespace-nowrap transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed shadow-md cursor-pointer mt-2"
                  data-node-id="4:133"
                >
                  {(isLoading || isSubmitting) ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <>
                      <img alt="Sign In Arrow" className="w-[16px] h-[16px] object-contain" src="/svg/sign-in.svg" />
                      <span data-node-id="4:137">Sign In</span>
                    </>
                  )}
                </button>

              </div>

              {/* Registration Prompt Link */}
              <div className="flex items-start justify-center pb-[3px] gap-2 pt-[28px] w-full select-none" data-node-id="4:138" data-name="Container">
                <span className="text-[#42474d] text-[14px] font-normal leading-[20px]" data-node-id="4:139">
                  Don't have an account?{' '}
                </span>
                <Link 
                  to="/auth/register" 
                  className="text-[#be5d3f] text-[14px] font-bold hover:underline inline-flex items-center gap-[4px] leading-[20px]"
                  data-node-id="4:140"
                >
                  <span>Create one free</span>
                  <img alt="Arrow Right" className="w-[14px] h-[14px] object-contain" src="/svg/arrowRight.svg" />
                </Link>
              </div>

              {/* Footer Trust Badge */}
              <div className="flex flex-col items-center opacity-60 pt-[32px] w-full" data-node-id="4:143" data-name="Footer Trust Badge">
                <div className="flex gap-[8px] items-center" data-node-id="4:144">
                  <img alt="SSL Shield" className="w-[15px] h-[18px] object-contain" src="/svg/shield.svg" />
                  <span className="text-[#1b1b1b] text-[10px] font-bold uppercase whitespace-nowrap leading-[15px]" data-node-id="4:148">
                    256-BIT SSL ENCRYPTED · YOUR DATA IS SAFE
                  </span>
                </div>
              </div>

            </form>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;