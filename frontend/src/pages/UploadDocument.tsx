import React, { useState } from 'react';
import api from "../services/api.ts";
import { useNavigate } from 'react-router-dom';

// https://www.geeksforgeeks.org/reactjs/file-uploading-in-react-js/
// https://www.bezkoder.com/react-typescript-file-upload/
const UploadDocument = () => {
    const [name, setName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const resetForm = () => {
        setName('');
        setSelectedFile(null);
        setIsSuccess(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !selectedFile) {
            return;
        }
        
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', selectedFile, selectedFile.name);

        try {
            await api.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsSuccess(true);
        }
        catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };

    // template from https://flowbite.com/docs/forms/file-input/
    return (
        <div className="flex items-center justify-center min-h-screen">
            {isSuccess ? (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-8 py-6 rounded-lg shadow-md w-full max-w-md text-center">
                    <h2 className="text-3xl font-bold mb-6">Upload Successful!</h2>
                    <p className="mb-4 text-lg">Your document has been uploaded.</p>
                    <button
                        onClick={resetForm}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-2xl font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
                    >
                        Upload another file
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
                    <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700 drop-shadow-sm">Add Document</h1>
                    <div className="mb-6">
                        <label htmlFor="name" className="block mb-2 text-sm font-semibold text-blue-700">Document Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition"
                            placeholder="Enter document name"
                            required
                        />
                    </div>
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition mb-7">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-blue-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-blue-400">SVG, PNG, JPG or GIF (max 10MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} required />
                    </label>
                    {selectedFile && (
                        <div className="mb-4 text-blue-700 text-sm font-semibold">
                            Selected file: {selectedFile.name}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition flex justify-center items-center`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : 'Upload'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default UploadDocument;