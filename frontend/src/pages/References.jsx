import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const References = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [formData, setFormData] = useState({ text: '' });

  // Fetch prompts from API
  const fetchPrompts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9004/api/prompts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPrompts(data.data || []);
      } else {
        toast.error('Failed to fetch prompts');
      }
    } catch (error) {
      toast.error('Error fetching prompts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      toast.error('Please enter prompt text');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingPrompt 
        ? `http://localhost:9004/api/prompts/${editingPrompt.id}`
        : 'http://localhost:9004/api/prompts';
      
      const method = editingPrompt ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Prompt saved successfully');
        setShowModal(false);
        setEditingPrompt(null);
        setFormData({ text: '' });
        fetchPrompts();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save prompt');
      }
    } catch (error) {
      toast.error('Error saving prompt');
      console.error('Error:', error);
    }
  };

  // Handle edit
  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
    setFormData({ text: prompt.text });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (promptId) => {
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9004/api/prompts/${promptId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Prompt deleted successfully');
        fetchPrompts();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete prompt');
      }
    } catch (error) {
      toast.error('Error deleting prompt');
      console.error('Error:', error);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPrompt(null);
    setFormData({ text: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">References</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Prompt</span>
        </button>
      </div>

      {/* Prompts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first prompt reference.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Prompt
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900 whitespace-pre-wrap">{prompt.text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {new Date(prompt.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(prompt)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit prompt"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prompt.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete prompt"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPrompt ? 'Edit Prompt' : 'Add New Prompt'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt Text
                  </label>
                  <textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter your prompt text here..."
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingPrompt ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default References;
