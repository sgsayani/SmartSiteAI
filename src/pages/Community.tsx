import React, { useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import api from "@/configs/axios";
import { toast } from "sonner";

const Community = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/api/project/published");
      setProjects(data.projects);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <div className="px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen cyber-root">
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2Icon className="size-7 animate-spin text-cyan-400" />
          </div>
        ) : projects.length > 0 ? (
          <div className="py-10 min-h-[80vh]">
            {/* Header */}
            <h1 className="mb-12 text-2xl font-semibold cyber-glow-text">
              Published Projects
            </h1>

            {/* Cards */}
            <div className="flex flex-wrap gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/view/${project.id}`}
                  target="_blank"
                  className="cyber-glass-card group"
                >
                  {/* Preview */}
                  <div className="cyber-preview-frame">
                    {project.current_code ? (
                      <iframe
                        srcDoc={project.current_code}
                        className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none"
                        sandbox="allow-scripts allow-same-origin"
                        style={{ transform: "scale(0.25)" }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full opacity-60">
                        No Preview
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 relative z-10">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium line-clamp-2 cyber-glow-text">
                        {project.name}
                      </h2>
                      <span className="cyber-pill">Website</span>
                    </div>

                    <p className="mt-1 text-sm opacity-70 line-clamp-2">
                      {project.initial_prompt}
                    </p>

                    <div className="flex justify-between items-center mt-6">
                      <span className="text-xs opacity-60">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-cyan-500 text-black size-5 rounded-full flex items-center justify-center text-xs font-semibold">
                          {project.user?.name?.slice(0, 1)}
                        </span>
                        <span className="opacity-80">
                          {project.user?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scanline */}
                  <div className="cyber-scanline" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-3xl font-semibold opacity-70">
              No published projects yet
            </h1>
            <button
              onClick={() => navigate("/")}
              className="cyber-btn mt-5 flex items-center gap-2 px-5 py-2 rounded-md"
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
