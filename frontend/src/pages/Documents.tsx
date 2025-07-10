import React, {useEffect, useState} from "react";
import api from "../services/api.ts";
import CreatableSelect from "react-select/creatable";
import ReactPaginate from 'react-paginate'; //https://www.npmjs.com/package/react-paginate

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
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };
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

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [search]);

    const filteredDocuments = documents.filter(doc => {
        if (search === '') return true; // Show all if search is empty
        return Array.isArray(doc.tags)
            ? doc.tags.some(tag => (tag.name ?? '').toLowerCase().includes(search.toLowerCase()))
            : false;
    });

    const pageCount = Math.ceil(filteredDocuments.length / itemsPerPage);
    const currentItems = filteredDocuments.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // template from https://flowbite.com/docs/components/tables/
    return (
        <>
        <div className="m-4 flex justify-center items-center">
            <input
                type="text"
                placeholder="Search by tag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 border-2 border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-blue-50 text-blue-900 font-semibold placeholder-blue-300 transition w-full max-w-xs"
            />
        </div>
        <div className="relative overflow-x-auto m-4 shadow-md rounded-2xl">
            <table className="my-2 w-full text-sm text-left font-sans rtl:text-right text-blue-800 rounded-2xl overflow-hidden">
                <thead className="bg-blue-100 text-md text-blue-500 uppercase border-b border-blue-100 shadow-md rounded-2xl">
                <tr>
                    <th scope="col" className="px-6 py-3 rounded-tl-xl">
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
                    <th scope="col" className="px-6 py-3"><span className="sr-only">Download</span></th>
                    <th scope="col" className="px-6 py-3"><span className="sr-only">Edit</span></th>
                    <th scope="col" className="px-6 py-3"><span className="sr-only rounded-tr-xl">Delete</span></th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((doc) => (
                    <tr key={doc.id} className="text-md bg-white text-blue-900 border-b border-blue-100 hover:bg-blue-50">
                        <th scope="row" className="px-6 py-4 font-bold whitespace-nowrap">
                            {doc.display_name}
                        </th>
                        <td className="px-6 py-3 font-medium">
                            {Array.isArray(doc.tags) ? doc.tags.map(tag => tag.name).join(', ') : doc.tags}
                        </td>
                        <td className="px-6 py-3 font-medium">
                            {new Date(doc.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 font-medium">
                            {new Date(doc.updated_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-3">
                           <button
                               onClick={() => {
                                   const extension = doc.name.split('.').pop();
                                   const downloadName = doc.display_name + (extension ? '.' + extension : '');
                                   downloadDocument(doc.id, downloadName);
                               }}
                               className="font-medium bg-blue-500 text-white border border-blue-400 hover:bg-white hover:text-blue-600 hover:border-blue-600 focus:outline-none px-4 py-1 rounded-2xl transition"
                            >
                               Download
                            </button>
                        </td>
                        <td className="px-6 py-3">
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
                                className="font-medium bg-blue-500 text-white border border-blue-400 hover:bg-white hover:text-blue-600 hover:border-blue-600 focus:outline-none px-4 py-1 rounded-2xl transition"
                            >
                                Edit
                            </button>
                        </td>
                        <td className="px-6 py-4">
                            <button
                                onClick={() => {
                                    setDocToDelete(doc);
                                    setShowDeleteModal(true);
                                }}
                                className="font-medium bg-blue-500 text-white border border-blue-400 hover:bg-white hover:text-blue-600 hover:border-blue-600 focus:outline-none px-4 py-1 rounded-2xl transition"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                forcePage={currentPage}
                containerClassName="flex justify-center my-2 py-4 space-x-1"
                pageClassName="px-3 py-2 text-blue-600 hover:bg-blue-100 hover:text-blue-500 rounded-2xl transition"
                activeClassName="bg-blue-600 text-white font-semibold"
                previousClassName="px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-2xl transition"
                nextClassName="px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-2xl transition"
                disabledClassName="text-gray-400 cursor-not-allowed"
            />
        </div>
        {showDeleteModal && docToDelete && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-blue-900 bg-opacity-40">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative border border-blue-200">
              <div className="my-8 text-center">
                <h4 className="text-4xl font-extrabold mb-8 text-center text-blue-500 drop-shadow-sm">Are you sure you want to delete this document?</h4>
                <p className="text-blue-600 text-md font-semibold mt-4">
                  This action is permanent.
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition flex justify-center items-center"
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
                  className="text-blue-900 bg-blue-100 hover:bg-blue-200 active:bg-blue-100 text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none border border-blue-200"
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
                        <h4 className="text-4xl font-extrabold mb-10 text-center text-blue-500 drop-shadow-sm">Edit Document</h4>
                    </div>
                   <form onSubmit={async (e) => {
                       e.preventDefault();
                       await editDocument(docToEdit.id, editName, editTags);
                       setShowEditModal(false);
                       setDocToEdit(null);
                   }}
                   >
                   <div className="mb-6">
                       <input
                           type="text"
                           value={editName}
                           onChange={e => setEditName(e.target.value)}
                           className="mt-1 block w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition"
                           placeholder="Enter document name"
                           required
                       />
                   </div>
                   <div className="mb-6">
                       <CreatableSelect
                           isMulti
                           options={availableTags}
                           value={editTags}
                           onChange={handleTagChange}
                           onCreateOption={handleTagCreate}
                           placeholder="Add or select tags"
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
                   </div>
                    <div className="flex flex-col space-y-3">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition flex justify-center items-center"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="text-blue-700 bg-blue-100 hover:bg-blue-200 active:bg-blue-100 text-lg py-2 px-4 rounded-2xl font-bold shadow focus:outline-none border border-blue-200"
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