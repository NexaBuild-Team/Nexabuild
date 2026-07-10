import { useState } from 'react';
import { Link } from 'react-router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
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
            src={'https://images.pexels.com/photos/8134750/pexels-photo-8134750.jpeg'} 
          />
          <div 
            className="absolute bg-slate-800/50 inset-0" 
            data-node-id="4:59" 
            data-name="Overlay Gradient for Readability" 
          />
        </div>

        <div 
          className="flex flex-col items-start justify-between sticky top-[60px] w-full h-[calc(100vh-60px)] pb-[48px] pt-[128px] px-[64px] relative z-10" 
          data-node-id="4:60" 
          data-name="Content Container"
        >
          
          {/* Tagline & Heading */}
          <div className="flex flex-col gap-[23.4px] items-start max-w-[576px] w-full" data-node-id="4:61" data-name="Hero Text">
            <div className="flex gap-[12px] items-center w-full" data-node-id="4:62" data-name="Container">
              <div className="bg-[#be5d3f] h-[32px] w-[4px]" data-node-id="4:63" data-name="Background" />
              <div className="flex flex-col items-start" data-node-id="4:64" data-name="Container">
                <span className="text-[12px] font-bold text-white tracking-[1.2px] uppercase whitespace-nowrap leading-[12px]" data-node-id="4:65">
                  AI-POWERED INTELLIGENCE
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start w-full" data-node-id="4:66" data-name="Heading 1">
              <h1 className="flex flex-col font-bold text-[56px] text-white tracking-[-1.12px] w-full leading-[61.6px]" data-node-id="4:67">
                <p className="mb-0">Sri Lanka's Premier</p>
                <p className="mb-0">Property &</p>
                <p className="mb-0">Construction</p>
                <p className="mb-0">Platform</p>
              </h1>
            </div>

            <div className="flex flex-col items-start pt-[7.725px] w-full" data-node-id="4:68" data-name="Container">
              <p className="text-[18px] font-normal leading-[29.25px] text-[rgba(255,255,255,0.9)] w-full" data-node-id="4:69">
                Connect with verified architects, builders, and property listings — all powered by AI.
              </p>
            </div>
          </div>

          {/* Stats and Testimonial */}
          <div className="flex flex-col gap-[48px] items-start w-full" data-node-id="4:70" data-name="Footer Stats & Testimonial">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-[24px] h-[94px] w-full" data-node-id="4:71" data-name="Stats Grid">
              <div 
                className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.2)] border-solid flex flex-col gap-[4px] items-start p-[25px] rounded-[12px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)]" 
                data-node-id="4:72"
              >
                <span className="text-[16px] font-normal text-white leading-[24px]" data-node-id="4:74">12,400+</span>
                <span className="text-[12px] font-bold text-[rgba(255,255,255,0.7)] leading-[16px]" data-node-id="4:76">Properties Listed</span>
              </div>
              <div 
                className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.2)] border-solid flex flex-col gap-[4px] items-start p-[25px] rounded-[12px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)]" 
                data-node-id="4:77"
              >
                <span className="text-[16px] font-normal text-white leading-[24px]" data-node-id="4:79">340+</span>
                <span className="text-[12px] font-bold text-[rgba(255,255,255,0.7)] leading-[16px]" data-node-id="4:81">Architecture Designs</span>
              </div>
              <div 
                className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.2)] border-solid flex flex-col gap-[4px] items-start p-[25px] rounded-[12px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)]" 
                data-node-id="4:82"
              >
                <span className="text-[16px] font-normal text-white leading-[24px]" data-node-id="4:84">200+</span>
                <span className="text-[12px] font-bold text-[rgba(255,255,255,0.7)] leading-[16px]" data-node-id="4:86">Verified Builders</span>
              </div>
            </div>

            {/* Testimonial Glass Block */}
            <div 
              className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.2)] border-solid flex gap-[24px] items-center max-w-[672px] p-[33px] rounded-[16px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] w-full" 
              data-node-id="4:87" 
              data-name="Testimonial Glass Block"
            >
              <div className="shrink-0" data-node-id="4:88">
                <div className="border-2 border-[rgba(255,255,255,0.3)] border-solid rounded-full w-[56px] h-[56px] overflow-hidden">
                  <img alt="Nimali Fernando" className="w-[179%] h-full max-w-none object-cover translate-x-[-15%]" src={'https://images.pexels.com/photos/8134750/pexels-photo-8134750.jpeg'} />
                </div>
              </div>
              <div className="flex flex-col gap-[8px] items-start flex-1" data-node-id="4:90">
                <p className="text-[16px] font-normal leading-[22px] text-white" data-node-id="4:92">
                  "NexaBuild helped me find my dream plot in Kandy and connect with an incredible architect — all in one place."
                </p>
                <span className="text-[10px] font-bold text-[rgba(255,255,255,0.6)] leading-[15px]" data-node-id="4:94">
                  Nimali Fernando, Kandy
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Login Form */}
      <div 
        className="w-full lg:w-[42%] xl:w-[45%] min-h-screen bg-[#e6e0d4] flex flex-col items-center justify-center px-6 md:px-[64px] py-[48px] overflow-y-auto"
        data-node-id="4:95"
        data-name="Right Section: Login Form"
      >
        <div className="w-full max-w-[448px] flex flex-col gap-[8px] items-start" data-node-id="4:96" data-name="Container">
          
          {isSuccess ? (
            /* Login Success Toast */
            <div className="w-full bg-white rounded-2xl p-8 shadow-xl text-center flex flex-col items-center justify-center gap-6 border border-gray-100 animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-[#345b79] text-2xl font-bold">Welcome Back!</h2>
              <p className="text-[#42474d] text-sm">
                Successfully signed into account <strong>{email}</strong>.
              </p>
              <Link
                to="/"
                className="mt-2 bg-[#345b79] hover:bg-[#25465e] py-[14px] px-8 rounded-[12px] text-white font-bold uppercase tracking-[1.4px] text-[13px] shadow-lg transition-colors duration-200"
              >
                Go to Homepage
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col">
              
              {/* Header Title */}
              <div className="flex flex-col items-start w-full" data-node-id="4:97" data-name="Heading 3 - Form Header">
                <h3 className="text-[#1b1b1b] text-[16px] font-normal leading-[24px]" data-node-id="4:98">
                  Welcome Back
                </h3>
              </div>
              <div className="flex flex-col items-start w-full mt-1" data-node-id="4:99" data-name="Container">
                <p className="text-[#42474d] text-[16px] font-normal leading-[24px]" data-node-id="4:100">
                  Sign in to access your NexaBuild account
                </p>
              </div>

              {/* Separator line */}
              <div className="w-full h-px border-t border-[#c2c7ce] mt-6" data-node-id="4:103" />

              {/* Inputs Form */}
              <div className="flex flex-col gap-[24px] items-start w-full mt-6" data-node-id="4:104" data-name="Login Form">
                
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className={`bg-white border w-full pl-[49px] pr-[17px] py-[18px] rounded-[12px] outline-none text-[16px] text-gray-800 transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#c2c7ce] focus:border-[#345b79]'
                      }`}
                    />
                    <div className="absolute bottom-[50%] translate-y-1/2 flex flex-col items-start left-[16px] pointer-events-none" data-node-id="4:112">
                      <img alt="Email Icon" className="w-[22px] h-[22px] object-contain" src={'/svg/email.svg'} />
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
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      className={`bg-white border w-full pl-[49px] pr-[49px] py-[18px] rounded-[12px] outline-none text-[16px] text-gray-800 transition-colors ${
                        errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#c2c7ce] focus:border-[#345b79]'
                      }`}
                    />
                    <div className="absolute bottom-[50%] translate-y-1/2 flex flex-col items-start left-[16px] pointer-events-none" data-node-id="4:121">
                      <img alt="Lock Icon" className="w-[20px] h-[22px] object-contain" src={'/svg/lock.svg'} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute bottom-[50%] translate-y-1/2 flex flex-col items-center justify-center pb-[6px] right-[16px] cursor-pointer"
                      data-node-id="4:123"
                    >
                      <img alt="Eye Icon" className={`w-[20px] h-[20px] object-contain ${showPassword ? 'opacity-100' : 'opacity-65'}`} src={'/svg/eye.svg'} />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-between pr-[0.01px] w-full mt-2" data-node-id="4:126" data-name="Container">
                  <div className="flex gap-[8px] items-center select-none" data-node-id="4:127" data-name="Label">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`relative rounded-[4px] shrink-0 size-[20px] cursor-pointer border flex items-center justify-center transition-colors ${
                        rememberMe ? 'bg-[#345b79] border-[#345b79]' : 'bg-white border-[#c2c7ce]'
                      }`}
                      data-node-id="4:128"
                    >
                      {rememberMe && (
                        <img className="w-[12px] h-[12px] object-contain" src={'/svg/checkMark.svg'} alt="Checked" />
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
                  disabled={isSubmitting}
                  className="bg-[#345b79] hover:bg-[#25465e] flex gap-[7.99px] items-center justify-center py-[16px] rounded-[12px] w-full text-white text-[16px] font-bold whitespace-nowrap transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed shadow-[0px_10px_15px_-3px_rgba(52,91,121,0.2),0px_4px_6px_-4px_rgba(52,91,121,0.2)] cursor-pointer mt-2"
                  data-node-id="4:133"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <>
                      <img alt="Sign In Arrow" className="w-[17px] h-[17px] object-contain" src={'/svg/sign-in.svg'} />
                      <span data-node-id="4:137">Sign In</span>
                    </>
                  )}
                </button>

              </div>

              {/* Registration Prompt Link */}
              <div className="flex items-start justify-center pb-[3.72px] gap-2 pt-[32.28px] w-full select-none" data-node-id="4:138" data-name="Container">
                <span className="text-[#42474d] text-[14px] font-normal leading-[20px]" data-node-id="4:139">
                  Don't have an account?{' '}
                </span>
                <Link 
                  to="/register" 
                  className="text-[#be5d3f] text-[14px] font-bold hover:underline inline-flex items-center gap-[4px] leading-[20px]"
                  data-node-id="4:140"
                >
                  <span> Create one free</span>
                  <img alt="Arrow Right" className="w-[15px] h-[15px] object-contain" src={'/svg/arrowRight.svg'} />
                </Link>
              </div>

              {/* Footer Trust Badge */}
              <div className="flex flex-col items-center opacity-60 pt-[40px] w-full" data-node-id="4:143" data-name="Footer Trust Badge">
                <div className="flex gap-[7.99px] items-center" data-node-id="4:144">
                  <img alt="SSL Shield" className="w-[15px] h-[18.94px] object-contain" src={'/svg/shield.svg'} />
                  <span className="text-[#1b1b1b] text-[10px] font-bold uppercase whitespace-nowrap leading-[15px]" data-node-id="4:148">
                    256-BIT SSL ENCRYPTED · YOUR DATA IS SAFE
                  </span>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>

    </div>
  );
};

export default LoginPage;