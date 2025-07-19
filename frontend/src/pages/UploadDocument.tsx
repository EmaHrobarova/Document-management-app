import React, {useEffect, useState} from 'react';
import api from "../services/api.ts";
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

// https://www.geeksforgeeks.org/reactjs/file-uploading-in-react-js/
// https://www.bezkoder.com/react-typescript-file-upload/
const UploadDocument = () => {
    const [name, setName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [tags, setTags] = useState<{label: string, value: string}[]>([]);
    const [availableTags, setAvailableTags] = useState<{label: string, value: string}[]>([]);
    const navigate = useNavigate();

    const handleTagChange = (selected: any) => {
        setTags(selected || []);
    };

    const handleTagCreate = (inputValue: string) => {
        const newTag = { label: inputValue, value: inputValue };
        setAvailableTags(prev => [...prev, newTag]);
        setTags(prev => [...prev, newTag]);
    };

    useEffect( () => {
        const fetchTags = async () => {
            try {
                const response = await api.get('/tags');
                setAvailableTags(response.data.map((tag: any) => ({ label: tag.name, value: tag.name })));
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    const resetForm = () => {
        setName('');
        setTags([]);
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
        formData.append('display_name', name); // user-entered name as display_name
        formData.append('file', selectedFile, selectedFile.name);
        tags.forEach((tag, i) => formData.append(`tags[${i}]`, tag.value));

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
                <div className="bg-blue-100 border border-blue-400 px-8 py-8 rounded-lg shadow-md w-full max-w-md text-center">
                    <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-500 drop-shadow-sm">Upload Successful!</h2>
                    <p className="mb-4 text-lg text-blue-600">Your document has been uploaded.</p>
                    <button
                        onClick={resetForm}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-2xl font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
                    >
                        Upload another file
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
                    <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-500 drop-shadow-sm">Add Document</h1>
                    <div className="mb-6 text-left">
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
                    <CreatableSelect
                        isMulti
                        options={availableTags}
                        value={tags}
                        onChange={handleTagChange}
                        onCreateOption={handleTagCreate}
                        placeholder="Add or select tags"
                        className="mb-4"
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                backgroundColor: '#eff6ff',
                                borderColor: state.isFocused ? '#3B82F6' : '#BFDBFE',
                                boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.5)' : 'none',
                                textAlign: 'left',
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: '#93c5fd', // Tailwind blue-300
                                textAlign: 'left',
                            }),
                            input: (base) => ({
                                ...base,
                                color: '#1e40af', // Tailwind blue-900
                                textAlign: 'left',
                            }),
                        }}
                    />
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
                        <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                <span className="text-blue-700 text-sm font-semibold">{selectedFile.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1 transition"
                                title="Remove file"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-700'} text-white text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition flex justify-center items-center`}
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