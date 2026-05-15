"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { techniques as defaultTechniques, disciplines, stances, categories, difficulties, type Technique } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Filter, X, Plus, Edit, Save, Trash2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedStance, setSelectedStance] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    discipline: "Striking" as Technique["discipline"],
    stance: "Both" as Technique["stance"],
    category: "Kicks" as Technique["category"],
    difficulty: "Beginner" as Technique["difficulty"],
    imageUrl: "",
    technicalBreakdown: "",
    relatedTechniqueIds: [] as string[],
    videoUrl: ""
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  // Load techniques from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("userTechniques");
    if (stored) {
      const storedTechniques = JSON.parse(stored);
      // Merge default techniques with stored modifications
      const mergedTechniques = defaultTechniques.map(defaultTech => {
        const modified = storedTechniques.find((t: Technique) => t.id === defaultTech.id);
        return modified || defaultTech;
      });
      // Add user-added techniques (those not in default)
      const userAdded = storedTechniques.filter((t: Technique) => !defaultTechniques.find(dt => dt.id === t.id));
      setTechniques([...mergedTechniques, ...userAdded]);
    } else {
      setTechniques(defaultTechniques);
    }
  }, []);

  // Save user-added and modified techniques to localStorage
  const saveUserTechniques = (updatedTechniques: Technique[]) => {
    const modifiedTechniques = updatedTechniques.filter(t => {
      const isDefault = defaultTechniques.find(dt => dt.id === t.id);
      if (!isDefault) return true; // User-added technique
      // Include if it's been modified from default
      return JSON.stringify(t) !== JSON.stringify(isDefault);
    });
    localStorage.setItem("userTechniques", JSON.stringify(modifiedTechniques));
  };

  const filteredTechniques = techniques.filter((technique) => {
    if (selectedDiscipline !== "all" && technique.discipline !== selectedDiscipline) return false;
    if (selectedStance !== "all" && technique.stance !== selectedStance) return false;
    if (selectedCategory !== "all" && technique.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && technique.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedDiscipline("all");
    setSelectedStance("all");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
  };

  const hasActiveFilters = selectedDiscipline !== "all" || selectedStance !== "all" || selectedCategory !== "all" || selectedDifficulty !== "all";

  const handleAddTechnique = () => {
    const newTechnique: Technique = {
      id: Date.now().toString(),
      ...formData,
      imageUrl: formData.imageUrl || `https://placehold.co/800x600/1a1a1a/00d4ff?text=${encodeURIComponent(formData.name || "New+Technique")}`,
      videoUrl: formData.videoUrl || undefined
    };
    const updatedTechniques = [...techniques, newTechnique];
    setTechniques(updatedTechniques);
    saveUserTechniques(updatedTechniques);
    setShowAddForm(false);
    setFormData({
      name: "",
      discipline: "Striking",
      stance: "Both",
      category: "Kicks",
      difficulty: "Beginner",
      imageUrl: "",
      technicalBreakdown: "",
      relatedTechniqueIds: [],
      videoUrl: ""
    });
  };

  const handleEditTechnique = () => {
    if (!editingTechnique) return;
    const updatedTechniques = techniques.map(t => 
      t.id === editingTechnique.id ? { ...editingTechnique, ...formData, videoUrl: formData.videoUrl || undefined } : t
    );
    setTechniques(updatedTechniques);
    saveUserTechniques(updatedTechniques);
    setEditingTechnique(null);
    setSelectedTechnique(null);
    setFormData({
      name: "",
      discipline: "Striking",
      stance: "Both",
      category: "Kicks",
      difficulty: "Beginner",
      imageUrl: "",
      technicalBreakdown: "",
      relatedTechniqueIds: [],
      videoUrl: ""
    });
  };

  const handleDeleteTechnique = (id: string) => {
    const updatedTechniques = techniques.filter(t => t.id !== id);
    setTechniques(updatedTechniques);
    saveUserTechniques(updatedTechniques);
    setSelectedTechnique(null);
  };

  const openEditForm = (technique: Technique) => {
    setEditingTechnique(technique);
    setFormData({
      name: technique.name,
      discipline: technique.discipline,
      stance: technique.stance,
      category: technique.category,
      difficulty: technique.difficulty,
      imageUrl: technique.imageUrl,
      technicalBreakdown: technique.technicalBreakdown,
      relatedTechniqueIds: technique.relatedTechniqueIds,
      videoUrl: technique.videoUrl || ""
    });
    setSelectedTechnique(null);
  };

  const isUserTechnique = (technique: Technique) => {
    return !defaultTechniques.find(dt => dt.id === technique.id);
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, videoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(true);
  };

  const handleVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, videoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Filter Section */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Filter Techniques</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Technique
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Discipline</label>
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Disciplines</option>
                  {disciplines.map((discipline) => (
                    <option key={discipline} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Stance</label>
                <select
                  value={selectedStance}
                  onChange={(e) => setSelectedStance(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Stances</option>
                  {stances.map((stance) => (
                    <option key={stance} value={stance}>
                      {stance}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
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
                  <option value="all">All Levels</option>
                  {difficulties.map((difficulty) => (
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

      {/* Technique Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredTechniques.length} technique{filteredTechniques.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTechniques.map((technique, index) => (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => setSelectedTechnique(technique)}
            >
              <Card className="overflow-hidden h-full bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={technique.imageUrl}
                      alt={technique.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(technique.difficulty)}`}>
                        {technique.difficulty}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{technique.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-md">
                      {technique.discipline}
                    </span>
                    <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                      {technique.category}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    {technique.stance === "Both" ? "All Stances" : technique.stance}
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTechniques.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No techniques match your filters.</p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTechnique && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTechnique(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border"
          >
            <div className="relative">
              <div className="relative h-64 md:h-96 w-full">
                <Image
                  src={selectedTechnique.imageUrl}
                  alt={selectedTechnique.name}
                  fill
                  className="object-cover"
                  priority
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedTechnique(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="text-3xl font-bold text-foreground">{selectedTechnique.name}</h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(selectedTechnique.difficulty)}`}>
                  {selectedTechnique.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 text-sm bg-primary/20 text-primary rounded-md">
                  {selectedTechnique.discipline}
                </span>
                <span className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-md">
                  {selectedTechnique.category}
                </span>
                <span className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-md">
                  {selectedTechnique.stance === "Both" ? "All Stances" : selectedTechnique.stance}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground">Technical Breakdown</h3>
                <p className="text-muted-foreground leading-relaxed">{selectedTechnique.technicalBreakdown}</p>
              </div>

              {selectedTechnique.videoUrl && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Video Tutorial</h3>
                  {selectedTechnique.videoUrl.startsWith('data:video') ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
                      <video
                        src={selectedTechnique.videoUrl}
                        controls
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedTechnique.videoUrl)}`}
                        title={selectedTechnique.name}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              {selectedTechnique.relatedTechniqueIds.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Related Techniques</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {selectedTechnique.relatedTechniqueIds.map((relatedId) => {
                      const relatedTechnique = techniques.find((t) => t.id === relatedId);
                      if (!relatedTechnique) return null;
                      return (
                        <Card
                          key={relatedId}
                          className="min-w-[200px] cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => setSelectedTechnique(relatedTechnique)}
                        >
                          <CardHeader className="p-0">
                            <div className="relative h-32 w-full">
                              <Image
                                src={relatedTechnique.imageUrl}
                                alt={relatedTechnique.name}
                                fill
                                className="object-cover"
                                sizes="200px"
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="p-3">
                            <p className="text-sm font-medium text-foreground">{relatedTechnique.name}</p>
                            <p className="text-xs text-muted-foreground">{relatedTechnique.discipline}</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border flex gap-3">
                <Button
                  onClick={() => openEditForm(selectedTechnique)}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Technique
                </Button>
                <Button
                  onClick={() => handleDeleteTechnique(selectedTechnique.id)}
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

      {/* Add/Edit Technique Form Modal */}
      {(showAddForm || editingTechnique) && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAddForm(false);
            setEditingTechnique(null);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingTechnique ? "Edit Technique" : "Add New Technique"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTechnique(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Technique Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Teep Kick"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Discipline</label>
                    <select
                      value={formData.discipline}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value as Technique["discipline"] })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {disciplines.map((discipline) => (
                        <option key={discipline} value={discipline}>
                          {discipline}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Stance</label>
                    <select
                      value={formData.stance}
                      onChange={(e) => setFormData({ ...formData, stance: e.target.value as Technique["stance"] })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {stances.map((stance) => (
                        <option key={stance} value={stance}>
                          {stance}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Technique["category"] })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Technique["difficulty"] })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Image</label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Drag and drop an image here, or click to select
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 text-sm"
                      >
                        Choose File
                      </label>
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                        <div className="relative h-32 w-full mx-auto max-w-xs">
                          <Image
                            src={formData.imageUrl}
                            alt="Preview"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Video</label>
                  <div
                    onDrop={handleVideoDrop}
                    onDragOver={handleVideoDragOver}
                    onDragLeave={handleVideoDragLeave}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDraggingVideo ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Drag and drop a video here, or click to select
                      </p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileSelect}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 text-sm"
                      >
                        Choose File
                      </label>
                    </div>
                    {formData.videoUrl && formData.videoUrl.startsWith('data:video') && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                        <video
                          src={formData.videoUrl}
                          controls
                          className="w-full max-w-xs mx-auto rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">Or enter YouTube URL:</label>
                    <input
                      type="text"
                      value={formData.videoUrl && !formData.videoUrl.startsWith('data:video') ? formData.videoUrl : ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Technical Breakdown</label>
                  <textarea
                    value={formData.technicalBreakdown}
                    onChange={(e) => setFormData({ ...formData, technicalBreakdown: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Describe the technique in detail..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={editingTechnique ? handleEditTechnique : handleAddTechnique}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingTechnique ? "Save Changes" : "Add Technique"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingTechnique(null);
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
