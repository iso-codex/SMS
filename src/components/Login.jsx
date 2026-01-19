import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Facebook, Twitter, Github, ArrowRight, UserPlus, LogIn, User, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import useAuthStore from '../lib/authStore';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const setSession = useAuthStore((state) => state.setSession);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.session.user.id)
                    .single();

                if (profileError) {
                    console.error("Profile fetch error:", profileError);
                    // Fallback to home if profile fails, but logged in
                    setSession(data.session);
                    navigate('/');
                    return;
                }

                setSession(data.session);
                // Assuming authStore has setProfile, we should export it or use it. 
                // Let's ensure access to useAuthStore's setProfile.
                useAuthStore.getState().setProfile(profileData);

                if (profileData.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (profileData.role === 'teacher') {
                    navigate('/teacher/dashboard');
                } else if (profileData.role === 'student') {
                    navigate('/student/dashboard');
                } else if (profileData.role === 'parent') {
                    navigate('/parent/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                if (data.session) {
                    setSession(data.session);
                    navigate('/');
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

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.14)] overflow-hidden w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 min-h-[650px]">

                {/* Left Side - Brand/Toggle */}
                <div className="relative overflow-hidden bg-blue-600 text-white p-12 flex flex-col justify-between">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-20 mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl -ml-20 -mb-20" />

                    {/* Glass Pattern Overlay */}
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
                                key={isLogin ? 'login-text' : 'signup-text'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-md"
                            >
                                <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-[1.1] tracking-tight">
                                    {isLogin ? "Join Our Community." : "Welcome Back!"}
                                </h1>
                                <p className="text-blue-100 text-lg mb-10 leading-relaxed font-medium">
                                    {isLogin
                                        ? "Dare to dream about the knowledge we could build together. Start your learning journey today."
                                        : "To keep connected with us please login with your personal info."}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 font-bold tracking-wide overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isLogin ? "Sign Up Instead" : "Log In Instead"}
                                <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>

                    {/* Footer decoration */}
                    <div className="relative z-10 text-xs font-bold text-blue-200/60 uppercase tracking-widest">
                        © 2024 School Management System
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="relative bg-white p-6 lg:p-20 flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-3">
                                {isLogin ? "Hello Again!" : "Create Account"}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {isLogin ? "Welcome back you've been missed!" : "It's free and easy to set up."}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleAuth}>
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
                                {isLogin && (
                                    <div className="flex justify-end">
                                        <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">Recovery Password</a>
                                    </div>
                                )}
                            </div>

                            <button
                                disabled={loading}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-xl font-bold text-md shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all duration-300 transform active:scale-[0.98] shrink-0 block cursor-pointer flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Register")}
                            </button>
                        </form>

                        <div className="mt-10 shrink-0">
                            <div className="relative flex justify-center text-xs">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100"></span>
                                </div>
                                <span className="relative px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">Or continue with</span>
                            </div>

                            <div className="mt-6 flex justify-center gap-3">
                                {[Facebook, Twitter, Github].map((Icon, i) => (
                                    <button key={i} className="w-14 h-14 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">
                                        <Icon size={20} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
