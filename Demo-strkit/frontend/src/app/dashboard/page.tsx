'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toolsAPI, collectionsAPI, settingsAPI } from '@/utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  bio?: string;
}

type View = 'toolbox' | 'workshops' | 'explore' | 'settings' | 'account';

interface Tool {
  id: number;
  name: string;
  roles: string[];
  description: string;
  rating: number;
  version: string;
  imageUrl?: string;
  image_url?: string; // API uses snake_case
}

interface Collection {
  id: number;
  name: string;
  is_default: boolean;
  tools_count?: number;
  tools?: Tool[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8201/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('toolbox');

  // Toolbox state
  const [showAddTool, setShowAddTool] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toolForm, setToolForm] = useState({
    name: '',
    roles: [] as string[],
    description: '',
    rating: 5,
    version: '',
    imageUrl: '',
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'role' | 'rating'>('name');

  // Toolbox categories
  const [collections, setCollections] = useState<Collection[]>([]);
  const [toolboxes, setToolboxes] = useState<string[]>(['All', 'Frontend', 'Backend', 'Design', 'DevOps', 'Testing']);
  const [activeToolbox, setActiveToolbox] = useState('All');
  const [showNewToolbox, setShowNewToolbox] = useState(false);
  const [newToolboxName, setNewToolboxName] = useState('');
  const [selectedToolsForCollection, setSelectedToolsForCollection] = useState<number[]>([]);
  const [customCollectionTools, setCustomCollectionTools] = useState<Record<string, number[]>>({});

  // Settings state
  const [viewMode, setViewMode] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [cardsPerPage, setCardsPerPage] = useState(12);
  const [defaultCollection, setDefaultCollection] = useState('All');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    toolUpdates: true,
    workshopReminders: false,
    weeklyDigest: true
  });
  const [privacy, setPrivacy] = useState({
    publicCollections: false,
    publicProfile: true,
    shareToolHistory: false
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Load data from API when user is available
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setDataLoading(true);

        // Load tools
        const toolsRes = await toolsAPI.getAll();
        if (toolsRes.ok) {
          const toolsData = await toolsRes.json();
          setTools(toolsData);
        } else {
          console.error('Failed to load tools:', toolsRes.status);
        }

        // Load collections
        const collectionsRes = await collectionsAPI.getAll();
        if (collectionsRes.ok) {
          const collectionsData: Collection[] = await collectionsRes.json();
          setCollections(collectionsData);

          // Update toolboxes list (extract collection names)
          const collectionNames = collectionsData.map(c => c.name);
          setToolboxes(collectionNames);

          // Build customCollectionTools mapping for existing logic compatibility
          const customTools: Record<string, number[]> = {};
          collectionsData.forEach(collection => {
            if (collection.tools) {
              customTools[collection.name] = collection.tools.map(t => t.id);
            }
          });
          setCustomCollectionTools(customTools);
        } else {
          console.error('Failed to load collections:', collectionsRes.status);
        }

        // Load settings
        const settingsRes = await settingsAPI.get();
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setViewMode(settingsData.view_mode);
          setCardsPerPage(settingsData.cards_per_page);
          setDefaultCollection(settingsData.default_collection);
          setNotifications({
            emailNotifications: settingsData.email_notifications,
            toolUpdates: settingsData.tool_updates,
            workshopReminders: settingsData.workshop_reminders,
            weeklyDigest: settingsData.weekly_digest,
          });
          setPrivacy({
            publicCollections: settingsData.public_collections,
            publicProfile: settingsData.public_profile,
            shareToolHistory: settingsData.share_tool_history,
          });
        } else {
          console.error('Failed to load settings:', settingsRes.status);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleAddTool = async () => {
    if (isSubmitting) return; // Prevent double submission

    try {
      setIsSubmitting(true);

      if (editingTool) {
        // Update existing tool
        const res = await toolsAPI.update(editingTool.id, {
          name: toolForm.name,
          roles: toolForm.roles,
          description: toolForm.description,
          rating: toolForm.rating,
          version: toolForm.version,
          image_url: toolForm.imageUrl,
        });

        if (res.ok) {
          const updatedTool = await res.json();
          setTools(tools.map(tool =>
            tool.id === editingTool.id ? updatedTool : tool
          ));
        } else {
          const error = await res.json();
          alert('Failed to update tool: ' + (error.message || 'Unknown error'));
          return;
        }
        setEditingTool(null);
      } else {
        // Add new tool
        const res = await toolsAPI.create({
          name: toolForm.name,
          roles: toolForm.roles,
          description: toolForm.description,
          rating: toolForm.rating,
          version: toolForm.version,
          image_url: toolForm.imageUrl,
        });

        if (res.ok) {
          const newTool = await res.json();
          setTools([...tools, newTool]);
        } else {
          const error = await res.json();
          alert('Failed to create tool: ' + (error.message || 'Unknown error'));
          return;
        }
      }

      setShowAddTool(false);
      setToolForm({
        name: '',
        roles: [],
        description: '',
        rating: 5,
        version: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error('Error saving tool:', error);
      alert('Failed to save tool. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setToolForm({
      name: tool.name,
      roles: tool.roles,
      description: tool.description,
      rating: tool.rating,
      version: tool.version,
      imageUrl: tool.imageUrl || '',
    });
    setShowAddTool(true);
    setSelectedTool(null);
  };

  const handleDeleteTool = async (toolId: number) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      try {
        const res = await toolsAPI.delete(toolId);

        if (res.ok) {
          setTools(tools.filter(tool => tool.id !== toolId));
          setSelectedTool(null);
        } else {
          const error = await res.json();
          alert('Failed to delete tool: ' + (error.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting tool:', error);
        alert('Failed to delete tool. Please try again.');
      }
    }
  };

  const handleDuplicateTool = async (tool: Tool) => {
    try {
      const res = await toolsAPI.create({
        name: `${tool.name} (Copy)`,
        roles: tool.roles,
        description: tool.description,
        rating: tool.rating,
        version: tool.version,
        image_url: tool.imageUrl || tool.image_url || '',
      });

      if (res.ok) {
        const duplicatedTool = await res.json();
        setTools([...tools, duplicatedTool]);
        setSelectedTool(null);
      } else {
        const error = await res.json();
        alert('Failed to duplicate tool: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error duplicating tool:', error);
      alert('Failed to duplicate tool. Please try again.');
    }
  };

  const handleShareTool = (tool: Tool) => {
    // For now, just copy tool info to clipboard
    const shareText = `Check out this tool: ${tool.name}\nRating: ${tool.rating}/5\nVersion: ${tool.version}\n${tool.description}`;
    navigator.clipboard.writeText(shareText);
    alert('Tool info copied to clipboard!');
  };

  const handleCreateToolbox = async () => {
    if (newToolboxName.trim() && !toolboxes.includes(newToolboxName)) {
      try {
        // Create the collection
        const createRes = await collectionsAPI.create({
          name: newToolboxName,
          is_default: false,
        });

        if (!createRes.ok) {
          const error = await createRes.json();
          alert('Failed to create collection: ' + (error.message || 'Unknown error'));
          return;
        }

        const newCollection: Collection = await createRes.json();

        // Add selected tools to the collection
        if (selectedToolsForCollection.length > 0) {
          const addToolsRes = await collectionsAPI.addTools(newCollection.id, selectedToolsForCollection);

          if (!addToolsRes.ok) {
            const error = await addToolsRes.json();
            alert('Collection created but failed to add tools: ' + (error.message || 'Unknown error'));
          }
        }

        // Update local state
        setCollections([...collections, newCollection]);
        setToolboxes([...toolboxes, newToolboxName]);
        setCustomCollectionTools({
          ...customCollectionTools,
          [newToolboxName]: selectedToolsForCollection
        });

        setNewToolboxName('');
        setSelectedToolsForCollection([]);
        setShowNewToolbox(false);
      } catch (error) {
        console.error('Error creating collection:', error);
        alert('Failed to create collection. Please try again.');
      }
    }
  };

  const handleDeleteToolbox = async (toolboxName: string) => {
    // Only prevent deleting "All"
    if (toolboxName === 'All') {
      alert('Cannot delete the "All" collection');
      return;
    }

    if (confirm(`Delete "${toolboxName}" collection?`)) {
      try {
        // Find the collection ID
        const collection = collections.find(c => c.name === toolboxName);
        if (!collection) {
          alert('Collection not found');
          return;
        }

        const res = await collectionsAPI.delete(collection.id);

        if (res.ok) {
          setCollections(collections.filter(c => c.id !== collection.id));
          setToolboxes(toolboxes.filter(t => t !== toolboxName));

          // Remove from custom collections if it exists
          const newCustomCollections = { ...customCollectionTools };
          delete newCustomCollections[toolboxName];
          setCustomCollectionTools(newCustomCollections);

          if (activeToolbox === toolboxName) {
            setActiveToolbox('All');
          }
        } else {
          const error = await res.json();
          alert('Failed to delete collection: ' + (error.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting collection:', error);
        alert('Failed to delete collection. Please try again.');
      }
    }
  };

  const toggleToolForCollection = (toolId: number) => {
    if (selectedToolsForCollection.includes(toolId)) {
      setSelectedToolsForCollection(selectedToolsForCollection.filter(id => id !== toolId));
    } else {
      setSelectedToolsForCollection([...selectedToolsForCollection, toolId]);
    }
  };

  const toggleRole = (role: string) => {
    if (toolForm.roles.includes(role)) {
      setToolForm({ ...toolForm, roles: toolForm.roles.filter(r => r !== role) });
    } else {
      setToolForm({ ...toolForm, roles: [...toolForm.roles, role] });
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await settingsAPI.update({
        view_mode: viewMode,
        cards_per_page: cardsPerPage,
        default_collection: defaultCollection,
        email_notifications: notifications.emailNotifications,
        tool_updates: notifications.toolUpdates,
        workshop_reminders: notifications.workshopReminders,
        weekly_digest: notifications.weeklyDigest,
        public_collections: privacy.publicCollections,
        public_profile: privacy.publicProfile,
        share_tool_history: privacy.shareToolHistory,
      });

      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        const error = await res.json();
        alert('Failed to save settings: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  // Filter tools based on search and active toolbox
  const filteredTools = tools.filter((tool) => {
    // Filter by toolbox category
    if (activeToolbox !== 'All') {
      const defaultToolboxes = ['Frontend', 'Backend', 'Design', 'DevOps', 'Testing'];

      if (defaultToolboxes.includes(activeToolbox)) {
        // For default toolboxes, filter by roles
        const hasMatchingRole = tool.roles.some(role =>
          role.toLowerCase() === activeToolbox.toLowerCase()
        );
        if (!hasMatchingRole) return false;
      } else {
        // For custom collections, filter by selected tool IDs
        const toolIds = customCollectionTools[activeToolbox] || [];
        if (!toolIds.includes(tool.id)) return false;
      }
    }

    // Filter by search query
    if (!searchQuery) return true;

    switch (searchType) {
      case 'name':
        return tool.name.toLowerCase().includes(searchQuery.toLowerCase());
      case 'role':
        return tool.roles.some(role => role.toLowerCase().includes(searchQuery.toLowerCase()));
      case 'rating':
        const queryRating = parseInt(searchQuery);
        return !isNaN(queryRating) && tool.rating === queryRating;
      default:
        return true;
    }
  });

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'toolbox':
        return (
          <div className="flex gap-6">
            {/* Sidebar - Toolbox Categories */}
            <div className="w-80 flex-shrink-0">
              <h2 className="text-3xl font-bold text-white mb-6">Toolbox</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Collections</h3>
                  <button
                    onClick={() => setShowNewToolbox(true)}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                    title="New Collection"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  {toolboxes.map((toolbox) => {
                    const defaultToolboxes = ['Frontend', 'Backend', 'Design', 'DevOps', 'Testing'];
                    let count = 0;

                    if (toolbox === 'All') {
                      count = tools.length;
                    } else if (defaultToolboxes.includes(toolbox)) {
                      count = tools.filter(t => t.roles.some(r => r.toLowerCase() === toolbox.toLowerCase())).length;
                    } else {
                      // Custom collection
                      const toolIds = customCollectionTools[toolbox] || [];
                      count = toolIds.length;
                    }

                    return (
                      <div
                        key={toolbox}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                          activeToolbox === toolbox
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <button
                          onClick={() => setActiveToolbox(toolbox)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <span className="font-medium">{toolbox}</span>
                          <span className={`ml-auto text-xs ${activeToolbox === toolbox ? 'text-indigo-200' : 'text-gray-500'}`}>
                            {count}
                          </span>
                        </button>
                        {toolbox !== 'All' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteToolbox(toolbox);
                            }}
                            className="ml-2 p-1 hover:bg-red-600 rounded transition-all"
                            title="Delete collection"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Info */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    Tools are automatically grouped by their roles. Create custom collections to organize them your way.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Search and Filters - Aligned Right */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mb-6">
                {/* Search Box with Integrated Type Selector */}
                <div className="relative">
                  <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                    {/* Search Type Dropdown Inside Search Box */}
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value as 'name' | 'role' | 'rating')}
                      className="px-3 py-2 bg-gray-800 text-white text-sm border-r border-gray-600 focus:outline-none cursor-pointer"
                    >
                      <option value="name">Name</option>
                      <option value="role">Role</option>
                      <option value="rating">Rating</option>
                    </select>

                    {/* Search Input */}
                    <input
                      type={searchType === 'rating' ? 'number' : 'text'}
                      min={searchType === 'rating' ? '1' : undefined}
                      max={searchType === 'rating' ? '5' : undefined}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        searchType === 'name' ? 'Search tools...' :
                        searchType === 'role' ? 'e.g., backend, frontend...' :
                        'Enter rating (1-5)'
                      }
                      className="flex-1 px-4 py-2 bg-gray-700 text-white focus:outline-none placeholder-gray-400 w-64"
                    />

                    {/* Clear Button */}
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-3 text-gray-400 hover:text-white"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Add Tool Button */}
                <button
                  onClick={() => setShowAddTool(true)}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 whitespace-nowrap"
                >
                  + Add Tool
                </button>
              </div>

              {/* Search Results Info */}
              {searchQuery && (
                <div className="mb-4 text-gray-400 text-sm">
                  Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </div>
              )}

              {/* Tools Grid */}
              {filteredTools.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                  <p className="text-gray-400">
                    {searchQuery ? 'No tools found matching your search.' : 'No tools yet. Click "Add Tool" to get started!'}
                  </p>
                </div>
              ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 ${
                  viewMode === 'compact' ? 'lg:grid-cols-4' :
                  viewMode === 'spacious' ? 'lg:grid-cols-2' :
                  'lg:grid-cols-3'
                } gap-6`}>
                  {filteredTools.slice(0, cardsPerPage).map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool)}
                      className={`group bg-gray-900 border border-gray-800 rounded-2xl hover:border-indigo-500 transition-all duration-300 hover:scale-105 text-left ${
                        viewMode === 'compact' ? 'p-4' :
                        viewMode === 'spacious' ? 'p-8' :
                        'p-6'
                      }`}
                    >
                      {/* Tool Image */}
                      {(tool.imageUrl || tool.image_url) && (
                        <div className="mb-4 h-32 bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={tool.imageUrl || tool.image_url || ''}
                            alt={tool.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Tool Name */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                        {tool.name}
                      </h3>

                      {/* Roles */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tool.roles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs"
                          >
                            {role}
                          </span>
                        ))}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= tool.rating ? 'text-yellow-500' : 'text-gray-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">{tool.rating}/5</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'workshops':
        return (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Workshops</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <p className="text-gray-400">Interactive coding workshops will be listed here.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
            <div className="space-y-6">
              {/* Profile Settings */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Profile Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <select
                        defaultValue={user.role}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="backend">Backend Developer</option>
                        <option value="frontend">Frontend Developer</option>
                        <option value="designer">Designer</option>
                        <option value="devops">DevOps Engineer</option>
                        <option value="qa">QA Engineer</option>
                        <option value="manager">Manager</option>
                        <option value="product">Product Manager</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Change Password</label>
                      <button className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Preferences */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Display Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">View Mode</label>
                    <div className="flex gap-3">
                      {(['compact', 'comfortable', 'spacious'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setViewMode(mode)}
                          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                            viewMode === mode
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cards Per Page</label>
                      <select
                        value={cardsPerPage}
                        onChange={(e) => setCardsPerPage(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value={6}>6 cards</option>
                        <option value={12}>12 cards</option>
                        <option value={24}>24 cards</option>
                        <option value={48}>48 cards</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Default Collection</label>
                      <select
                        value={defaultCollection}
                        onChange={(e) => setDefaultCollection(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        {toolboxes.map((toolbox) => (
                          <option key={toolbox} value={toolbox}>{toolbox}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Notification Settings</h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'toolUpdates', label: 'Tool Updates', description: 'Get notified when tools in your collections are updated' },
                    { key: 'workshopReminders', label: 'Workshop Reminders', description: 'Reminders for upcoming workshops' },
                    { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of popular tools and activities' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-gray-400 text-sm">{item.description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  {[
                    { key: 'publicCollections', label: 'Public Collections', description: 'Allow others to view your collections' },
                    { key: 'publicProfile', label: 'Public Profile', description: 'Make your profile visible to other users' },
                    { key: 'shareToolHistory', label: 'Share Tool History', description: 'Allow others to see your tool usage history' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-gray-400 text-sm">{item.description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy[item.key as keyof typeof privacy]}
                          onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      case 'account':
        return (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Account</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Name</div>
                  <div className="text-white text-lg font-semibold">{user.name}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Email</div>
                  <div className="text-white text-lg font-semibold">{user.email}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Role</div>
                  <div className="text-white text-lg font-semibold capitalize">{user.role}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <div className="text-white text-lg font-semibold">Active</div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Navigation */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Navigation */}
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Gauss
              </h1>

              {/* Navigation Buttons */}
              <nav className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setActiveView('toolbox')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === 'toolbox'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Toolbox
                </button>
                <button
                  onClick={() => setActiveView('workshops')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === 'workshops'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Workshops
                </button>
                <button
                  onClick={() => router.push('/explore')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  Explore Tools
                </button>
                <button
                  onClick={() => setActiveView('settings')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === 'settings'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Right: Account */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('account')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'account'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <p className="text-gray-400 text-lg">
            Welcome back, <span className="text-white font-medium">{user.name}</span>
          </p>
        </div>

        {/* Dynamic Content Area */}
        {renderContent()}
      </main>

      {/* Add Tool Modal */}
      {showAddTool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{editingTool ? 'Edit Tool' : 'Add Tool'}</h2>
              <button
                onClick={() => {
                  setShowAddTool(false);
                  setEditingTool(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Add Tool Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAddTool(); }} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tool Name *
                </label>
                <input
                  type="text"
                  required
                  value={toolForm.name}
                  onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="e.g., Visual Studio Code"
                />
              </div>

              {/* Roles - Multiple Select */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Suitable for Roles * (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['backend', 'frontend', 'qa', 'designer', 'manager', 'devops', 'product'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        toolForm.roles.includes(role)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={toolForm.description}
                  onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="Describe the tool and its main features..."
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating * ({toolForm.rating}/5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={toolForm.rating}
                  onChange={(e) => setToolForm({ ...toolForm, rating: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>

              {/* Version */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Latest Version *
                </label>
                <input
                  type="text"
                  required
                  value={toolForm.version}
                  onChange={(e) => setToolForm({ ...toolForm, version: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="e.g., v1.85.0"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={toolForm.imageUrl}
                  onChange={(e) => setToolForm({ ...toolForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="https://example.com/image.png"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform ${
                  isSubmitting
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Saving...' : (editingTool ? 'Update Tool' : 'Add Tool')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Toolbox Modal */}
      {showNewToolbox && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">New Collection</h2>
              <button
                onClick={() => {
                  setShowNewToolbox(false);
                  setNewToolboxName('');
                  setSelectedToolsForCollection([]);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateToolbox(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={newToolboxName}
                  onChange={(e) => setNewToolboxName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="e.g., My Favorites, Work Tools..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Tools * ({selectedToolsForCollection.length} selected)
                </label>
                <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
                  {tools.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No tools available. Add some tools first!</p>
                  ) : (
                    tools.map((tool) => (
                      <label
                        key={tool.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          selectedToolsForCollection.includes(tool.id)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedToolsForCollection.includes(tool.id)}
                          onChange={() => toggleToolForCollection(tool.id)}
                          className="w-5 h-5 rounded border-gray-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{tool.name}</div>
                          <div className="flex gap-1 mt-1">
                            {tool.roles.slice(0, 3).map((role) => (
                              <span
                                key={role}
                                className={`text-xs px-2 py-0.5 rounded ${
                                  selectedToolsForCollection.includes(tool.id)
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-700 text-gray-400'
                                }`}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(tool.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={selectedToolsForCollection.length === 0}
                className={`w-full py-3 rounded-lg font-medium transition-all transform ${
                  selectedToolsForCollection.length === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105'
                }`}
              >
                Create Collection
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tool Detail Modal */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedTool.name}</h2>
              <button
                onClick={() => setSelectedTool(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tool Details */}
            <div className="space-y-6">
              {/* Image */}
              {(selectedTool.imageUrl || selectedTool.image_url) && (
                <div className="w-full h-48 bg-gray-900 rounded-lg overflow-hidden">
                  <img
                    src={selectedTool.imageUrl || selectedTool.image_url || ''}
                    alt={selectedTool.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Roles */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Suitable for</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTool.roles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p className="text-white leading-relaxed">{selectedTool.description}</p>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Rating</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${
                          star <= selectedTool.rating ? 'text-yellow-500' : 'text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white font-semibold">{selectedTool.rating}/5</span>
                </div>
              </div>

              {/* Version */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Latest Version</h3>
                <p className="text-white font-mono">{selectedTool.version}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleEditTool(selectedTool)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleShareTool(selectedTool)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  <button
                    onClick={() => handleDuplicateTool(selectedTool)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDeleteTool(selectedTool.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
