import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface ForgotPasswordPageData {
  heroHeadingLine1?: string;
  heroHeadingLine2?: string;
  heroHeadingLine3?: string;
  heroSubheading?: string;
  securityNoticeTitle?: string;
  securityNoticeDesc?: string;
}

export interface ForgotPasswordPageProps {
  data?: ForgotPasswordPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onSubmitEmail?: (email: string) => void;
  onResendEmail?: (email: string) => void;
}

// ─── Main Component Implementation ──────────────────────────────────────────

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  data = null,
  isLoading = false,
  error = null,
  onSubmitEmail,
  onResendEmail
}) => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Fallbacks for data props
  const heroHeadingLine1 = data?.heroHeadingLine1 || "Secure &";
  const heroHeadingLine2 = data?.heroHeadingLine2 || "Trusted";
  const heroHeadingLine3 = data?.heroHeadingLine3 || "Platform";
  const heroSubheading = data?.heroSubheading || "Your account security is our priority. Reset your password in seconds and get back to building your dream.";
  const securityNoticeTitle = data?.securityNoticeTitle || "Bank-Level Security";
  const securityNoticeDesc = data?.securityNoticeDesc || "All password resets are encrypted end-to-end and verified through your registered email address.";

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Email address is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Invalid email address format');
      return;
    }

    if (onSubmitEmail) {
      onSubmitEmail(email);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setResendTimer(60);
      }, 1200);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0 || isSubmitting || isLoading) return;
    if (onResendEmail) {
      onResendEmail(email);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setResendTimer(60);
      }, 1000);
    }
  };

  return (
    <div 
      className="w-full h-full min-h-screen flex justify-start items-stretch overflow-x-hidden"
      data-node-id="9:218"
      data-name="04 Forget Password"
    >
      
      {/* LEFT HERO SECTION */}
      <div 
        className="hidden lg:flex lg:w-[499px] xl:w-[540px] relative shrink-0 overflow-hidden" 
        data-node-id="9:220" 
        data-name="Left Hero Section"
      >
        <div className="absolute inset-0">
          <img alt="Modern Architectural Home" className="w-full h-full object-cover" src="https://images.pexels.com/photos/8134750/pexels-photo-8134750.jpeg" />
        </div>
        <div className="absolute bg-slate-800/50 inset-0 z-10" data-node-id="9:222" data-name="Gradient" />
        
        {/* Sticky Left Content */}
        <div 
          className="flex flex-col justify-between sticky top-0 w-full h-screen p-[40px] xl:p-[48px] z-20 overflow-y-auto" 
          data-node-id="9:223" 
          data-name="Container"
        >
          {/* Logo on Image */}
          <div className="flex flex-col items-start w-full" data-node-id="9:224" data-name="Logo on Image:margin">
            <div className="flex gap-[12px] items-center w-full" data-node-id="9:225" data-name="Logo on Image">
              <div className="bg-[#be5d3f] flex items-center justify-center rounded-[8px] shrink-0 size-[40px]" data-node-id="9:226" data-name="Background">
                <span className="font-bold text-[20px] text-white leading-[28px]" data-node-id="9:227">
                  N
                </span>
              </div>
              <div className="flex flex-col items-start" data-node-id="9:228" data-name="Container">
                <span className="font-bold text-[28px] text-white tracking-[-0.75px] leading-[34px]" data-node-id="9:229">
                  NexaBuild
                </span>
              </div>
            </div>
          </div>

          {/* Heading and Description */}
          <div className="flex flex-col items-start w-full my-6">
            <div className="flex flex-col items-start pb-[20px] w-full" data-node-id="9:230" data-name="Heading 1:margin">
              <h1 className="font-extrabold text-[44px] xl:text-[48px] text-white leading-[1.15] w-full" data-node-id="9:232">
                <p className="mb-0">{heroHeadingLine1}</p>
                <p className="mb-0 text-[#be5d3f]">{heroHeadingLine2}</p>
                <p className="mb-0">{heroHeadingLine3}</p>
              </h1>
            </div>
            <div className="max-w-[448px] w-full" data-node-id="9:233" data-name="Margin">
              <p className="text-white/90 text-[15px] xl:text-[16px] font-normal leading-[26px]" data-node-id="9:235">
                {heroSubheading}
              </p>
            </div>
          </div>

          {/* Glassmorphic card */}
          <div className="flex flex-col items-start max-w-[384px] w-full mb-6" data-node-id="9:236" data-name="Glassmorphic Card:margin">
            <div 
              className="backdrop-blur-[6px] bg-white/10 border border-white/20 flex gap-[16px] items-start p-[20px] rounded-[16px] w-full shadow-lg" 
              data-node-id="9:237" 
              data-name="Glassmorphic Card"
            >
              <div className="bg-white/20 rounded-[8px] p-[8px] shrink-0" data-node-id="9:238" data-name="Overlay">
                <img alt="Shield Icon" className="size-[24px] object-contain" src="/svg/shield.svg" />
              </div>
              <div className="flex-1" data-node-id="9:241" data-name="Container">
                <div className="flex flex-col gap-[4px] items-start w-full">
                  <h4 className="font-bold text-[16px] text-white leading-[24px]" data-node-id="9:243">
                    {securityNoticeTitle}
                  </h4>
                  <p className="text-[12px] font-normal text-white/80 leading-[16px]" data-node-id="9:245">
                    {securityNoticeDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance tags */}
          <div className="flex gap-[20px] items-start opacity-70 w-full pt-4 border-t border-white/10" data-node-id="9:246" data-name="Compliance Tags">
            <div className="flex gap-[6px] items-center" data-node-id="9:247">
              <img alt="SSL Key" className="size-[12px] object-contain filter invert" src="/svg/lock.svg" />
              <span className="font-semibold text-[10px] text-white tracking-[1px] uppercase leading-[15px]">
                SSL ENCRYPTED
              </span>
            </div>
            <div className="flex gap-[6px] items-center" data-node-id="9:251">
              <img alt="Email Icon" className="size-[12px] object-contain filter invert" src="/svg/email.svg" />
              <span className="font-semibold text-[10px] text-white tracking-[1px] uppercase leading-[15px]">
                EMAIL VERIFIED
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT RESET SECTION */}
      <div 
        className="w-full lg:flex-1 min-h-screen bg-[#e6e0d4] flex flex-col items-center justify-center p-[24px] sm:p-[32px] overflow-y-auto"
        data-node-id="9:260"
        data-name="Right Reset Section"
      >
        <div className="w-full max-w-[448px] flex flex-col gap-[24px] items-start" data-node-id="9:261" data-name="Container">
          
          {/* Back to Login Link */}
          <Link 
            to="/auth/login"
            className="flex gap-[8px] items-center hover:opacity-85 duration-150 select-none group" 
            data-node-id="9:262" 
            data-name="Back Link"
          >
            <img alt="Back Arrow" className="size-[16px] object-contain transition-transform group-hover:-translate-x-1" src="/svg/arrow-send.svg" style={{ transform: 'rotate(180deg)' }} />
            <span className="text-[#64748b] text-[14px] font-medium leading-[20px]" data-node-id="9:265">
              Back to Login
            </span>
          </Link>

          {/* Global Error Banner */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2 shadow-sm">
              <img src="/svg/info.svg" alt="Error" className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess ? (
            /* Success confirmation panel */
            <div className="w-full bg-white rounded-[24px] p-8 shadow-xl text-center flex flex-col items-center justify-center gap-6 border border-gray-100 animate-fadeIn">
              <div className="w-16 h-16 bg-[#345b79]/10 rounded-full flex items-center justify-center">
                <img src="/svg/email.svg" alt="Email Sent" className="size-8" />
              </div>
              <h2 className="text-[#345b79] text-2xl font-bold">Reset Link Sent</h2>
              <p className="text-[#64748b] text-[14px] leading-relaxed">
                We have sent a secure recovery link to <strong className="text-gray-800">{email}</strong>. Please follow the instructions in the email to reset your password.
              </p>
              
              <div className="w-full h-px border-t border-slate-100 my-2" />

              <button
                type="button"
                disabled={resendTimer > 0 || isSubmitting || isLoading}
                onClick={handleResend}
                className={`py-[14px] px-6 rounded-[12px] w-full text-white font-bold text-[14px] transition-colors ${
                  resendTimer > 0 || isSubmitting || isLoading
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#be5d3f] hover:bg-[#a64e33] cursor-pointer shadow-md'
                }`}
              >
                {(isSubmitting || isLoading) ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Resending...</span>
                  </span>
                ) : resendTimer > 0 ? (
                  `Resend link in ${resendTimer}s`
                ) : (
                  'Resend Reset Link'
                )}
              </button>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[24px]">
              
              {/* Form Heading */}
              <div className="flex flex-col gap-[16px] items-start pt-[4px] w-full" data-node-id="9:266" data-name="Form Heading">
                <div 
                  className="bg-[#345b79]/10 border border-[#345b79]/20 flex items-center justify-center rounded-[16px] size-[56px]" 
                  data-node-id="9:267"
                >
                  <img alt="Recovery Key Badge" className="size-[28px] object-contain" src="/svg/sparks-settings-icon.svg" />
                </div>
                <div className="flex flex-col gap-[4px] items-start w-full" data-node-id="9:270">
                  <div className="flex gap-[8px] items-center w-full" data-node-id="9:271">
                    <div className="bg-[#be5d3f] h-[18px] w-[4px]" data-node-id="9:272" />
                    <span className="font-bold text-[#be5d3f] text-[11px] tracking-[1.1px] uppercase whitespace-nowrap" data-node-id="9:274">
                      ACCOUNT RECOVERY
                    </span>
                  </div>
                  <div className="flex flex-col items-start w-full mt-1" data-node-id="9:275">
                    <h2 className="font-extrabold text-[#1e293b] text-[32px] sm:text-[36px] w-full leading-[40px]" data-node-id="9:276">
                      Forgot Password?
                    </h2>
                  </div>
                  <div className="flex flex-col items-start pt-[4px] w-full" data-node-id="9:277">
                    <p className="text-[#64748b] text-[15px] font-normal leading-[24px] w-full" data-node-id="9:278">
                      No worries. Enter your registered email and we'll send you a secure reset link instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex flex-col gap-[20px] items-start w-full" data-node-id="9:279" data-name="Form Content">
                
                {/* Email Input wrapper */}
                <div className="w-full flex flex-col gap-[6px]" data-node-id="9:280">
                  <label className="font-bold text-[#334155] text-[13px] leading-[18px] select-none" data-node-id="9:281">
                    Email Address
                  </label>
                  <div className="w-full relative" data-node-id="9:282">
                    <input
                      type="email"
                      placeholder="Enter your registered email address"
                      value={email}
                      disabled={isLoading || isSubmitting}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formError) setFormError('');
                      }}
                      className={`bg-white border w-full pl-[44px] pr-[16px] py-[14px] rounded-[12px] shadow-sm outline-none text-[15px] text-gray-800 transition-colors ${
                        formError ? 'border-red-500 focus:border-red-500' : 'border-[#e2e8f0] focus:border-[#345b79]'
                      }`}
                      data-node-id="9:283"
                    />
                    <img alt="Email Icon" className="size-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" src="/svg/email.svg" />
                  </div>
                  {formError ? (
                    <p className="text-red-500 text-[11px] mt-1">{formError}</p>
                  ) : (
                    <div className="flex gap-[6px] items-center mt-1" data-node-id="9:289">
                      <img alt="Info Bullet" className="size-[12px] object-contain" src="/svg/info.svg" />
                      <span className="text-[#64748b] text-[11px] font-normal leading-[16.5px]" data-node-id="9:292">
                        Use the email address linked to your NexaBuild account
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="bg-[#345b79] hover:bg-[#25465e] flex gap-[8px] items-center justify-center py-[15px] rounded-[12px] w-full text-white text-[15px] font-bold whitespace-nowrap transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed shadow-md cursor-pointer mt-1"
                  data-node-id="9:293"
                >
                  {(isLoading || isSubmitting) ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending link...</span>
                    </div>
                  ) : (
                    <>
                      <img alt="Send Link Icon" className="size-[18px] object-contain filter invert" src="/svg/arrow-send.svg" />
                      <span data-node-id="9:297">Send Reset Link</span>
                    </>
                  )}
                </button>

                {/* Divider line */}
                <div className="w-full h-px bg-[#cbd5e1] my-1" data-node-id="9:298" />

              </div>

              {/* Informational Warning box */}
              <div 
                className="bg-white/60 border border-[#e2e8f0] flex gap-[12px] items-start p-[16px] rounded-[16px] w-full select-none shadow-sm" 
                data-node-id="9:301"
              >
                <img alt="Clock Icon" className="size-[20px] object-contain shrink-0 mt-0.5" src="/svg/clock.svg" />
                <p className="text-[#475569] text-[13px] font-normal leading-[18px]">
                  The reset link is valid for <span className="font-bold text-[#1e293b]">15 minutes</span>. Check your spam folder if you do not see the email within 2 minutes.
                </p>
              </div>

              {/* Links and Redirects */}
              <div className="flex flex-col gap-[10px] items-start w-full select-none" data-node-id="9:306" data-name="Footer Links">
                <div className="flex flex-col items-center w-full">
                  <span className="text-[#64748b] text-[14px] font-normal leading-[20px]">
                    Remembered your password?{' '}
                    <Link to="/auth/login" className="font-bold text-[#345b79] hover:underline">
                      Sign In
                    </Link>
                  </span>
                </div>
                <div className="flex flex-col items-center w-full">
                  <span className="text-[#64748b] text-[14px] font-normal leading-[20px]">
                    Don't have an account?{' '}
                    <Link to="/auth/register" className="font-bold text-[#be5d3f] hover:underline">
                      Register Free
                    </Link>
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

export default ForgotPasswordPage;