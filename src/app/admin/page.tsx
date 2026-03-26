"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  section: string;
  author: string;
  date: string;
  featured: boolean;
  breaking: boolean;
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie.includes("admin-token=");
    if (token) {
      setIsLoggedIn(true);
      fetchArticles();
    }
  }, []);

  const handleLogin = async () => {
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        fetchArticles();
      } else {
        setLoginError("Wrong password. Please try again.");
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    }
    setLoading(false);
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data);
    } catch {
      console.error("Failed to fetch articles");
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const res = await fetch(`/api/articles?slug=${slug}`, { method: "DELETE" });
      if (res.ok) {
        setArticles(articles.filter((a) => a.slug !== slug));
        setDeleteConfirm(null);
      }
    } catch {
      alert("Failed to delete article");
    }
  };

  const handleLogout = () => {
    document.cookie = "admin-token=; path=/; max-age=0";
    setIsLoggedIn(false);
    setArticles([]);
  };

  const filteredArticles = articles
    .filter((a) => filter === "all" || a.section.toLowerCase() === filter)
    .filter(
      (a) =>
        searchQuery === "" ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sections = Array.from(new Set(articles.map((a) => a.section.toLowerCase())));

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 font-sans mt-2">The Daily Chronicle</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-lg"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-red-600 text-sm">{loginError}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 text-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-[80vh] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage your articles</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/new"
              className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Article
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 text-sm px-3 py-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-3xl font-bold text-gray-900">{articles.length}</p>
            <p className="text-sm text-gray-500">Total Articles</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-3xl font-bold text-gray-900">
              {articles.filter((a) => {
                const today = new Date().toDateString();
                return new Date(a.date).toDateString() === today;
              }).length}
            </p>
            <p className="text-sm text-gray-500">Published Today</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-3xl font-bold text-blue-600">
              {articles.filter((a) => a.featured).length}
            </p>
            <p className="text-sm text-gray-500">Featured</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-3xl font-bold text-red-600">
              {articles.filter((a) => a.breaking).length}
            </p>
            <p className="text-sm text-gray-500">Breaking News</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Sections</option>
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles list */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                {articles.length === 0
                  ? "No articles yet. Create your first article!"
                  : "No articles match your search."}
              </p>
              {articles.length === 0 && (
                <Link
                  href="/admin/new"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
                >
                  Create First Article
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredArticles.map((article) => (
                <div
                  key={article.slug}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {article.section}
                        </span>
                        {article.featured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        {article.breaking && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
                            Breaking
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {article.author} &middot;{" "}
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/article/${article.slug}`}
                        className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/edit/${article.slug}`}
                        className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded"
                      >
                        Edit
                      </Link>
                      {deleteConfirm === article.slug ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(article.slug)}
                            className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(article.slug)}
                          className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
