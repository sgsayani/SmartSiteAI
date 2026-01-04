import React, { useEffect, useRef, useState } from "react";
import type { Message, Project, Version } from "../types";
import {
  BotIcon,
  EyeIcon,
  Loader2Icon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isMenuOpen: boolean;
  project: Project;
  setProject: (project: Project) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

const Sidebar = ({
  isMenuOpen,
  project,
  setProject,
  isGenerating,
  setIsGenerating,
}: SidebarProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const handleRollBack = async (versionId: string) => {};

  const handleRevisions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [project.conversation.length, isGenerating]);

  return (
    <div
      className={`
        h-full sm:max-w-sm rounded-xl transition-all
        ${isMenuOpen ? "max-sm:w-0 overflow-hidden" : "w-full"}
        bg-[#FFFFFF] dark:bg-[#0B0F1A]
        border border-[#E2E8F0] dark:border-white/10
      `}
    >
      <div className="flex flex-col h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4">
          {[...project.conversation, ...project.versions]
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            )
            .map((message) => {
              const isMessage = "content" in message;

              if (isMessage) {
                const msg = message as Message;
                const isUser = msg.role === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center">
                        <BotIcon className="size-5 text-white" />
                      </div>
                    )}

                    <div
                      className={`
                        max-w-[80%] p-2 px-4 rounded-2xl text-sm mt-5 leading-relaxed shadow-sm
                        ${
                          isUser
                            ? "bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white rounded-tr-none"
                            : "rounded-tl-none bg-[#F8FAFC] dark:bg-white/5 text-[#0F172A] dark:text-slate-200 border border-[#E2E8F0] dark:border-white/10"
                        }
                      `}
                    >
                      {msg.content}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#E2E8F0] dark:bg-white/10 flex items-center justify-center">
                        <UserIcon className="size-5 text-[#64748B] dark:text-slate-300" />
                      </div>
                    )}
                  </div>
                );
              } else {
                const ver = message as Version;
                return (
                  <div
                    key={ver.id}
                    className="
                      w-4/5 mx-auto my-2 p-3 rounded-xl shadow
                      bg-[#F8FAFC] dark:bg-white/5
                      text-[#0F172A] dark:text-slate-200
                      border border-[#E2E8F0] dark:border-white/10
                      flex flex-col gap-2
                    "
                  >
                    <div className="text-xs font-medium">
                      Code updated <br />
                      <span className="text-[#64748B] dark:text-slate-400 font-normal">
                        {new Date(ver.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {project.current_version_index === ver.id ? (
                        <button className="px-3 py-1 rounded-md text-xs bg-[#E2E8F0] dark:bg-white/10 text-[#64748B] dark:text-slate-300">
                          Current version
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRollBack(ver.id)}
                          className="
                            px-3 py-1 rounded-md text-xs text-white
                            bg-gradient-to-r from-[#4F46E5] to-[#4338CA]
                            hover:opacity-90 transition
                          "
                        >
                          Roll back to this version
                        </button>
                      )}

                      <Link
                        target="_blank"
                        to={`/preview/${project.id}/${ver.id}`}
                      >
                        <EyeIcon
                          className="
                            size-6 p-1 rounded
                            bg-[#E2E8F0] dark:bg-white/10
                            hover:bg-[#4F46E5] hover:text-white
                            transition
                          "
                        />
                      </Link>
                    </div>
                  </div>
                );
              }
            })}

          {/* Bot typing */}
          {isGenerating && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center">
                <BotIcon className="size-5 text-white" />
              </div>
              <div className="flex gap-1.5 h-full items-end">
                <span className="size-2 rounded-full animate-bounce bg-[#64748B]" />
                <span
                  className="size-2 rounded-full animate-bounce bg-[#64748B]"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="size-2 rounded-full animate-bounce bg-[#64748B]"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}

          <div ref={messageRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleRevisions} className="m-3 relative">
          <textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            rows={4}
            placeholder="Describe your website or request changes..."
            disabled={isGenerating}
            className="
              w-full p-3 pr-12 rounded-xl resize-none text-sm outline-none
              bg-[#FFFFFF] dark:bg-white/5
              text-[#0F172A] dark:text-slate-200
              placeholder-[#64748B]
              border border-[#E2E8F0] dark:border-white/10
              focus:ring-2 focus:ring-[#06B6D4]/50
              transition-all
            "
          />

          <button
            disabled={isGenerating || !input.trim()}
            className="
              absolute bottom-2.5 right-2.5 rounded-full
              bg-gradient-to-r from-[#4F46E5] to-[#4338CA]
              hover:opacity-90 text-white
              disabled:opacity-60 transition
            "
          >
            {isGenerating ? (
              <Loader2Icon className="size-7 p-1.5 animate-spin" />
            ) : (
              <SendIcon className="size-7 p-1.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
