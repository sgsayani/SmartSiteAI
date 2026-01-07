import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { Project } from "../types";
import { iframeScript } from "../assets/assets";
import EditorPanel from "./EditorPanel";
import LoaderSteps from "./LoaderSteps";

export interface projectPreviewRef {
  getCode: () => string | undefined;
}

interface ProjectPreviewProps {
  project: Project;
  isGenerating: boolean;
  device?: "phone" | "tablet" | "desktop";
  showEditorPanel?: boolean;
}

const ProjectPreview = forwardRef<
  projectPreviewRef,
  ProjectPreviewProps
>(
  (
    {
      project,
      isGenerating,
      device = "desktop",
      showEditorPanel = true,
    },
    ref
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [selectedElement, setSelectedElement] = useState<any>(null);

    const resolutions = {
      phone: "w-[412px]",
      tablet: "w-[768px]",
      desktop: "w-full",
    };

    useImperativeHandle(ref, () => ({
      getCode: () => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return undefined;

        doc
          .querySelectorAll(
            ".ai-selected-element,[data-ai-selected]"
          )
          .forEach((el) => {
            el.classList.remove("ai-selected-element");
            el.removeAttribute("data-ai-selected");
            (el as HTMLElement).style.outline = "";
          });

        const previewStyle =
          doc.getElementById("ai-preview-style");
        if (previewStyle) previewStyle.remove();

        const previewScript =
          doc.getElementById("ai-preview-script");
        if (previewScript) previewScript.remove();

        return doc.documentElement.outerHTML;
      },
    }));

    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "ELEMENT_SELECTED") {
          setSelectedElement(event.data.payload);
        } else if (event.data.type === "CLEAR_SELECTION") {
          setSelectedElement(null);
        }
      };

      window.addEventListener("message", handleMessage);
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }, []);

    const handleUpdate = (updates: any) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "UPDATE_ELEMENT",
            payload: updates,
          },
          "*"
        );
      }
    };

    const injectPreview = (html: string) => {
      if (!html) return "";
      if (!showEditorPanel) return html;

      if (html.includes("</body>")) {
        return html.replace("</body>", iframeScript + "</body>");
      } else {
        return html + iframeScript;
      }
    };

    return (
      <div
        className="
          relative flex-1 h-full rounded-xl overflow-hidden
          bg-[#FFFFFF] dark:bg-[#0B0F1A]
          border border-[#E2E8F0] dark:border-white/10
          shadow-sm dark:shadow-none
          max-sm:ml-2
        "
      >
        {project.current_code ? (
          <>
            <iframe
              ref={iframeRef}
              srcDoc={injectPreview(project.current_code)}
              className={`
                h-full mx-auto transition-all
                bg-white dark:bg-[#0B0F1A]
                ${resolutions[device]}
              `}
            />

            {showEditorPanel && selectedElement && (
              <EditorPanel
                selectedElement={selectedElement}
                onUpdate={handleUpdate}
                onClose={() => {
                  setSelectedElement(null);
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                      { type: "CLEAR_SELECTION_REQUEST" },
                      "*"
                    );
                  }
                }}
              />
            )}
          </>
        ) : (
          isGenerating && (
            <LoaderSteps/>
            // <div
            //   className="
            //     flex items-center justify-center h-full
            //     text-sm text-[#64748B] dark:text-slate-400
            //   "
            // >
              
            // </div>
          )
        )}
      </div>
    );
  }
);

export default ProjectPreview;
