import React, { useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import { dummyProjects } from "../assets/assets";
import Footer from "../components/Footer";
import api from "@/configs/axios";
import { toast } from "sonner";

const Community = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const {data} = await api.get('/api/projects/published');
      setProjects(data.projects);
      setLoading(false);
      
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
      
    }
  }

  useEffect(() => {
    // setProjects(dummyProjects);
    // setTimeout(() => setLoading(false), 1000);
    fetchProjects()
  }, []);

  return (
    <>
      <div className="px-4 md:px-16 lg:px-24 xl:px-32 bg-slate-50 dark:bg-gray-950 min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2Icon className="size-7 animate-spin text-blue-600" />
          </div>
        ) : projects.length > 0 ? (
          <div className="py-10 min-h-[80vh]">
            {/* ✅ FIXED HEADING */}
            <h1 className="mb-12 text-2xl font-semibold text-slate-900 dark:text-white">
              Published projects
            </h1>

            <div className="flex flex-wrap gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/view/${project.id}`}
                  target="_blank"
                  className="
                    group relative w-72 max-sm:mx-auto
                    rounded-xl overflow-hidden
                    bg-white dark:bg-gray-900/60
                    border border-slate-200 dark:border-gray-700
                    transition-all duration-300
                    hover:border-blue-600 dark:hover:border-blue-500
                    hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                    dark:hover:shadow-[0_0_0_1px_rgba(37,99,235,0.45)]
                  "
                >
                  {/* Preview */}
                  <div className="relative w-full h-40 bg-slate-100 dark:bg-gray-900 overflow-hidden border-b border-slate-200 dark:border-gray-800">
                    {project.current_code ? (
                      <iframe
                        srcDoc={project.current_code}
                        className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none"
                        sandbox="allow-scripts allow-same-origin"
                        style={{ transform: "scale(0.25)" }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        No Preview
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-slate-900 dark:text-white line-clamp-2">
                        {project.name}
                      </h2>
                      <span className="px-2.5 py-0.5 mt-1 ml-2 text-xs rounded-full bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700">
                        Website
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-600 dark:text-gray-400 line-clamp-2">
                      {project.initial_prompt}
                    </p>

                    <div className="flex justify-between items-center mt-6">
                      <span className="text-xs text-slate-500 dark:text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-blue-600 text-white size-5 rounded-full flex items-center justify-center text-xs font-semibold">
                          {project.user?.name?.slice(0, 1)}
                        </span>
                        <span className="text-slate-700 dark:text-gray-300">
                          {project.user?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-3xl font-semibold text-slate-700 dark:text-gray-300">
              You have no projects
            </h1>
            <button
              onClick={() => navigate("/")}
              className="
                mt-5 flex items-center gap-2
                px-5 py-2 rounded-md
                bg-blue-600 hover:bg-blue-500
                text-white transition-all
              "
            >
              <PlusIcon size={18} />
              Create New
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Community;
