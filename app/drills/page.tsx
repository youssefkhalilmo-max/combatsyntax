"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { drills as defaultDrills, drillCategories, drillDifficulties, type Drill } from "@/lib/drills";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Filter, X, Clock, Target, Plus, Edit, Save, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DrillsPage() {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDrill, setEditingDrill] = useState<Drill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Striking" as Drill["category"],
    duration: "",
    difficulty: "Beginner" as Drill["difficulty"],
    description: "",
    videoUrl: ""
  });

  const filteredDrills = drills.filter((drill) => {
    if (selectedCategory !== "all" && drill.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && drill.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedDifficulty("all");
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedDifficulty !== "all";

  // Load drills from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("userDrills");
    if (stored) {
      const storedDrills = JSON.parse(stored);
      const mergedDrills = defaultDrills.map(defaultDrill => {
        const modified = storedDrills.find((d: Drill) => d.id === defaultDrill.id);
        return modified || defaultDrill;
      });
      const userAdded = storedDrills.filter((d: Drill) => !defaultDrills.find(dd => dd.id === d.id));
      setDrills([...mergedDrills, ...userAdded]);
    } else {
      setDrills(defaultDrills);
    }
  }, []);

  // Save user-added and modified drills to localStorage
  const saveUserDrills = (updatedDrills: Drill[]) => {
    const modifiedDrills = updatedDrills.filter(d => {
      const isDefault = defaultDrills.find(dd => dd.id === d.id);
      if (!isDefault) return true;
      return JSON.stringify(d) !== JSON.stringify(isDefault);
    });
    localStorage.setItem("userDrills", JSON.stringify(modifiedDrills));
  };

  const handleAddDrill = () => {
    const newDrill: Drill = {
      id: Date.now().toString(),
      ...formData,
      imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=" + encodeURIComponent(formData.name || "New+Drill"),
      videoUrl: formData.videoUrl || undefined
    };
    const updatedDrills = [...drills, newDrill];
    setDrills(updatedDrills);
    saveUserDrills(updatedDrills);
    setShowAddForm(false);
    setFormData({
      name: "",
      category: "Striking",
      duration: "",
      difficulty: "Beginner",
      description: "",
      videoUrl: ""
    });
  };

  const handleEditDrill = () => {
    if (!editingDrill) return;
    const updatedDrills = drills.map(d =>
      d.id === editingDrill.id ? { ...editingDrill, ...formData, videoUrl: formData.videoUrl || undefined } : d
    );
    setDrills(updatedDrills);
    saveUserDrills(updatedDrills);
    setEditingDrill(null);
    setSelectedDrill(null);
    setFormData({
      name: "",
      category: "Striking",
      duration: "",
      difficulty: "Beginner",
      description: "",
      videoUrl: ""
    });
  };

  const handleDeleteDrill = (id: string) => {
    const updatedDrills = drills.filter(d => d.id !== id);
    setDrills(updatedDrills);
    saveUserDrills(updatedDrills);
    setSelectedDrill(null);
  };

  const openEditForm = (drill: Drill) => {
    setEditingDrill(drill);
    setFormData({
      name: drill.name,
      category: drill.category,
      duration: drill.duration,
      difficulty: drill.difficulty,
      description: drill.description,
      videoUrl: drill.videoUrl || ""
    });
    setSelectedDrill(null);
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\\/\s]{11})/);
    return match ? match[1] : null;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Striking":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Grappling":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Conditioning":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Sparring":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      case "Defense":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Drill Library</h1>
              <p className="text-muted-foreground">Training drills for MMA fighters of all levels</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                Back to Techniques
              </Button>
            </Link>
          </div>

          {/* Filter Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Filter Drills</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Drill
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Categories</option>
                  {drillCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Difficulties</option>
                  {drillDifficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Grid Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrills.map((drill, index) => (
            <motion.div
              key={drill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setSelectedDrill(drill)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{drill.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getCategoryColor(drill.category)}`}>
                      {drill.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{drill.duration}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getDifficultyColor(drill.difficulty)}`}>
                      {drill.difficulty}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{drill.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDrills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No drills found matching your filters.</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Drill Detail Modal */}
      {selectedDrill && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDrill(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{selectedDrill.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedDrill.duration}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getCategoryColor(selectedDrill.category)}`}>
                      {selectedDrill.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getDifficultyColor(selectedDrill.difficulty)}`}>
                      {selectedDrill.difficulty}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDrill(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {selectedDrill.videoUrl && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Video Tutorial</h3>
                  {selectedDrill.videoUrl.startsWith('data:video') ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
                      <video
                        src={selectedDrill.videoUrl}
                        controls
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedDrill.videoUrl)}`}
                        title={selectedDrill.name}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{selectedDrill.description}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex gap-3">
                <Button
                  onClick={() => openEditForm(selectedDrill)}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Drill
                </Button>
                <Button
                  onClick={() => handleDeleteDrill(selectedDrill.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Drill Form Modal */}
      {(showAddForm || editingDrill) && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAddForm(false);
            setEditingDrill(null);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingDrill ? "Edit Drill" : "Add New Drill"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingDrill(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Drill Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter drill name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Drill["category"] })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {drillCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 3 rounds x 3 min"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Drill["difficulty"] })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {drillDifficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Describe the drill in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">YouTube Video URL</label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add a YouTube video tutorial for this drill
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={editingDrill ? handleEditDrill : handleAddDrill}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingDrill ? "Save Changes" : "Add Drill"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingDrill(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
