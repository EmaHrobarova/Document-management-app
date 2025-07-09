import React, {useEffect, useState} from "react";
import api from "../services/api.ts";
import CreatableSelect from "react-select/creatable";

export type Document = {
    id: number;
    name: string;
    display_name: string;
    tags: any;
    created_at: string;
    updated_at: string;
}

const Documents = () => {
    const [documents, setDocuments] =  useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [docToDelete, setDocToDelete] = useState<Document | null>(null);
    const [search, setSearch] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [docToEdit, setDocToEdit] = useState<Document | null>(null);
    const [editName, setEditName] = useState('');
    const [editTags, setEditTags] = useState<{label: string, value: string}[]>([]);
    const [availableTags, setAvailableTags] = useState<{label: string, value: string}[]>([]);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);
        }
        catch (error) {
            console.error('Error uploading document:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const downloadDocument = async (id: number, name: string) => {
        try {
            const response = await api.get(`/documents/download/${id}`, {
                responseType: 'blob',
            });

            // https://flexiple.com/javascript/download-flle-using-javascript (for future reference)
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error('Error uploading document:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (id: number) => {
        try {
            await api.delete(`/documents/delete/${id}`);
            fetchDocuments();
        }
        catch (error) {
            console.error('Error uploading document:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const editDocument = async (id: number, display_name: string, tags: {label: string, value: string}[]) => {
        try {
            await api.put(`/documents/update/${id}`, {
                display_name,
                tags: tags.map(tag => tag.value),
            });
            fetchDocuments();
        }
        catch (error) {
            console.error('Error uploading document:', error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

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

    const handleTagChange = (selected: any) => {
        setEditTags(selected || []);
    };

    const handleTagCreate = (inputValue: string) => {
        const newTag = { label: inputValue, value: inputValue };
        setAvailableTags(prev => [...prev, newTag]);
        setEditTags(prev => [...prev, newTag]);
    };

    const filteredDocuments = documents.filter(doc => {
        if (search === '') return true; // Show all if search is empty
        return Array.isArray(doc.tags)
            ? doc.tags.some(tag => (tag.name ?? '').toLowerCase().includes(search.toLowerCase()))
            : false;
    });

    // template from https://flowbite.com/docs/components/tables/
    return (
        <>
        <div className="m-4 flex justify-center items-center">
            <input
                type="text"
                placeholder="Search by tag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition w-full max-w-xs"
            />
        </div>
        <div className="relative overflow-x-auto m-4 shadow-md sm:rounded-xl">
            <table className="w-full text-sm text-left rtl:text-right text-blue-900">
                <thead className="text-md text-blue-700 uppercase bg-blue-50">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Document name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Tags
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Created at
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Updated at
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="sr-only">Download</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="text-md bg-white border-b border-blue-100 hover:bg-blue-50">
                        <th scope="row" className="px-6 py-4 font-medium text-blue-900 whitespace-nowrap">
                            {doc.display_name}
                        </th>
                        <td className="px-6 py-4">
                            {Array.isArray(doc.tags) ? doc.tags.map(tag => tag.name).join(', ') : doc.tags}
                        </td>
                        <td className="px-6 py-4">
                            {new Date(doc.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                            {new Date(doc.updated_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button
                               onClick={() => {
                                   const extension = doc.name.split('.').pop();
                                   const downloadName = doc.display_name + (extension ? '.' + extension : '');
                                   downloadDocument(doc.id, downloadName);
                               }}
                               className="font-medium text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded border border-blue-400 transition"
                            >
                               Download
                            </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => {
                                    setDocToEdit(doc);
                                    setEditName(doc.display_name);
                                    setEditTags(
                                        Array.isArray(doc.tags)
                                            ? doc.tags.map((tag: any) => ({ label: tag.name, value: tag.name }))
                                            : []
                                    );
                                    setShowEditModal(true);
                                }}
                                className="font-medium text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded border border-blue-400 transition"
                            >
                                Edit
                            </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => {
                                    setDocToDelete(doc);
                                    setShowDeleteModal(true);
                                }}
                                className="font-medium text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded border border-blue-400 transition"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        {showDeleteModal && docToDelete && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-blue-900 bg-opacity-40">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative border border-blue-200">
              <div className="my-8 text-center">
                <h4 className="text-xl text-blue-700 font-semibold">Are you sure you want to delete this document?</h4>
                <p className="text-blue-600 text-md font-semibold mt-4">
                  This action is permanent.
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition flex justify-center items-center"
                  onClick={async () => {
                    await deleteDocument(docToDelete.id);
                    setShowDeleteModal(false);
                    setDocToDelete(null);
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="text-blue-900 bg-blue-100 hover:bg-blue-200 active:bg-blue-100 text-lg py-2 px-4 rounded-2xl font-bold shadow border border-blue-200"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showEditModal && docToEdit && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-blue-900 bg-opacity-40">
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative border border-blue-200">
                    <div className="my-8 text-center">
                        <h4 className="text-xl text-blue-700 font-semibold">Edit Document</h4>
                    </div>
                   <form onSubmit={async (e) => {
                       e.preventDefault();
                       await editDocument(docToEdit.id, editName, editTags);
                       setShowEditModal(false);
                       setDocToEdit(null);
                   }}
                   >
                   <div className="mb-6">
                       <label htmlFor="name" className="block mb-2 text-sm font-semibold text-blue-700">Document Name</label>
                       <input
                           type="text"
                           value={editName}
                           onChange={e => setEditName(e.target.value)}
                           className="mt-1 block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition"
                           placeholder="Enter document name"
                           required
                       />
                   </div>
                   <CreatableSelect
                       isMulti
                       options={availableTags}
                       value={editTags}
                       onChange={handleTagChange}
                       onCreateOption={handleTagCreate}
                       placeholder="Add or select tags"
                       className="mb-4"

                   />
                    <div className="flex flex-col space-y-3">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition flex justify-center items-center"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="text-blue-900 bg-blue-100 hover:bg-blue-200 active:bg-blue-100 text-lg py-2 px-4 rounded-2xl font-bold shadow border border-blue-200"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                   </form>
                </div>
            </div>
        )}
        </>
    );
}

export default Documents;