import { useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import api from "@/configs/axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const MyProjects = () => {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/api/user/projects");
      setProjects(data.projects);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this project?");
      if (!confirm) return;
      const { data } = await api.delete(`/api/project/${projectId}`);
      toast.success(data.message);
      fetchProjects();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (session?.user && !isPending) {
      fetchProjects();
    } else if (!isPending && !session?.user) {
      navigate("/");
      toast("Please login to view your projects");
    }
  }, [session?.user]);

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
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-2xl font-semibold cyber-glow-text">
                My Projects
              </h1>

              <button
                onClick={() => navigate("/")}
                className="cyber-btn flex items-center gap-2 px-4 py-2 rounded-md"
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
                  className="cyber-glass-card group cursor-pointer"
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

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex justify-between items-center mt-6"
                    >
                      <span className="text-xs opacity-60">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex gap-2 text-sm">
                        <button
                          onClick={() => navigate(`/preview/${project.id}`)}
                          className="cyber-mini-btn"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="cyber-mini-btn"
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
                    className="cyber-delete-btn"
                  >
                    <TrashIcon size={16} />
                  </button>

                  <div className="cyber-scanline" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-3xl font-semibold opacity-70">
              You have no projects
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

export default MyProjects;
