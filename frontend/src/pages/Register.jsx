import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Key, Lock, Eye, EyeOff, Loader2, ArrowRight, Info } from 'lucide-react';
import { Button, Input, Card } from '../components/ui-components';

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
        <div className="min-h-screen w-full bg-[#05080F] flex items-center justify-center p-4 relative overflow-hidden text-gray-300 font-sans selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[150px]" />

            {/* Header */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-wide">AnonFS</span>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <Card className="p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-b from-blue-500/20 to-transparent rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                            <Shield className="w-8 h-8 text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Create Secure Account</h1>
                        <p className="text-gray-500 text-sm">Join the encrypted vault network</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase ml-1">Username_ID</label>
                            <Input
                                icon={User}
                                type="text"
                                placeholder="ENTER SECURE ALIAS"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase ml-1">Secure Email</label>
                            <Input
                                icon={Mail}
                                type="email"
                                placeholder="NAME@PROVIDER.COM"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase ml-1">Passphrase</label>
                                <div className="relative">
                                    <Input
                                        icon={Key}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase ml-1">Confirm</label>
                                <Input
                                    icon={Lock}
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full gap-2 font-semibold tracking-wide mt-2" disabled={loading}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">INITIATE REGISTRATION <ArrowRight className="w-4 h-4" /></span>}
                        </Button>
                    </form>

                    <div className="mt-8 text-center space-y-6">
                        <p className="text-sm text-gray-400">
                            Already have an ID?{' '}
                            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                                Access Vault
                            </Link>
                        </p>

                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-x-0 h-px bg-gray-800"></div>
                            <span className="relative bg-[#0A0F1C] px-4 text-[10px] text-gray-600 tracking-widest uppercase">Encryption V2.0</span>
                        </div>
                    </div>
                </Card>

                <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10 text-[10px] text-green-500 font-mono tracking-wider">
                        <Shield className="w-3 h-3" />
                        End-to-End Encrypted
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <span className="text-[10px] text-gray-700 font-mono">SYS.STATUS: ONLINE • LATENCY: 12ms</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
