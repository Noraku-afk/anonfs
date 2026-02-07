import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const ShareModal = ({ isOpen, onClose, file, onShareSuccess }) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('view');
    const [expires, setExpires] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleShare = async () => {
        if (!email) {
            alert("Please enter an email address.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                file_id: file.id,
                email: email,
                permission_type: permission,
            };

            if (expires) {
                payload.expires_in_hours = 24;
            }

            await api.post('share-file/', payload);

            alert(`File shared successfully with ${email}`);
            onShareSuccess();
            onClose();
            setEmail('');
            setPermission('view');
            setExpires(false);
        } catch (error) {
            console.error("Share failed:", error);
            alert("Share failed! Check if user exists.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#16202a]/80 backdrop-blur-xl shadow-2xl transition-all"
                    >
                        {/* Glow Effects */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none"></div>

                        <div className="relative flex flex-col p-6 sm:p-8">
                            {/* Header */}
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-accent text-2xl">lock</span>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Share Secure File</h2>
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        Sharing <span className="font-medium text-white">'{file?.original_name}'</span>
                                    </p>
                                </div>
                                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-6">
                                {/* Input Group */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-400" htmlFor="recipient">
                                        Recipient
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                                        </div>
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-lg border border-[#223649] bg-[#0f172a]/50 py-3 pl-10 pr-10 text-white placeholder-slate-500 focus:border-primary focus:bg-[#0f172a] focus:ring-1 focus:ring-primary sm:text-sm transition-all shadow-inner outline-none"
                                            id="recipient"
                                            placeholder="colleague@example.com"
                                            type="email"
                                        />
                                    </div>
                                </div>

                                {/* Permissions */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Permissions
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label
                                            className={`relative flex cursor-pointer rounded-lg border p-3 shadow-sm focus:outline-none transition-all ${permission === 'view' ? 'border-primary bg-primary/10' : 'border-[#223649] bg-[#0f172a]/30 hover:bg-[#0f172a]/50'}`}
                                            onClick={() => setPermission('view')}
                                        >
                                            <input type="radio" name="permission" value="view" className="sr-only" checked={permission === 'view'} readOnly />
                                            <span className="flex flex-1">
                                                <span className="flex flex-col">
                                                    <span className={`block text-sm font-medium flex items-center gap-2 ${permission === 'view' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                                        View Only
                                                    </span>
                                                    <span className="mt-1 flex items-center text-xs text-slate-400">Recipient can view but not edit</span>
                                                </span>
                                            </span>
                                            <span className={`material-symbols-outlined ${permission === 'view' ? 'text-primary' : 'text-[#223649]'}`}>
                                                {permission === 'view' ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                        </label>

                                        <label
                                            className={`relative flex cursor-pointer rounded-lg border p-3 shadow-sm focus:outline-none transition-all ${permission === 'edit' ? 'border-primary bg-primary/10' : 'border-[#223649] bg-[#0f172a]/30 hover:bg-[#0f172a]/50'}`}
                                            onClick={() => setPermission('edit')}
                                        >
                                            <input type="radio" name="permission" value="edit" className="sr-only" checked={permission === 'edit'} readOnly />
                                            <span className="flex flex-1">
                                                <span className="flex flex-col">
                                                    <span className={`block text-sm font-medium flex items-center gap-2 ${permission === 'edit' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                                        <span className="material-symbols-outlined text-sm">edit</span>
                                                        Can Edit
                                                    </span>
                                                    <span className="mt-1 flex items-center text-xs text-slate-500">Full access to modify file</span>
                                                </span>
                                            </span>
                                            <span className={`material-symbols-outlined ${permission === 'edit' ? 'text-primary' : 'text-[#223649]'}`}>
                                                {permission === 'edit' ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Link Settings (Toggles) */}
                                <div className="flex items-center justify-between py-2 border-t border-white/5 mt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-400">timer</span>
                                        <span className="text-sm text-slate-400">Expire link after 24 hours</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${expires ? 'bg-primary' : 'bg-slate-700'}`}
                                        onClick={() => setExpires(!expires)}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${expires ? 'translate-x-4' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </div>

                                {/* Security Badge */}
                                <div className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="material-symbols-outlined text-green-500 text-sm">verified_user</span>
                                    <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">End-to-End Encrypted</span>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="mt-8 flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 rounded-lg border border-[#223649] bg-transparent py-2.5 text-sm font-semibold text-slate-400 shadow-sm hover:bg-[#223649] hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleShare}
                                    disabled={loading}
                                    className="flex-[2] flex items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-bold text-[#082f1f] shadow-[0_0_20px_-5px_#00ff9d] hover:bg-[#00cc7d] hover:shadow-[0_0_25px_-5px_#00ff9d] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-wait"
                                >
                                    <span>{loading ? 'Sharing...' : 'Share File'}</span>
                                    <span className="material-symbols-outlined text-lg font-bold">send</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
