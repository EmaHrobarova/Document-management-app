import React, {useEffect, useState} from "react";
import api from "../services/api.ts";

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

    useEffect(() => {
        fetchDocuments();
    }, []);

    // template from https://flowbite.com/docs/components/tables/
    return (
        <>
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
                {documents.map((doc) => (
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
        </>
    );
}

export default Documents;