'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';

interface ExploreTool {
  id: number;
  name: string;
  description: string;
  rating: number;
  version: string;
  image_url?: string;
  roles: string[];
  category: string;
  popularity: number;
}

export default function ExplorePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'personalized' | 'all'>('personalized');
  const [tools, setTools] = useState<ExploreTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    loadTools('personalized');
  }, [router]);

  const loadTools = async (tab: 'personalized' | 'all') => {
    try {
      setLoading(true);
      const endpoint = tab === 'personalized' ? '/explore/personalized' : '/explore/all';
      const response = await apiCall(endpoint);

      if (response.ok) {
        const data = await response.json();
        setTools(data);
      } else {
        console.error('Failed to load tools');
      }
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'personalized' | 'all') => {
    setActiveTab(tab);
    loadTools(tab);
  };

  const handleAddTool = async (tool: ExploreTool) => {
    try {
      const toolData = {
        name: tool.name,
        description: tool.description,
        rating: tool.rating,
        version: tool.version,
        image_url: tool.image_url,
        roles: tool.roles,
      };
      console.log('Sending tool data:', toolData);

      const response = await apiCall('/tools', {
        method: 'POST',
        body: JSON.stringify(toolData),
      });

      if (response.ok) {
        alert(`${tool.name} has been added to your tools!`);
        // Optionally, redirect to dashboard or refresh
        // router.push('/dashboard');
      } else {
        const errorData = await response.json();
        console.error('Failed to add tool - Full error:', errorData);
        console.error('Validation errors:', errorData.errors);
        alert(`Failed to add tool: ${JSON.stringify(errorData.errors || errorData.message || 'Unknown error')}`);
      }
    } catch (error) {
      console.error('Error adding tool:', error);
      alert('Failed to add tool. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Explore Tools</h1>
              <p className="mt-2 text-gray-400">Discover new tools to enhance your workflow</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => handleTabChange('personalized')}
            className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all transform hover:scale-105 ${
              activeTab === 'personalized'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Personalized Suggestions
            </div>
          </button>
          <button
            onClick={() => handleTabChange('all')}
            className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all transform hover:scale-105 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Just Explore
            </div>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Tools Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(tool.rating)}
                      <span className="text-sm text-gray-400">v{tool.version}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{tool.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {tool.category}
                  </div>
                  <button
                    onClick={() => handleAddTool(tool)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Add to My Tools
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tools.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-400 mb-2">No tools found</h3>
            <p className="text-gray-500">Try switching to a different tab</p>
          </div>
        )}
      </div>
    </div>
  );
}
