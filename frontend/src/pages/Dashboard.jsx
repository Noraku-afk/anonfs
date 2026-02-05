import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [myFiles, setMyFiles] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState('');
    const [shareFileId, setShareFileId] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const myRes = await api.get('my-files/');
            setMyFiles(myRes.data);
            const sharedRes = await api.get('shared-files/');
            setSharedFiles(sharedRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post('upload/', formData);
            alert('File uploaded successfully!');
            fetchFiles();
            setFile(null);
        } catch (err) {
            alert('Upload failed');
        }
    };

    const handleDownload = async (id, name) => {
        try {
            const response = await api.get(`download/${id}/`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('Download failed');
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();
        try {
            await api.post('share-file/', { file_id: shareFileId, email });
            alert('File shared successfully!');
            setEmail('');
            setShareFileId(null);
        } catch (err) {
            alert('Share failed: ' + (err.response?.data?.error || 'Unknown error'));
        }
    };

    return (
        <div className="container dashboard">
            <header>
                <h1>Welcome, {user?.username}</h1>
                <button onClick={logout}>Logout</button>
            </header>

            <section className="upload-sect">
                <h3>Upload New Encrypted File</h3>
                <form onSubmit={handleUpload}>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                    <button type="submit">Upload & Encrypt</button>
                </form>
            </section>

            <div className="files-grid">
                <section>
                    <h3>My Files</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Size</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myFiles.map(f => (
                                <tr key={f.id}>
                                    <td>{f.original_name}</td>
                                    <td>{f.file_size} B</td>
                                    <td>
                                        <button onClick={() => handleDownload(f.id, f.original_name)}>Download</button>
                                        <button onClick={() => setShareFileId(f.id)}>Share</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section>
                    <h3>Shared With Me</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Owner</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sharedFiles.map(f => (
                                <tr key={f.id}>
                                    <td>{f.original_name}</td>
                                    <td>{f.uploaded_by}</td>
                                    <td>
                                        <button onClick={() => handleDownload(f.id, f.original_name)}>Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            {shareFileId && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Share File</h3>
                        <form onSubmit={handleShare}>
                            <input
                                type="email"
                                placeholder="User Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <div className="actions">
                                <button type="submit">Share</button>
                                <button type="button" onClick={() => setShareFileId(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
