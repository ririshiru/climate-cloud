import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../Context/AppContext';

const InvestorsPage = () => {
  const { theme } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSDG, setSelectedSDG] = useState('All');

  useEffect(() => {
    fetchPublicProjects();
  }, []);

  const fetchPublicProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, users(name, profession)') // Join with users table to get innovator name
        .eq('is_public', true);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching public projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on selected SDG
  const filteredProjects = selectedSDG === 'All'
    ? projects
    : projects.filter(p => p.sdg_tags && p.sdg_tags.includes(parseInt(selectedSDG) || selectedSDG));

  const sdgOptions = ['All', 2, 6, 7, 11, 13, 14, 15]; // Common SDGs

  if (loading) return <div className="p-10 text-center dark:text-white">Loading opportunities...</div>;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#80609F] dark:text-primary">Investor Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Discover vetted climate solutions from top innovators.</p>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 md:mt-0 flex items-center gap-2 overflow-x-auto max-w-full pb-2">
          <span className="text-sm font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">Filter by SDG:</span>
          {sdgOptions.map(sdg => (
            <button
              key={sdg}
              onClick={() => setSelectedSDG(sdg)}
              className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap
                                ${selectedSDG === sdg
                  ? 'bg-[#80609F] text-white dark:bg-primary dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-[#3E3452] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#4E4265]'}`}
            >
              {sdg === 'All' ? 'All' : `SDG ${sdg}`}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 dark:text-gray-400">
          <p className="text-xl">No projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white dark:bg-[#282136] rounded-xl shadow-lg border border-gray-100 dark:border-[#583C79] overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    {project.sdg_tags && project.sdg_tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                        SDG {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 dark:text-white leading-tight">{project.title}</h3>

                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-1">Problem</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{project.original_problem}</p>
                </div>

                {project.solution_plan && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-1">Proposed Solution</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{project.solution_plan}</p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#3E3452] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#4E4265] flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                      {project.users?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold dark:text-white">{project.users?.name || 'Unknown Innovator'}</p>
                      <p className="text-gray-500 dark:text-gray-400">{project.users?.profession || 'Innovator'}</p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-[#80609F] dark:text-primary hover:underline">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestorsPage;