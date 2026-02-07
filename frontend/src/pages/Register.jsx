import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passphrases do not match.");
            return;
        }

        setLoading(true);
        try {
            await register(formData.username, formData.email, formData.password);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Handle backend validation errors (e.g., username taken)
                const msg = Object.values(err.response.data).flat().join(' ');
                setError(msg || "Registration failed.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-display bg-[#f6f6f8] dark:bg-[#05080F] text-slate-900 dark:text-white min-h-screen flex flex-col relative overflow-x-hidden selection:bg-[#1f68ef] selection:text-white">
            {/* Ambient Background Blobs */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none z-0"></div>
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none z-0"></div>

            <main className="flex-grow flex items-center justify-center p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-[520px] rounded-xl p-8 md:p-10 flex flex-col gap-8 backdrop-blur-xl bg-[#0a0f1c]/70 border border-[#1f68ef]/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                >
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1f68ef]/10 text-[#1f68ef] border border-[#1f68ef]/20 shadow-[0_0_30px_rgba(31,104,239,0.15)] mb-2">
                            <span className="material-symbols-outlined text-4xl drop-shadow-[0_0_20px_rgba(31,104,239,0.5)]">shield_lock</span>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_20px_rgba(31,104,239,0.5)]">AnonFS Vault</h1>
                            <p className="text-slate-400 text-sm tracking-wide uppercase font-mono">Create Secure Account</p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {/* Username */}
                        <div className="space-y-2 group">
                            <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
                                Username_ID
                            </label>
                            <div className="flex items-center w-full bg-[#0A0F1C] border border-slate-800 rounded-lg transition-all duration-300 focus-within:border-[#1f68ef] focus-within:shadow-[0_0_15px_rgba(31,104,239,0.2)]">
                                <div className="pl-4 pr-3 text-slate-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">person</span>
                                </div>
                                <input
                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 text-sm py-3.5 pl-0"
                                    placeholder="ENTER SECURE ALIAS"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                                <div className="pr-4 opacity-0 group-focus-within:opacity-100 transition-opacity text-[#1f68ef]">
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2 group">
                            <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
                                Secure Email
                            </label>
                            <div className="flex items-center w-full bg-[#0A0F1C] border border-slate-800 rounded-lg transition-all duration-300 focus-within:border-[#1f68ef] focus-within:shadow-[0_0_15px_rgba(31,104,239,0.2)]">
                                <div className="pl-4 pr-3 text-slate-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <input
                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 text-sm py-3.5 pl-0"
                                    placeholder="NAME@PROVIDER.COM"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Password */}
                            <div className="space-y-2 group">
                                <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
                                    Passphrase
                                </label>
                                <div className="flex items-center w-full bg-[#0A0F1C] border border-slate-800 rounded-lg transition-all duration-300 focus-within:border-[#1f68ef] focus-within:shadow-[0_0_15px_rgba(31,104,239,0.2)]">
                                    <div className="pl-4 pr-3 text-slate-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">lock</span>
                                    </div>
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 text-sm py-3.5 pl-0"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="pr-4 text-slate-500 hover:text-white transition-colors flex items-center outline-none"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2 group">
                                <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
                                    Confirm
                                </label>
                                <div className="flex items-center w-full bg-[#0A0F1C] border border-slate-800 rounded-lg transition-all duration-300 focus-within:border-[#1f68ef] focus-within:shadow-[0_0_15px_rgba(31,104,239,0.2)]">
                                    <div className="pl-4 pr-3 text-slate-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                                    </div>
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 text-sm py-3.5 pl-0"
                                        placeholder="••••••••"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-[#1f68ef] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(31,104,239,0.4)] transform hover:-translate-y-0.5 border border-white/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-wait"
                        >
                            <span>{loading ? 'Processing...' : 'Initiate Registration'}</span>
                            {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-lg">arrow_forward</span>}
                        </button>
                    </form>

                    {/* Footer Section */}
                    <div className="flex flex-col items-center gap-6 pt-2 border-t border-white/5">
                        <p className="text-slate-400 text-sm">
                            Already have an ID?
                            <Link to="/login" className="text-[#1f68ef] hover:text-blue-400 font-medium ml-1 transition-colors hover:underline decoration-blue-500/50 underline-offset-4">
                                Access Vault
                            </Link>
                        </p>
                        <div className="flex flex-col items-center gap-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f68ef]/10 border border-[#1f68ef]/20 text-[10px] font-mono font-bold text-[#1f68ef] uppercase tracking-wider shadow-[0_0_10px_rgba(31,104,239,0.1)]">
                                <span className="material-symbols-outlined text-[14px]">encrypted</span>
                                End-to-End Encrypted
                            </div>
                            <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Encryption Protocol v2.0</p>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer Decorative Elements */}
            <footer className="fixed bottom-4 w-full text-center pointer-events-none z-20 hidden md:block">
                <div className="flex justify-between px-8 text-[10px] text-slate-700 font-mono">
                    <span>SYS.STATUS: ONLINE</span>
                    <span>LATENCY: 12ms</span>
                    <span>SERVER: VAULT-01</span>
                </div>
            </footer>
        </div>
    );
};

export default Register;
