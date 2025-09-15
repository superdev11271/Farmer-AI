import React, { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { apiConfig } from '../config/api';

// Reusable Confirmation Modal
const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentUpload = () => {
  const [documents, setDocuments] = useState([]);
  const [modalData, setModalData] = useState(null);

  // Fetch docs on load
  const fetchDocuments = async () => {
    try {
      const res = await axios.get(apiConfig.endpoints.documents + "/", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload files or folder
  const handleFiles = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post(apiConfig.endpoints.documents + "/", formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(`${file.name} uploaded`);
      } catch (err) {
        console.error(err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    fetchDocuments();
  };

  const getStatusBadge = (status) => {
    const config = {
      1: { color: "bg-yellow-200 text-yellow-800", icon: FileText, label: "Uploaded" },
      2: { color: "bg-blue-200 text-blue-800", icon: Clock, label: "Processing" },
      3: { color: "bg-green-200 text-green-800", icon: CheckCircle, label: "Processed" },
      4: { color: "bg-red-200 text-red-800", icon: XCircle, label: "Error" },
    };
    const { color, icon: Icon, label } = config[status] || config[1];
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </span>
    );
  };

  // Confirm remove single
  const confirmRemove = (id) => {
    setModalData({
      title: "Remove Document",
      message: "Are you sure you want to remove this document?",
      onConfirm: async () => {
        try {
          await axios.delete(`${apiConfig.endpoints.documents}/${id}`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") },
          });
          toast.success("Document removed");
          fetchDocuments();
        } catch (err) {
          console.error(err);
          toast.error("Failed to remove document");
        }
        setModalData(null);
      },
    });
  };

  // Confirm remove all
  const confirmRemoveAll = () => {
    setModalData({
      title: "Remove All Documents",
      message: "Are you sure you want to remove all documents?",
      onConfirm: async () => {
        try {
          await axios.delete(`${apiConfig.endpoints.documents}/remove_all`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") },
          });
          toast.success("All documents removed");
          fetchDocuments();
        } catch (err) {
          console.error(err);
          toast.error("Failed to remove all documents");
        }
        setModalData(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoice Documents</h1>
        <p className="text-gray-600">
          Upload PDFs or select a folder to see all documents and their status.
        </p>
      </div>

      {/* Upload Section */}
      <div className="flex items-center space-x-4">
        <label className="cursor-pointer px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center hover:bg-primary-700 transition">
          <Upload className="h-5 w-5 mr-2" />
          Select PDF(s)
          <input
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </label>
        <label className="cursor-pointer px-4 py-2 bg-secondary-600 text-white rounded-lg flex items-center hover:bg-secondary-700 transition">
          <Upload className="h-5 w-5 mr-2" />
          Select Folder
          <input
            type="file"
            accept=".pdf"
            multiple
            webkitdirectory="true"
            directory=""
            className="hidden"
            onChange={handleFiles}
          />
        </label>
        {documents.length > 0 && (
          <button
            onClick={confirmRemoveAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center hover:bg-red-700 transition"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Remove All
          </button>
        )}
      </div>

      {/* Documents Table */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Document Name</th>
              <th className="table-header">Uploaded At</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No documents uploaded yet.
                </td>
              </tr>
            )}
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="table-cell font-medium text-gray-900">
                  {doc.original_name}
                </td>
                <td className="table-cell">
                  {new Date(doc.created_at).toLocaleString()}
                </td>
                <td className="table-cell">{getStatusBadge(doc.status)}</td>
                <td className="table-cell flex items-center space-x-2">
                  <button
                    className="p-1 text-blue-500 hover:text-blue-700 transition"
                    onClick={() =>
                      window.open(apiConfig.getDocumentUrl(doc.path), "_blank")
                    }
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => confirmRemove(doc.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {modalData && (
        <ConfirmModal
          open={true}
          title={modalData.title}
          message={modalData.message}
          onConfirm={modalData.onConfirm}
          onCancel={() => setModalData(null)}
        />
      )}
    </div>
  );
};

export default DocumentUpload;
