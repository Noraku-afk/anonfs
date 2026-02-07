import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, User, Key, Lock, Eye, EyeOff, Loader2, Info } from 'lucide-react';
import { Button, Input, Card } from '../components/ui-components';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.username, formData.password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response) {
                if (err.response.status === 404) {
                    setError('Server Endpoint Not Found (Check API URL)');
                } else if (err.response.status === 401) {
                    setError('Invalid Username or Password');
                } else {
                    setError(`Login failed: ${err.response.statusText}`);
                }
            } else {
                setError('Network Error: Could not reach backend');
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

            <div className="absolute top-6 right-6">
                <Button variant="ghost" className="text-xs gap-2">
                    <Info className="w-4 h-4" /> Support
                </Button>
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
                            <Lock className="w-8 h-8 text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
                        <p className="text-gray-500 text-sm">Securely access your encrypted vault</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase ml-1">Username or Key ID</label>
                            <Input
                                icon={User}
                                type="text"
                                placeholder="Enter identification"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase ml-1">Passphrase</label>
                            <div className="relative">
                                <Input
                                    icon={Key}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••••"
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

                        <Button type="submit" className="w-full gap-2 font-semibold tracking-wide" disabled={loading}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
                            AUTHENTICATE
                        </Button>
                    </form>

                    <div className="mt-8 text-center space-y-6">
                        <a href="#" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
                            Forgot your credentials?
                        </a>

                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-x-0 h-px bg-gray-800"></div>
                            <span className="relative bg-[#0A0F1C] px-4 text-[10px] text-gray-600 tracking-widest uppercase">Access Level 0</span>
                        </div>

                        <p className="text-sm text-gray-400">
                            New to AnonFS?{' '}
                            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                                Register Securely
                            </Link>
                        </p>
                    </div>
                </Card>

                <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10 text-[10px] text-green-500 font-mono tracking-wider">
                        <Shield className="w-3 h-3" />
                        End-to-End Encrypted Connection
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <span className="text-[10px] text-gray-700 font-mono">SYSTEM VERSION 4.0.2 • BUILD 8921A</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
