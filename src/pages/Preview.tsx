import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyProjects } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import type { Project, Version } from "../types";
import api from "@/configs/axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const Preview = () => {
  const {data:session, isPending} = authClient.useSession();
  const { projectId, versionId } = useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCode = async () => {
    // setTimeout(() => {
    //   const code = dummyProjects.find(
    //     (project) => project.id === projectId
    //   )?.current_code;

    //   if (code) {
    //     setCode(code);
    //     setLoading(false);
    //   }
    // }, 2000);
    try {
      const {data} = await api.get(`/api/project/preview/${projectId}`);
      setCode(data.project.current_code);
      if(versionId){
        data.project.versions.forEach((version:Version) =>{
          if(version.id === versionId){
            setCode(version.code);
          }
        })
      }
      setLoading(false);
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if(!isPending && session?.user){
      fetchCode();
    }
  }, [session?.user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Loader2Icon className="size-7 animate-spin text-gray-400 dark:text-indigo-200" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900">
      {code && (
        <ProjectPreview
          project={{ current_code: code } as Project}
          isGenerating={false}
          showEditorPanel={false}
        />
      )}
    </div>
  );
};

export default Preview;
