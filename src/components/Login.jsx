import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Loader2, GraduationCap, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import useAuthStore from '../lib/authStore';

const Login = () => {
    // Modes: 'standard' (admin/teacher/parent) or 'student'
    const [loginMode, setLoginMode] = useState('standard');

    // Standard Login State
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Signup for standard users

    // Student Login State
    const [studentStep, setStudentStep] = useState('identify'); // 'identify' -> 'otp' or 'password'
    const [otpSent, setOtpSent] = useState(false);

    // Form Data
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState(''); // For student verification or standard signup
    const [otp, setOtp] = useState(''); // Used as 'Access Code' input in this new flow
    const [accessCodeMode, setAccessCodeMode] = useState(false); // Validating Access Code?

    const navigate = useNavigate();
    const { setSession, session } = useAuthStore();

    React.useEffect(() => {
        if (session?.user) {
            processLoginSuccess(session);
        }
    }, [session]);

    const resetForm = () => {
        setError(null);
        setLoading(false);
        setEmail('');
        setPassword('');
        setFullName('');
        setOtp('');
        setStudentStep('identify');
        setOtpSent(false);
        setAccessCodeMode(false);
    };

    const handleSwitchMode = (mode) => {
        setLoginMode(mode);
        resetForm();
    };

    // ----------------------------------------------------------------------
    // Standard Auth Handling (Admin/Teacher/Parent)
    // ----------------------------------------------------------------------
    const handleStandardAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // LOGIN
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                await processLoginSuccess(data.session);
            } else {
                // SIGNUP (Restricted in real app, but kept for demo)
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } },
                });
                if (error) throw error;
                if (data.session) {
                    await processLoginSuccess(data.session);
                } else {
                    alert("Please check your email for confirmation!");
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------------------------
    // Student Auth Handling
    // ----------------------------------------------------------------------
    const handleStudentIdentityCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Verify Verification: User exists in public.users?
            const { data: users, error: dbError } = await supabase
                .from('users')
                .select('*')
                .ilike('email', email)
                .ilike('full_name', fullName)
                .eq('role', 'student');

            if (dbError) throw dbError;

            if (!users || users.length === 0) {
                throw new Error("Student not found. Please check your Name and Email.");
            }

            const student = users[0];

            // 2. Check if password is changed
            if (student.is_password_changed) {
                setStudentStep('password');
            } else {
                // First time login - Enter Access Code
                setStudentStep('otp'); // reusing 'otp' step name to mean 'access code' step
                setAccessCodeMode(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // OTP Handling removed for Magic Link flow (handled by App.jsx + useEffect)

    const handleStudentPasswordLogin = async (e, passwordOverride = null) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const loginPassword = passwordOverride || password;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password: loginPassword });
            if (error) throw error;
            await processLoginSuccess(data.session);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------------------------
    // Common Login Success Processor
    // ----------------------------------------------------------------------
    const processLoginSuccess = async (session) => {
        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profileError) {
            console.error("Profile fetch error:", profileError);
            // Fallback
            setSession(session);
            navigate('/');
            return;
        }

        setSession(session);
        useAuthStore.getState().setProfile(profileData);

        // Redirect Logic
        if (profileData.role === 'admin') navigate('/admin/dashboard');
        else if (profileData.role === 'teacher') navigate('/teacher/dashboard');
        else if (profileData.role === 'student') {
            // Check if password changed flag is false
            if (!profileData.is_password_changed) {
                navigate('/student/setup-password');
            } else {
                navigate('/student/dashboard');
            }
        }
        else if (profileData.role === 'parent') navigate('/parent/dashboard');
        else navigate('/');
    };

    // ----------------------------------------------------------------------
    // Render
    // ----------------------------------------------------------------------
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.14)] overflow-hidden w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 min-h-[650px]">

                {/* Left Side - Brand/Toggle */}
                <div className={`relative overflow-hidden ${loginMode === 'student' ? 'bg-purple-600' : 'bg-blue-600'} text-white p-12 flex flex-col justify-between transition-colors duration-500`}>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-20 mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl -ml-20 -mb-20" />
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 w-fit group">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ring-1 ring-white/30 transition-transform group-hover:scale-105">
                                S
                            </div>
                            <span className="font-heading font-extrabold text-2xl tracking-tight">SMS</span>
                        </Link>
                    </div>

                    <div className="relative z-10 my-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={loginMode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-md"
                            >
                                <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-[1.1] tracking-tight">
                                    {loginMode === 'student' ? "Student Portal" : "Welcome Admin"}
                                </h1>
                                <p className="text-blue-100 text-lg mb-10 leading-relaxed font-medium">
                                    {loginMode === 'student'
                                        ? "Access your dashboard, check results, and manage your schedule."
                                        : "Manage the entire school system efficiently and securely."}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mode Switcher */}
                    <div className="relative z-10 p-1 bg-black/20 backdrop-blur-sm rounded-xl flex">
                        <button
                            onClick={() => handleSwitchMode('standard')}
                            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${loginMode === 'standard' ? 'bg-white text-blue-600 shadow-md' : 'text-white/70 hover:text-white'}`}
                        >
                            Admin / Staff
                        </button>
                        <button
                            onClick={() => handleSwitchMode('student')}
                            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${loginMode === 'student' ? 'bg-white text-purple-600 shadow-md' : 'text-white/70 hover:text-white'}`}
                        >
                            Student
                        </button>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="relative bg-white p-6 lg:p-20 flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-3">
                                {loginMode === 'student' ? 'Student Login' : (isLogin ? "Hello Again!" : "Create Account")}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {loginMode === 'student'
                                    ? "Enter your details to identify yourself."
                                    : (isLogin ? "Welcome back you've been missed!" : "It's free and easy to set up.")}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* STUDENT FORM */}
                        {loginMode === 'student' && (
                            <form className="space-y-5" onSubmit={
                                studentStep === 'identify' ? handleStudentIdentityCheck :
                                    studentStep === 'otp' ? (e) => {
                                        // Use Access Code as Password
                                        e.preventDefault();
                                        setPassword(otp); // Move OTP to password state
                                        handleStudentPasswordLogin(e, otp); // Pass otp directly as password
                                    } :
                                        handleStudentPasswordLogin
                            }>
                                {/* ID Verification Step */}
                                {studentStep === 'identify' && (
                                    <>
                                        <div className="space-y-1.5">
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    required
                                                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Access Code Step */}
                                {studentStep === 'otp' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-purple-50 rounded-xl text-purple-700 text-sm font-medium">
                                            Please enter the <b>Access Code</b> provided by your administrator to verify your account.
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="relative group">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="Enter 6-digit Access Code"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.toUpperCase())}
                                                    required
                                                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all uppercase tracking-widest"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Password Step */}
                                {studentStep === 'password' && (
                                    <div className="space-y-1.5">
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    disabled={loading}
                                    className="w-full h-14 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white rounded-xl font-bold text-md shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                        studentStep === 'identify' ? "Verify Identity" :
                                            studentStep === 'otp' ? "Verify Access Code" : "Login"
                                    )}
                                </button>
                                {studentStep !== 'identify' && (
                                    <button
                                        type="button"
                                        onClick={() => setStudentStep('identify')}
                                        className="w-full text-sm text-slate-500 font-bold hover:text-purple-600"
                                    >
                                        Back to Verification
                                    </button>
                                )}
                            </form>
                        )}

                        {/* STANDARD FORM (Existing) */}
                        {loginMode === 'standard' && (
                            <form className="space-y-5" onSubmit={handleStandardAuth}>
                                <AnimatePresence mode="popLayout">
                                    {!isLogin && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden space-y-5"
                                        >
                                            <div className="space-y-1.5 shrink-0">
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" size={20} />
                                                    <input
                                                        type="text"
                                                        placeholder="Full Name"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        required={!isLogin}
                                                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-300 block"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-1.5 shrink-0">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" size={20} />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-300 block"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 shrink-0">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" size={20} />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-300 block"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-xl font-bold text-md shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all duration-300 transform active:scale-[0.98] shrink-0 block cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Register")}
                                </button>

                                <div className="flex justify-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                                    >
                                        {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
