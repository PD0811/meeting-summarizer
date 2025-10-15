import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileAudio,
  Sparkles,
  CheckCircle2,
  ListTodo,
  MessageSquare,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setError("Please select an audio file to upload");
      return;
    }
    setLoading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);

    try {
      const res = await fetch(`${API_BASE}/api/meetings/upload`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }
      const j = await res.json();
      setResult(j);
    } catch (err) {
      setError(err.message || "Failed to process the audio file");
    } finally {
      setLoading(false);
    }
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4 pt-2">
            <Sparkles className="w-10 h-10 text-purple-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight pb-1">
              Meeting Summarizer
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Transform your meeting recordings into actionable insights with
            AI-powered transcription and summarization
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-8">
          {/* Upload Section */}
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                <form onSubmit={handleUpload} className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">
                      Meeting Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Q4 Planning Meeting"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400 text-white"
                      disabled={loading}
                    />
                  </div>

                  {/* File Upload Area */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">
                      Audio File
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                        dragActive
                          ? "border-purple-400 bg-purple-500/10"
                          : "border-white/20 hover:border-purple-400/50"
                      } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                        id="file-upload"
                      />

                      <div className="text-center">
                        {file ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center gap-3 text-green-400"
                          >
                            <FileAudio className="w-8 h-8" />
                            <div className="text-left">
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                            <p className="text-lg mb-2 text-gray-200">
                              Drag and drop your audio file here
                            </p>
                            <p className="text-sm text-gray-400 mb-4">
                              or click to browse
                            </p>
                            <label
                              htmlFor="file-upload"
                              className="inline-block px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 rounded-lg cursor-pointer transition-all"
                            >
                              Select File
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Your Meeting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Upload & Summarize
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Results Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Header with New Meeting Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                    <h2 className="text-3xl font-bold">
                      Meeting Analysis Complete
                    </h2>
                  </div>
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20"
                  >
                    <X className="w-4 h-4" />
                    New Meeting
                  </button>
                </div>

                {/* Meeting Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-semibold mb-3 text-purple-300">
                    Meeting Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="font-medium text-white">ID:</span>{" "}
                      <span className="font-mono text-sm">{result.id}</span>
                    </p>
                    {result.title && (
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Title:</span>{" "}
                        {result.title}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Summary */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-semibold text-yellow-300">
                      Summary
                    </h3>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {result.summary}
                    </p>
                  </div>
                </motion.div>

                {/* Action Items */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ListTodo className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-semibold text-green-300">
                      Action Items
                    </h3>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {result.action_items}
                    </p>
                  </div>
                </motion.div>

                {/* Transcript */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-blue-300">
                      Full Transcript
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                      {result.transcript}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center text-gray-400 text-sm"
        >
          <p>Powered by AI • Secure • Fast</p>
        </motion.footer>
      </div>
    </div>
  );
}
