import { useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dummyProjects } from "../assets/assets";
import Footer from "../components/Footer";

const MyProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProjects(dummyProjects);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const deleteProject = async (projectId: string) => {
    console.log("Delete project:", projectId);
  };

  return (
    <>
      <div className="px-4 md:px-16 lg:px-24 xl:px-32 bg-slate-50 dark:bg-gray-950 min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2Icon className="size-7 animate-spin text-blue-600" />
          </div>
        ) : projects.length > 0 ? (
          <div className="py-10 min-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                My Projects
              </h1>

              <button
                onClick={() => navigate("/")}
                className="
                  flex items-center gap-2
                  px-4 py-2 rounded-md
                  bg-blue-600 hover:bg-blue-500
                  text-white transition-all active:scale-95
                "
              >
                <PlusIcon size={18} />
                Create New
              </button>
            </div>

            {/* Cards */}
            <div className="flex flex-wrap gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="
                    relative group w-72 max-sm:mx-auto cursor-pointer
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

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex justify-between items-center mt-6"
                    >
                      <span className="text-xs text-slate-500 dark:text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex gap-2 text-sm">
                        <button
                          onClick={() => navigate(`/preview/${project.id}`)}
                          className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    className="
                      absolute top-3 right-3
                      scale-0 group-hover:scale-100
                      bg-white dark:bg-gray-900
                      border border-slate-200 dark:border-gray-700
                      p-1.5 rounded-md
                      text-red-500
                      transition-all
                    "
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
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
              className="mt-5 flex items-center gap-2 px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-all"
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

export default MyProjects;
