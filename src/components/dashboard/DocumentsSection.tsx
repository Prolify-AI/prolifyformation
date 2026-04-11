"use client";

import { useState, useEffect } from "react";
import {
  FileText, Upload, Download, Trash2, Search, FolderOpen,
  File, FileCheck, FileCog, FileKey, Plus, X, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

type Document = {
  id: string;
  document_name: string;
  document_type: string;
  file_url: string | null;
  file_size: number | null;
  description: string | null;
  tags: string[] | null;
  created_at: string;
};

const DOC_TYPE_CONFIG: Record<string, {
  icon: typeof FileText;
  label: string;
  iconBg: string;
  iconColor: string;
  badge: string;
}> = {
  formation: {
    icon: FileCheck,
    label: "Formation",
    iconBg: "bg-[#FFC107]",
    iconColor: "text-black",
    badge: "bg-[#FFC107]/15 text-[#9A7200] dark:text-[#FFC107]",
  },
  tax: {
    icon: FileCog,
    label: "Tax",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  },
  contract: {
    icon: FileKey,
    label: "Contract",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  license: {
    icon: FileCheck,
    label: "License",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
    badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  },
  other: {
    icon: File,
    label: "Other",
    iconBg: "bg-black/10 dark:bg-white/10",
    iconColor: "text-black/60 dark:text-white/60",
    badge: "bg-black/6 dark:bg-white/6 text-black/50 dark:text-white/50",
  },
};

const FILTER_TYPES = [
  { value: "all", label: "All" },
  { value: "formation", label: "Formation" },
  { value: "tax", label: "Tax" },
  { value: "contract", label: "Contract" },
  { value: "license", label: "License" },
  { value: "other", label: "Other" },
];

export default function DocumentsSection() {
  const { company, user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    document_name: "",
    document_type: "other",
    description: "",
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [company]);

  const loadDocuments = async () => {
    if (!company) return;
    try {
      const { data, error } = await supabase
        .from("company_documents")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !user) return;
    setUploading(true);
    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      let file_url = null;
      let file_size = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${company.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(fileName, selectedFile);
        if (uploadError) throw uploadError;
        file_url = fileName;
        file_size = selectedFile.size;
      }

      const { error } = await supabase.from("company_documents").insert({
        company_id: company.id,
        uploaded_by: user.id,
        document_name: formData.document_name,
        document_type: formData.document_type,
        description: formData.description || null,
        tags: tags.length > 0 ? tags : null,
        file_url,
        file_size,
      });

      if (error) throw error;
      setFormData({ document_name: "", document_type: "other", description: "", tags: "" });
      setSelectedFile(null);
      setShowAddForm(false);
      loadDocuments();
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, file_url: string | null) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      if (file_url) {
        await supabase.storage.from("documents").remove([file_url]);
      }
      const { error } = await supabase
        .from("company_documents")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return null;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.document_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.document_type === filterType;
    return matchesSearch && matchesType;
  });

  const typeCounts = documents.reduce<Record<string, number>>((acc, doc) => {
    acc[doc.document_type] = (acc[doc.document_type] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-[3px] border-[#FFC107]/30 border-t-[#FFC107] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black dark:text-white">Documents</h1>
          <p className="text-sm text-black/50 dark:text-white/50 mt-0.5">
            {documents.length} document{documents.length !== 1 ? "s" : ""} stored
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? "Cancel" : "Add Document"}
        </button>
      </div>

      {documents.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {FILTER_TYPES.slice(1).map((ft) => {
            const count = typeCounts[ft.value] || 0;
            const cfg = DOC_TYPE_CONFIG[ft.value];
            return (
              <button
                key={ft.value}
                onClick={() => setFilterType(filterType === ft.value ? "all" : ft.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                  filterType === ft.value
                    ? "bg-[#FFC107]/10 border-[#FFC107]/40 dark:border-[#FFC107]/40"
                    : "bg-white dark:bg-[#0f0f0f] border-black/6 dark:border-white/6 hover:border-black/15 dark:hover:border-white/15"
                }`}
              >
                <span className={`text-base font-black ${filterType === ft.value ? "text-[#FFC107]" : "text-black dark:text-white"}`}>{count}</span>
                <span className="text-[10px] font-semibold text-black/40 dark:text-white/40">{ft.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-black/5 dark:border-white/5">
            <div className="w-8 h-8 rounded-lg bg-[#FFC107] flex items-center justify-center">
              <Upload className="h-3.5 w-3.5 text-black" />
            </div>
            <h3 className="text-sm font-bold text-black dark:text-white">Add New Document</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Document Name *</label>
                <Input
                  required
                  value={formData.document_name}
                  onChange={(e) => setFormData({ ...formData, document_name: e.target.value })}
                  placeholder="Certificate of Formation"
                  className="border border-black/12 dark:border-white/12 focus:border-[#FFC107] h-10 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Type</label>
                <select
                  value={formData.document_type}
                  onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                  className="w-full h-10 px-3 bg-white dark:bg-[#0f0f0f] border border-black/12 dark:border-white/12 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:border-[#FFC107]"
                >
                  <option value="formation">Formation</option>
                  <option value="tax">Tax</option>
                  <option value="contract">Contract</option>
                  <option value="license">License</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this document"
                  className="border border-black/12 dark:border-white/12 focus:border-[#FFC107] h-10 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="important, 2024, legal"
                  className="border border-black/12 dark:border-white/12 focus:border-[#FFC107] h-10 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">File (Optional)</label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-black/12 dark:border-white/12 hover:border-[#FFC107]/50 cursor-pointer transition-colors group">
                  <Upload className="h-4 w-4 text-black/30 dark:text-white/30 group-hover:text-[#FFC107] flex-shrink-0 transition-colors" />
                  <span className="text-sm text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {selectedFile ? `${selectedFile.name} (${formatFileSize(selectedFile.size)})` : "Click to choose a file..."}
                  </span>
                  <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-black/80 dark:hover:bg-white/90 transition-colors disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Add Document"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30 dark:text-white/30" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="pl-9 border border-black/10 dark:border-white/10 focus:border-[#FFC107] h-10 text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-10 px-3 bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-white/10 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:border-[#FFC107] transition-colors"
        >
          {FILTER_TYPES.map((ft) => (
            <option key={ft.value} value={ft.value}>{ft.label}</option>
          ))}
        </select>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-[#0f0f0f] border border-dashed border-black/8 dark:border-white/8 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center mb-4">
            <FolderOpen className="h-7 w-7 text-[#FFC107]" />
          </div>
          <p className="text-sm font-bold text-black dark:text-white mb-1">
            {searchTerm || filterType !== "all" ? "No documents found" : "No documents yet"}
          </p>
          <p className="text-xs text-black/40 dark:text-white/40 mb-5 max-w-xs">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search or filters"
              : "Upload your first company document to get started"}
          </p>
          {!searchTerm && filterType === "all" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFC107] text-black text-sm font-bold hover:bg-[#FFB300] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add First Document
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredDocuments.map((doc) => {
            const cfg = DOC_TYPE_CONFIG[doc.document_type] || DOC_TYPE_CONFIG.other;
            const Icon = cfg.icon;
            const fileSize = formatFileSize(doc.file_size);

            return (
              <div
                key={doc.id}
                className="group flex items-start gap-4 p-4 bg-white dark:bg-[#0f0f0f] border border-black/6 dark:border-white/6 rounded-2xl hover:border-black/15 dark:hover:border-white/15 hover:shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${cfg.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-black dark:text-white truncate">{doc.document_name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                      {doc.description && (
                        <p className="text-xs text-black/50 dark:text-white/50 mt-0.5 line-clamp-1">{doc.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-black/35 dark:text-white/35">
                          {format(new Date(doc.created_at), "MMM d, yyyy")}
                        </span>
                        {fileSize && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-black/15 dark:bg-white/15" />
                            <span className="text-[11px] text-black/35 dark:text-white/35">{fileSize}</span>
                          </>
                        )}
                      </div>
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <Tag className="h-3 w-3 text-black/25 dark:text-white/25" />
                          {doc.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-black/4 dark:bg-white/4 text-black/50 dark:text-white/50 text-[10px] rounded-md font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {doc.file_url && (
                        <button
                          onClick={async () => {
                            const { data } = await supabase.storage
                              .from("documents")
                              .createSignedUrl(doc.file_url!, 60);
                            if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                          }}
                          className="w-8 h-8 rounded-lg bg-[#FFC107]/15 hover:bg-[#FFC107] flex items-center justify-center transition-colors group/btn"
                          title="Download"
                        >
                          <Download className="h-3.5 w-3.5 text-[#9A7200] dark:text-[#FFC107] group-hover/btn:text-black transition-colors" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(doc.id, doc.file_url)}
                        className="w-8 h-8 rounded-lg bg-black/4 dark:bg-white/4 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors group/btn"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-black/30 dark:text-white/30 group-hover/btn:text-red-600 dark:group-hover/btn:text-red-400 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
