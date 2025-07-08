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

    useEffect(() => {
        fetchDocuments();
    }, []);

    // template from https://flowbite.com/docs/components/tables/
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-blue-900">
                <thead className="text-xs text-blue-700 uppercase bg-blue-50">
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
                    <tr key={doc.id} className="bg-white border-b border-blue-100 hover:bg-blue-50">
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
                               className="font-medium text-blue-600 hover:underline"
                            >
                               Download
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    );
};

export default Documents;