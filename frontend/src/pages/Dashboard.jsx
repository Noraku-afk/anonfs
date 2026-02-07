import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

// Helper for formatting bytes
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

import ShareModal from '../components/ShareModal';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('my-files');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalSize: 0, count: 0 });
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    // Share Modal State
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [fileToShare, setFileToShare] = useState(null);

    // Fetch files based on active tab
    useEffect(() => {
        fetchFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'my-files' ? 'my-files/' : 'shared-files/';
            const response = await api.get(endpoint);
            setFiles(response.data);

            // Calculate stats if on My Files tab
            if (activeTab === 'my-files') {
                const totalSize = response.data.reduce((acc, file) => acc + (file.file_size || 0), 0);
                setStats({ totalSize, count: response.data.length });
            }
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await api.post('upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchFiles(); // Refresh list
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed!");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await api.get(`download/${fileId}/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            if (error.response && error.response.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorObj = JSON.parse(reader.result);
                        alert(`Download failed: ${errorObj.error || 'Unknown error'}`);
                    } catch (e) {
                        alert("Download failed: Server returned an error.");
                    }
                };
                reader.readAsText(error.response.data);
            } else {
                alert("Download failed! Please try again.");
            }
        }
    };

    const handleShareClick = (file) => {
        setFileToShare(file);
        setIsShareModalOpen(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-background-dark text-slate-200 antialiased selection:bg-accent selection:text-black overflow-hidden h-screen w-full font-body">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[100px]"></div>
            </div>

            <div className="relative z-10 flex h-full w-full overflow-hidden">
                {/* Sidebar */}
                <aside className="glass-sidebar flex w-72 flex-col justify-between p-6 z-20 hidden md:flex h-full border-r border-glass-border">
                    <div className="flex flex-col gap-8">
                        {/* Branding */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-white text-[24px]">verified_user</span>
                            </div>
                            <div>
                                <h1 className="text-white text-lg font-bold tracking-tight">AnonFS</h1>
                                <p className="text-slate-400 text-xs font-medium tracking-wide">SECURE VAULT</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab('my-files')}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'my-files' ? 'bg-primary/10 border border-primary/20 text-white shadow-[0_0_15px_rgba(13,127,242,0.15)]' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                            >
                                <span className={`material-symbols-outlined transition-colors ${activeTab === 'my-files' ? 'text-primary' : ''}`}>folder_shared</span>
                                <span className="font-medium text-sm">My Files</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('shared-files')}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'shared-files' ? 'bg-primary/10 border border-primary/20 text-white shadow-[0_0_15px_rgba(13,127,242,0.15)]' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                            >
                                <span className={`material-symbols-outlined transition-colors ${activeTab === 'shared-files' ? 'text-primary' : ''}`}>share</span>
                                <span className="font-medium text-sm">Shared with Me</span>
                            </button>
                        </nav>
                    </div>

                    {/* User Profile & Logout */}
                    <div className="flex flex-col gap-4">
                        <div className="glass-panel p-4 rounded-xl flex items-center gap-3 border border-white/5 bg-[#111928bf]">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-slate-700 bg-center bg-cover border border-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-300">person</span>
                                </div>
                                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-accent border-2 border-[#131b24]"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{user?.username || 'User'}</p>
                                <p className="text-accent text-xs truncate drop-shadow-[0_0_5px_rgba(0,255,157,0.4)]">Encrypted • Online</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full relative overflow-y-auto overflow-x-hidden">
                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-white/5 sticky top-0 z-30 bg-[#111928bf] backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">verified_user</span>
                            <span className="text-white font-bold">AnonFS</span>
                        </div>
                        <button onClick={handleLogout} className="text-white p-2">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>

                    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                                    {activeTab === 'my-files' ? 'My Files' : 'Shared with Me'}
                                </h2>
                                <p className="text-slate-400">Manage your encrypted documents securely.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="glass-panel rounded-lg p-1 flex bg-[#111928bf] border border-white/5">
                                    <button
                                        onClick={() => setActiveTab('my-files')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'my-files' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        My Files
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('shared-files')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'shared-files' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Shared with Me
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        {activeTab === 'my-files' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="glass-panel p-5 rounded-xl border border-white/5 relative group overflow-hidden bg-[#111928bf] backdrop-blur-md">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-4xl text-primary">cloud</span>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">Total Storage</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <h3 className="text-2xl font-bold text-white">{formatBytes(stats.totalSize || 0)}</h3>
                                    </div>
                                    <div className="w-full bg-slate-700/30 h-1.5 rounded-full mt-4 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                                <div className="glass-panel p-5 rounded-xl border border-white/5 relative group overflow-hidden bg-[#111928bf] backdrop-blur-md">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-4xl text-accent">lock</span>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">Encrypted Files</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <h3 className="text-2xl font-bold text-white">{stats.count || 0}</h3>
                                        <span className="text-xs text-accent drop-shadow-[0_0_5px_rgba(0,255,157,0.4)]">Active</span>
                                    </div>
                                </div>
                                <div className="glass-panel p-5 rounded-xl border border-white/5 relative group overflow-hidden bg-[#111928bf] backdrop-blur-md">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-4xl text-purple-400">share</span>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">Secure Shares</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <h3 className="text-2xl font-bold text-white">-</h3>
                                        <span className="text-xs text-purple-400">Unlimited</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Upload Zone */}
                        {activeTab === 'my-files' && (
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative rounded-xl border-2 border-dashed border-slate-700 bg-[#0f1621] p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-primary/50 hover:bg-[#131b29]">
                                    <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-2xl">cloud_upload</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-medium mb-1">{uploading ? 'Encrypting & Uploading...' : 'Upload Encrypted Files'}</p>
                                        <p className="text-slate-500 text-sm">Drag and drop your documents here to encrypt and store them securely.</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        disabled={uploading}
                                        className="mt-2 px-6 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-semibold shadow-lg shadow-primary/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {uploading ? 'Processing...' : 'Browse Files'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Files Table */}
                        <div className="glass-panel rounded-xl overflow-hidden border border-white/5 flex flex-col bg-[#111928bf] backdrop-blur-md">
                            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-lg font-semibold text-white">Files</h3>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                            <th className="p-5 font-medium">File Name</th>
                                            <th className="p-5 font-medium hidden sm:table-cell">Date Added</th>
                                            <th className="p-5 font-medium hidden md:table-cell">Size</th>
                                            <th className="p-5 font-medium">Status</th>
                                            <th className="p-5 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-500">Loading encrypted vault...</td>
                                            </tr>
                                        ) : files.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-500">No files found in secure storage.</td>
                                            </tr>
                                        ) : (
                                            files.map((file) => (
                                                <tr key={file.id} className="group hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded bg-slate-500/10 flex items-center justify-center text-slate-400">
                                                                <span className="material-symbols-outlined">description</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-200 group-hover:text-white transition-colors">{file.original_name}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-slate-400 hidden sm:table-cell">{new Date(file.created_at).toLocaleDateString()}</td>
                                                    <td className="p-5 text-slate-400 hidden md:table-cell">{formatBytes(file.file_size || 0)}</td>
                                                    <td className="p-5">
                                                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 drop-shadow-[0_0_5px_rgba(0,255,157,0.4)]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse"></span>
                                                            Encrypted
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            {activeTab === 'my-files' && (
                                                                <button
                                                                    onClick={() => handleShareClick(file)}
                                                                    className="p-2 rounded-lg hover:bg-primary/20 hover:text-primary text-slate-400 transition-all cursor-pointer"
                                                                    title="Share"
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">share</span>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDownload(file.id, file.original_name)}
                                                                className="p-2 rounded-lg hover:bg-accent/20 hover:text-accent text-slate-400 transition-all cursor-pointer"
                                                                title="Decrypt & Download"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">lock_open</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                file={fileToShare}
                onShareSuccess={() => {
                    // Optional: refresh logic if needed
                }}
            />
        </div>
    );
};

export default Dashboard;
