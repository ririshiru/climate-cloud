import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../Context/AppContext';

const ImpactPage = () => {
  const { user } = useAuth();
  const { theme } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      // Handle both Appwrite ID ($id) and potential Supabase ID structure
      const userId = user.$id || user.user_id;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitToMarketplace = async (projectId) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_public: true })
        .eq('id', projectId);

      if (error) throw error;

      // Update local state
      setProjects(prev => prev.map(p =>
        p.id === projectId ? { ...p, is_public: true } : p
      ));
      alert("Project submitted to the Marketplace!");
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to submit project.");
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Loading your impact...</div>;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#80609F] dark:text-primary">My Impact Dashboard</h1>

      {projects.length === 0 ? (
        <div className="text-center text-gray-500 mt-10 dark:text-gray-400">
          <p className="text-xl mb-2">You haven't started any projects yet.</p>
          <p>Go to the Chat to discover new challenges!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white dark:bg-[#282136] p-6 rounded-xl shadow-lg border border-gray-100 dark:border-[#583C79] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.original_problem}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.sdg_tags && project.sdg_tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-gray-100 dark:bg-[#3E3452] rounded-full dark:text-gray-200">
                      SDG {tag}
                    </span>
                  ))}
                </div>

                {project.solution_plan ? (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                    <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-1">Solution Drafted</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{project.solution_plan}</p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                    <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase mb-1">Action Required</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Draft a solution in the chat to proceed.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#3E3452]">
                {project.is_public ? (
                  <span className="text-green-500 text-sm font-semibold flex items-center gap-2">
                    ✓ Live on Marketplace
                  </span>
                ) : (
                  <button
                    onClick={() => submitToMarketplace(project.id)}
                    disabled={!project.solution_plan}
                    className={`w-full py-2 rounded-lg transition-colors text-sm font-semibold ${project.solution_plan
                        ? 'bg-[#80609F] text-white hover:bg-[#6A4D85] dark:bg-primary dark:text-gray-900'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                      }`}
                  >
                    {project.solution_plan ? 'Submit to Marketplace' : 'Draft Solution First'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImpactPage;