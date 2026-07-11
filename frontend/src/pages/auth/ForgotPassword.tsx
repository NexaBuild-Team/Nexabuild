import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email address format');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setResendTimer(60);
    }, 1500);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setResendTimer(60);
    }, 1200);
  };

  return (
    <div 
      className="w-full h-full min-h-screen flex justify-start items-stretch overflow-x-hidden"
      data-node-id="9:218"
      data-name="04 Forget Password"
    >
      
      {/* LEFT HERO SECTION */}
      <div 
        className="hidden lg:flex lg:w-[499.77px] relative shrink-0 overflow-hidden" 
        data-node-id="9:220" 
        data-name="Left Hero Section"
      >
        <div className="absolute inset-0">
          <img alt="Modern Architectural Home" className="w-full h-full object-cover" src={'https://images.pexels.com/photos/8134750/pexels-photo-8134750.jpeg'} />
        </div>
        <div className="absolute bg-slate-800/50 inset-0 z-10" data-node-id="9:222" data-name="Gradient" />
        
        {/* Sticky Left Content */}
        <div 
          className="flex flex-col justify-between sticky top-[60px] w-full h-[calc(100vh-60px)] p-[48px] z-20" 
          data-node-id="9:223" 
          data-name="Container"
        >
          {/* Logo on Image */}
          <div className="flex flex-col items-start w-full" data-node-id="9:224" data-name="Logo on Image:margin">
            <div className="flex gap-[12px] items-center w-full" data-node-id="9:225" data-name="Logo on Image">
              <div className="bg-[#be5d3f] flex flex-col items-start p-[8px] rounded-[8px] shrink-0" data-node-id="9:226" data-name="Background">
                <span className="font-bold text-[20px] text-white leading-[28px]" data-node-id="9:227">
                  N
                </span>
              </div>
              <div className="flex flex-col items-start" data-node-id="9:228" data-name="Container">
                <span className="font-bold text-[30px] text-white tracking-[-0.75px] leading-[36px]" data-node-id="9:229">
                  NexaBuild
                </span>
              </div>
            </div>
          </div>

          {/* Heading and Description */}
          <div className="flex flex-col items-start w-full">
            <div className="flex flex-col items-start pb-[24px] w-full" data-node-id="9:230" data-name="Heading 1:margin">
              <h1 className="font-extrabold text-[48px] text-white leading-[60px] w-full" data-node-id="9:232">
                <p className="mb-0">Secure &</p>
                <p className="mb-0">Trusted</p>
                <p className="mb-0">Platform</p>
              </h1>
            </div>
            <div className="max-w-[448px] w-full" data-node-id="9:233" data-name="Margin">
              <p className="text-[#f1f5f9] text-[18px] font-normal leading-[29.25px]" data-node-id="9:235">
                Your account security is our priority. Reset your password in seconds and get back to building your dream.
              </p>
            </div>
          </div>

          {/* Glassmorphic card */}
          <div className="flex flex-col items-start max-w-[384px] w-full" data-node-id="9:236" data-name="Glassmorphic Card:margin">
            <div 
              className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] border-solid flex gap-[16px] items-start p-[25px] rounded-[16px] w-full shadow-lg" 
              data-node-id="9:237" 
              data-name="Glassmorphic Card"
            >
              <div className="bg-[rgba(255,255,255,0.2)] rounded-[8px] p-[8px]" data-node-id="9:238" data-name="Overlay">
                <img alt="Shield Icon" className="w-[24px] h-[24px] object-contain" src={'/svg/shield-tick.svg'} />
              </div>
              <div className="flex-1" data-node-id="9:241" data-name="Container">
                <div className="flex flex-col gap-[4px] items-start w-full">
                  <h4 className="font-bold text-[18px] text-white leading-[28px]" data-node-id="9:243">
                    Bank-Level Security
                  </h4>
                  <p className="text-[12px] font-normal text-[rgba(255,255,255,0.8)] leading-[16px]" data-node-id="9:245">
                    All password resets are encrypted end-to-end and verified through your registered email address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance tags */}
          <div className="flex gap-[24px] items-start opacity-70 w-full" data-node-id="9:246" data-name="Compliance Tags">
            <div className="flex gap-[6px] items-center" data-node-id="9:247">
              <img alt="SSL Key" className="w-[12px] h-[12px] object-contain" src={'/svg/lock-footer.svg'} />
              <span className="font-semibold text-[10px] text-white tracking-[1px] uppercase leading-[15px]">
                SSL ENCRYPTED
              </span>
            </div>
            <div className="flex gap-[6px] items-center" data-node-id="9:251">
              <img alt="Email Icon" className="w-[12px] h-[12px] object-contain" src={'/svg/email-footer.svg'} />
              <span className="font-semibold text-[10px] text-white tracking-[1px] uppercase leading-[15px]">
                EMAIL VERIFIED
              </span>
            </div>
            <div className="flex gap-[6px] items-center" data-node-id="9:256">
              <img alt="PDPA Icon" className="w-[12px] h-[12px] object-contain" src={'/svg/pdpa-footer.svg'} />
              <span className="font-semibold text-[10px] text-white tracking-[1px] uppercase leading-[15px]">
                PDPA COMPLIANT
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT RESET SECTION */}
      <div 
        className="w-full lg:flex-1 min-h-screen bg-[#e6e0d4] flex flex-col items-center justify-center p-[32px] overflow-y-auto"
        data-node-id="9:260"
        data-name="Right Reset Section"
      >
        <div className="w-full max-w-[448px] flex flex-col gap-[32px] items-start" data-node-id="9:261" data-name="Container">
          
          {/* Back to Login Link */}
          <Link 
            to="/auth/login"
            className="flex gap-[8px] items-center hover:opacity-85 duration-150 select-none group" 
            data-node-id="9:262" 
            data-name="Back Link"
          >
            <img alt="Back Arrow" className="w-[16px] h-[16px] object-contain transition-transform group-hover:-translate-x-1" src={'/svg/arrow-back.svg'} />
            <span className="text-[#64748b] text-[14px] font-medium leading-[20px]" data-node-id="9:265">
              Back to Login
            </span>
          </Link>

          {isSuccess ? (
            /* Success confirmation panel */
            <div className="w-full bg-white rounded-[24px] p-8 shadow-xl text-center flex flex-col items-center justify-center gap-6 border border-gray-100 animate-fadeIn">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#345b79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5M12 14v3m-3-3h6" />
                </svg>
              </div>
              <h2 className="text-[#345b79] text-2xl font-bold">Reset Link Sent</h2>
              <p className="text-[#64748b] text-[14px] leading-relaxed">
                We have sent a secure recovery link to <strong className="text-gray-800">{email}</strong>. Please follow the instructions to reset your password.
              </p>
              
              <div className="w-full h-px border-t border-slate-100 my-2" />

              <button
                type="button"
                disabled={resendTimer > 0 || isSubmitting}
                onClick={handleResend}
                className={`py-[14px] px-6 rounded-[8px] w-full text-white font-bold text-[14px] transition-colors ${
                  resendTimer > 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#be5d3f] hover:bg-[#a64e33] cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
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
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[32px]">
              
              {/* Form Heading */}
              <div className="flex flex-col gap-[16px] items-start pt-[4px] w-full" data-node-id="9:266" data-name="Form Heading">
                <div 
                  className="bg-[rgba(52,91,121,0.1)] border border-[rgba(52,91,121,0.2)] border-solid flex items-center justify-center p-px rounded-[16px] w-[64px] h-[64px]" 
                  data-node-id="9:267"
                >
                  <img alt="Recovery Key Badge" className="w-[32px] h-[32px] object-contain" src={'/svg/key.svg'} />
                </div>
                <div className="flex flex-col gap-[4px] items-start w-full" data-node-id="9:270">
                  <div className="flex gap-[8px] items-center w-full" data-node-id="9:271">
                    <div className="bg-[#be5d3f] h-[20px] w-[4px]" data-node-id="9:272" />
                    <span className="font-bold text-[#be5d3f] text-[11px] tracking-[1.1px] uppercase whitespace-nowrap" data-node-id="9:274">
                      ACCOUNT RECOVERY
                    </span>
                  </div>
                  <div className="flex flex-col items-start w-full mt-1" data-node-id="9:275">
                    <h2 className="font-extrabold text-[#1e293b] text-[36px] w-full leading-[40px]" data-node-id="9:276">
                      Forgot Password?
                    </h2>
                  </div>
                  <div className="flex flex-col items-start pt-[8px] w-full" data-node-id="9:277">
                    <p className="text-[#64748b] text-[16px] font-normal leading-[26px] w-full" data-node-id="9:278">
                      No worries. Enter your registered email and we'll send you a secure reset link instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex flex-col gap-[24px] items-start w-full" data-node-id="9:279" data-name="Form Content">
                
                {/* Email Input wrapper */}
                <div className="w-full flex flex-col gap-[8px]" data-node-id="9:280">
                  <label className="font-bold text-[#334155] text-[14px] leading-[20px] select-none" data-node-id="9:281">
                    Email Address
                  </label>
                  <div className="w-full relative" data-node-id="9:282">
                    <input
                      type="email"
                      placeholder="Enter your registered email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className={`bg-white border w-full pl-[49px] pr-[17px] py-[18px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none text-[16px] text-gray-800 transition-colors ${
                        error ? 'border-red-500 focus:border-red-500' : 'border-[#e2e8f0] focus:border-[#345b79]'
                      }`}
                      data-node-id="9:283"
                    />
                    <div className="absolute bottom-0 flex items-center left-0 pl-[16px] top-0 pointer-events-none" data-node-id="9:286">
                      <img alt="Email Icon" className="w-[20px] h-[20px] object-contain" src={'/svg/email.svg'} />
                    </div>
                  </div>
                  {error ? (
                    <p className="text-red-500 text-[11px] mt-1">{error}</p>
                  ) : (
                    <div className="flex gap-[6px] items-center mt-1" data-node-id="9:289">
                      <img alt="Info Bullet" className="w-[12px] h-[12px] object-contain" src={'/svg/info.svg'} />
                      <span className="text-[#64748b] text-[11px] font-normal leading-[16.5px]" data-node-id="9:292">
                        Use the email you registered with NexaBuild
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#345b79] hover:bg-[#25465e] flex gap-[8px] items-center justify-center py-[16px] rounded-[8px] w-full text-white text-[16px] font-bold whitespace-nowrap transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed shadow-[0px_10px_15px_-3px_rgba(52,91,121,0.2),0px_4px_6px_-4px_rgba(52,91,121,0.2)] cursor-pointer mt-1"
                  data-node-id="9:293"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Sending link...</span>
                    </div>
                  ) : (
                    <>
                      <img alt="Send Link Icon" className="w-[20px] h-[20px] object-contain" src={'/svg/arrow-send.svg'} />
                      <span data-node-id="9:297">Send Reset Link</span>
                    </>
                  )}
                </button>

                {/* Divider line */}
                <div className="w-full h-px bg-[#cbd5e1] my-1" data-node-id="9:298" />

              </div>

              {/* Informational Warning box */}
              <div 
                className="bg-[rgba(252,249,248,0.5)] border border-[#e2e8f0] border-solid flex gap-[12px] items-start p-[21px] rounded-[16px] w-full select-none" 
                data-node-id="9:301"
              >
                <div className="shrink-0" data-node-id="9:302">
                  <img alt="Clock Icon" className="w-[24px] h-[24px] object-contain" src={'/svg/clock.svg'} />
                </div>
                <div className="flex-1" data-node-id="9:304">
                  <p className="text-[#475569] text-[14px] font-normal leading-[20px]" data-node-id="9:305">
                    The reset link is valid for <span className="font-bold text-[#1e293b]">15 minutes</span>. Check your spam folder if you do not see the email within 2 minutes.
                  </p>
                </div>
              </div>

              {/* Links and Redirects */}
              <div className="flex flex-col gap-[12px] items-start w-full select-none" data-node-id="9:306" data-name="Footer Links">
                <div className="flex flex-col items-center w-full" data-node-id="9:307">
                  <span className="text-[#64748b] text-[14px] font-normal leading-[20px]" data-node-id="9:308">
                    Remembered your password?{' '}
                    <Link to="/auth/login" className="font-bold text-[#345b79] hover:underline">
                      Sign In
                    </Link>
                  </span>
                </div>
                <div className="flex flex-col items-center w-full" data-node-id="9:309">
                  <span className="text-[#64748b] text-[14px] font-normal leading-[20px]" data-node-id="9:310">
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