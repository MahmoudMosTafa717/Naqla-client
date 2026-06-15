import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bot, 
  Send, 
  User, 
  Loader2, 
  ArrowLeft, 
  Sparkles, 
  Trash2, 
  Users, 
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  Search
} from "lucide-react";
import { getHrChatHistory, sendHrMessage, deleteHrChatHistory } from "../services/hrChatApi";
import { getJobsByCompany } from "../services/jobsApi";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

export default function HrAssistantPage() {
  const { companyId, jobId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isJobSelectOpen, setIsJobSelectOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsJobSelectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch company jobs for the switcher
  const { data: jobsResponse } = useQuery({
    queryKey: ["companyJobs", companyId],
    queryFn: () => getJobsByCompany(companyId, { limit: 50 }),
    enabled: !!companyId,
  });
  const companyJobs = jobsResponse?.data?.data || [];
  const currentJob = companyJobs.find(j => j._id === jobId);

  // Fetch chat history
  const { data: chatData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["hr-chat", jobId],
    queryFn: () => getHrChatHistory(jobId),
    enabled: !!jobId,
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: ({ message }) => sendHrMessage(jobId, message),
    onSuccess: () => {
      queryClient.invalidateQueries(["hr-chat", jobId]);
    },
    onError: (err, variables) => {
      toast.error(err.message || "Failed to get AI response");
      if (variables.message) {
        setInput(variables.message);
      }
    },
  });

  // Delete chat mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteHrChatHistory(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries(["hr-chat", jobId]);
      toast.success("History cleared");
    },
  });

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatData?.messages, sendMutation.isPending]);

  const handleSend = (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || sendMutation.isPending) return;
    
    setInput(""); // Optimistic clear
    sendMutation.mutate({ message });
  };

  const handleJobChange = (newJobId) => {
    navigate(`/employer/company/${companyId}/ai-assistant/${newJobId}`);
  };

  const messages = chatData?.messages || [];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 overflow-visible">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs shrink-0 relative overflow-visible z-1000">
        <div className="flex items-center gap-4 max-w-[70%]">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/employer/company/${companyId}`)}
            className="text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-8 w-px bg-slate-100" />
          <div className="flex items-center gap-3 overflow-visible">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-blue to-brand-teal flex items-center justify-center text-white shadow-md relative shrink-0">
              <Bot className="w-6 h-6" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0 overflow-visible">
              <h1 className="text-sm font-bold text-slate-800 leading-tight truncate">AI HR Assistant</h1>
              <div className="flex items-center gap-1 mt-0.5 relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsJobSelectOpen(!isJobSelectOpen)}
                  className="flex items-center gap-1.5 text-[11px] font-extrabold text-brand-blue bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 cursor-pointer max-w-55 shadow-xs hover:border-brand-teal hover:bg-slate-50/50 transition-all active:scale-95"
                >
                  <span className="truncate pr-1">Target: {currentJob?.title || "Loading..."}</span>
                  <ChevronDown className={`w-3 h-3 text-brand-blue transition-transform duration-300 shrink-0 ${isJobSelectOpen ? 'rotate-180' : ''}`} />
                </button>

                {isJobSelectOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-9999 overflow-visible">
                    <div className="p-3 border-b border-slate-50 bg-slate-50/50 rounded-t-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase px-1 tracking-wider">Select Job Context</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-1.5 bg-white rounded-b-2xl">
                        {companyJobs.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">
                             No other jobs found.
                          </div>
                        ) : (
                          companyJobs.map(job => (
                            <button
                              key={job._id}
                              onClick={() => {
                                  handleJobChange(job._id);
                                  setIsJobSelectOpen(false);
                              }}
                              className={`w-full text-left px-3 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between group mb-1 last:mb-0 ${
                                  job._id === jobId 
                                  ? 'bg-brand-blue/10 text-brand-blue' 
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-brand-teal'
                              }`}
                            >
                              <span className="truncate pr-2">{job.title}</span>
                              {job._id === jobId && <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shadow-xs shrink-0" />}
                            </button>
                          ))
                        )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-red-600"
                onClick={() => {
                    if (confirm("Clear Entire conversation?")) deleteMutation.mutate();
                }}
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-8 pb-44 space-y-8 scroll-smooth"
        >
          {isHistoryLoading ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-brand-blue" />
                <p className="text-sm font-medium">Initializing recruitment data...</p>
             </div>
          ) : messages.length === 0 && !sendMutation.isPending ? (
            <div className="max-w-2xl mx-auto text-center space-y-6 pt-10">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto text-brand-teal border border-slate-50 rotate-3">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">How can I help with your candidates?</h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-md mx-auto">
                    I have access to all applications and CVs for this job. You can ask me to find specific skills, summarize experience, or compare candidates.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {[
                  "Who is the most qualified for this role?",
                  "Show me candidates with 5+ years of experience",
                  "List all candidates from Cairo University",
                  "Tell me about Omar Khalid's research"
                ].map((q) => (
                  <button 
                    key={q}
                    onClick={() => setInput(q)}
                    className="p-4 bg-white border border-slate-100 rounded-2xl text-left text-sm font-medium hover:border-brand-teal hover:shadow-md transition-all group"
                  >
                    <p className="text-slate-700 group-hover:text-brand-teal transition-colors">{q}</p>
                    <ChevronRight className="w-4 h-4 text-slate-300 mt-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-10">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-5 ${msg.role === 'human' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 border ${
                        msg.role === 'human' 
                        ? 'bg-white text-slate-400 border-slate-100' 
                        : 'bg-linear-to-br from-brand-blue to-brand-teal text-white border-white/20'
                    }`}>
                        {msg.role === 'human' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    
                    <div className={`flex-1 space-y-4 ${msg.role === 'human' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-5 rounded-3xl text-sm leading-relaxed shadow-sm relative ${
                            msg.role === 'human'
                            ? 'bg-(--color-brand-blue) text-white rounded-tr-none'
                            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none font-medium'
                        }`}>
                            <div className={`prose prose-sm max-w-none ${msg.role === 'human' ? 'prose-invert text-white' : 'prose-slate text-slate-700'}`}>
                                <ReactMarkdown
                                    components={{
                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc ml-4 my-2">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal ml-4 my-2">{children}</ol>,
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                        code: ({ children }) => <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Rendering Candidates if available */}
                        {msg.candidates && msg.candidates.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                {msg.candidates.map((cand) => (
                                    <Card key={cand.id} className="border-slate-100 hover:border-brand-teal hover:shadow-lg transition-all duration-300 group overflow-hidden">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold group-hover:bg-brand-teal/5 group-hover:text-brand-teal transition-colors">
                                                    {cand.name ? cand.name[0] : 'C'}
                                                </div>
                                                <Link 
                                                    to={`/candidateProfile/${cand.id}`}
                                                    title="View Candidate Details"
                                                    className="p-2 text-slate-300 hover:text-brand-blue transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>

                                            </div>
                                            <Link to={`/candidateProfile/${cand.id}`} className="hover:text-brand-blue transition-colors">
                                                <h4 className="font-bold text-slate-800 text-base mb-1">{cand.name}</h4>
                                            </Link>

                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {cand.highlight}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
              ))}

              {sendMutation.isPending && (
                 <div className="flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-blue to-brand-teal flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-blue/20">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="bg-white border border-slate-100 py-3 px-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-1.5 w-fit">
                             <div className="w-1.5 h-1.5 bg-brand-teal/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                             <div className="w-1.5 h-1.5 bg-brand-teal/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                             <div className="w-1.5 h-1.5 bg-brand-teal/80 rounded-full animate-bounce" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold ml-2 animate-pulse uppercase tracking-widest">AI is thinking...</p>
                    </div>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Input Field */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="max-w-4xl mx-auto">
                <form 
                  onSubmit={handleSend}
                  className="bg-white p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-3 backdrop-blur-md"
                >
                    <div className="flex-1 flex items-center px-4 gap-3">
                        <Search className="w-5 h-5 text-slate-300" />
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={sendMutation.isPending ? "AI is reasoning..." : "Ask about your applications..."}
                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm py-3 text-slate-800 placeholder:text-slate-400 font-medium"
                            disabled={sendMutation.isPending}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!input.trim() || sendMutation.isPending}
                        className="h-12 w-12 rounded-xl bg-linear-to-br from-brand-blue to-brand-teal flex items-center justify-center shadow-lg hover:shadow-brand-blue/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                    >
                        {sendMutation.isPending ? <Loader2 className="animate-spin w-5 h-5 text-white" /> : <Send className="w-5 h-5 text-white" />}
                    </button>
                </form>
                <div className="flex justify-center gap-6 mt-3">
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Users className="w-3 h-3" /> Scoping Applications data
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Search className="w-3 h-3" /> Semantic CV search enabled
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
