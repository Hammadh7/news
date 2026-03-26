"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/config";
import Link from "next/link";

export default function NewArticlePage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    author: "Staff Reporter",
    section: "india",
    tags: "",
    image: "",
    imageCaption: "",
    content: "",
    featured: false,
    breaking: false,
  });

  useEffect(() => {
    const token = document.cookie.includes("admin-token=");
    if (!token) {
      router.push("/admin");
      return;
    }
    setIsAuth(true);

    // Restore draft
    const draft = localStorage.getItem("article-draft");
    if (draft) {
      try {
        setForm(JSON.parse(draft));
      } catch {}
    }
  }, [router]);

  // Auto-save draft
  const saveDraft = useCallback(() => {
    localStorage.setItem("article-draft", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timer);
  }, [saveDraft]);

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((f) => ({ ...f, image: data.url }));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Failed to upload image");
    }
    setImageUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  };

  const handlePublish = async () => {
    if (!form.title.trim()) {
      alert("Please enter a title for your article.");
      return;
    }
    if (!form.content.trim()) {
      alert("Please write some content for your article.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          date: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("article-draft");
        router.push("/admin");
      } else {
        alert(data.error || "Failed to publish article");
      }
    } catch {
      alert("Failed to publish article. Please try again.");
    }
    setSaving(false);
  };

  if (!isAuth) return null;

  const sections = siteConfig.sections.filter((s) => s.slug !== "/");

  return (
    <div className="min-h-[80vh] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <h1 className="text-xl font-bold text-gray-900">New Article</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 border border-gray-200 rounded-lg"
            >
              {preview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        {preview ? (
          /* Preview Mode */
          <div className="bg-white rounded-lg shadow-sm p-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              {form.section}
            </span>
            <h1 className="font-serif text-4xl font-bold text-gray-900 leading-tight mt-2 mb-2">
              {form.title || "Untitled Article"}
            </h1>
            {form.subtitle && (
              <p className="text-lg text-gray-600 mb-4">{form.subtitle}</p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              {form.author} &middot; {new Date().toLocaleDateString()}
            </p>
            {form.image && (
              <img
                src={form.image}
                alt=""
                className="w-full aspect-[16/9] object-cover mb-6 rounded"
              />
            )}
            <div className="article-content whitespace-pre-wrap">{form.content}</div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Write your headline here..."
                className="w-full text-3xl font-serif font-bold text-gray-900 placeholder-gray-300 outline-none border-none"
              />
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Add a subtitle (optional)"
                className="w-full text-lg text-gray-600 placeholder-gray-300 outline-none border-none mt-3"
              />
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Staff Reporter"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <select
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-black"
                  >
                    {sections.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="e.g. economy, budget, india"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Article Image
              </label>
              {form.image ? (
                <div className="relative">
                  <img
                    src={form.image}
                    alt="Article preview"
                    className="w-full aspect-[16/9] object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full hover:bg-black"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleImageUpload(file);
                    };
                    input.click();
                  }}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  {imageUploading ? (
                    <p className="text-gray-500">Uploading...</p>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        JPG, PNG, WebP (max 5MB)
                      </p>
                    </>
                  )}
                </div>
              )}
              {form.image && (
                <input
                  type="text"
                  value={form.imageCaption}
                  onChange={(e) => setForm({ ...form, imageCaption: e.target.value })}
                  placeholder="Image caption (optional)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-black mt-3"
                />
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Article Content
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Tip: Use **bold**, *italic*, ## Heading, - bullet points
              </p>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your article here...

You can use simple formatting:
## For headings
**bold text** for emphasis
- bullet points for lists
> for quotes"
                rows={20}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-black font-sans text-base leading-relaxed resize-y"
              />
            </div>

            {/* Toggles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                    <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-full shadow-sm"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Featured Article</p>
                    <p className="text-xs text-gray-500">Shows in the hero section on homepage</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={form.breaking}
                      onChange={(e) => setForm({ ...form, breaking: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:bg-red-600 transition-colors"></div>
                    <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-full shadow-sm"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Breaking News</p>
                    <p className="text-xs text-gray-500">Shows red ticker banner on site</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Publish button (bottom) */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Draft auto-saved</p>
              <button
                onClick={handlePublish}
                disabled={saving}
                className="bg-black text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {saving ? "Publishing..." : "Publish Article"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
