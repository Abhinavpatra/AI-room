"use client"

import { useState, useRef } from "react";
import { Play, Download, Share2, Heart, Eye, Clock, Zap, Sparkles, Settings, Grid3X3, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import "@/styles/changes.css";
import axios from "axios";

interface Model {
  id: string
  name: string
  category: string
  description: string
  type: 'image' | 'video' | 'audio' | 'image-edit'
}

interface GeneratedContent {
  url: string
  prompt: string
  model: string
  likes: number
  views: number
  type: 'image' | 'video' | 'audio'
}

interface PageParams {
  params: { slug: string }
}

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:2"

export default function Home({ params }: PageParams) {
  console.log("AIContentGenerator component initialized");
  console.log("Params:", params);
  const modelId = params?.slug?.replace("--", "/") || "flux-dev"
  console.log("Model ID from params:", modelId);

  const [prompt, setPrompt] = useState<string>("")
  const [negativePrompt, setNegativePrompt] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>(modelId)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1")
  const [steps, setSteps] = useState<number>(28)
  const [guidanceScale, setGuidanceScale] = useState<number>(3.5)
  const [seed, setSeed] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  
  console.log("Initial state values:", {
    modelId,
    selectedModel,
    aspectRatio,
    steps,
    guidanceScale,
    isGenerating
  });
  
  // Model-specific parameters
  const [inputImage, setInputImage] = useState<string>("")
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [outputFormat, setOutputFormat] = useState<string>("jpg")
  const [styleType, setStyleType] = useState<string>("auto")
  const [magicPrompt, setMagicPrompt] = useState<string>("auto")
  const [voiceId, setVoiceId] = useState<string>("")
  const [emotionControl, setEmotionControl] = useState<string>("")
  const [safetyFilter, setSafetyFilter] = useState<string>("block_medium_and_above")
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const models: Model[] = [
    {
      id: "ideogram-ai/ideogram-v3-turbo",
      name: "Ideogram v3 Turbo",
      category: "Fast",
      type: "image",
      description: "Turbo is the fastest and cheapest Ideogram v3. v3 creates images with stunning realism, creative designs, and consistent styles",
    },
    {
      id: "minimax/video-01",
      name: "MiniMax Video-01",
      category: "Video",
      type: "video",
      description: "Generate 6s videos with prompts or images. (Also known as Hailuo). Use a subject reference to make a video with a character and the S2V-01 model.",
    },
    {
      id: "black-forest-labs/flux-kontext-pro",
      name: "FLUX Kontext Pro",
      category: "Pro",
      type: "image-edit",
      description: "A text-based image editing model that delivers high-quality outputs with excellent prompt following and consistent results for transforming images through natural language",
    },
    {
      id: "resemble-ai/chatterbox",
      name: "Resemble Chatterbox",
      category: "Audio",
      type: "audio",
      description: "Generate expressive, natural speech. Features unique emotion control, instant voice cloning from short audio, and built-in watermarking.",
    },
    {
      id: "luma/reframe-video",
      name: "Luma Reframe Video",
      category: "Video",
      type: "video",
      description: "Change the aspect ratio of any video up to 30 seconds long, outputs will be 720p",
    },
    {
      id: "google/imagen-4",
      name: "Google Imagen 4",
      category: "Quality",
      type: "image",
      description: "Google's Imagen 4 flagship model",
    },
  ]

  const currentModel = models.find((model) => model.id === modelId) || models[0]
  console.log("Current model found:", currentModel);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File upload triggered");
    const file = event.target.files?.[0]
    if (file) {
      console.log("File selected:", file.name, file.size);
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        console.log("File read as data URL, length:", result.length);
        setInputImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async (): Promise<void> => {
    console.log("handleGenerate called");
    console.log("Current model:", currentModel);
    console.log("Selected model:", selectedModel);
    console.log("Prompt:", prompt);
    
    try {
      setIsGenerating(true);
      console.log("Set generating to true");

      const requestData: any = {
        modelId: selectedModel,
        prompt: prompt,
        negativePrompt: negativePrompt,
        steps: steps,
        guidanceScale: guidanceScale,
        seed: seed || undefined,
        aspectRatio: aspectRatio,
      };

      console.log("Base request data:", requestData);

      // Add model-specific parameters
      if (currentModel.type === 'image-edit' && inputImage) {
        console.log("Adding image-edit parameters");
        requestData.inputImage = inputImage;
        requestData.outputFormat = outputFormat;
      }
      
      if (currentModel.type === 'video' && currentModel.id === 'luma/reframe-video' && videoUrl) {
        console.log("Adding video parameters");
        requestData.videoUrl = videoUrl;
      }
      
      if (currentModel.id === 'ideogram-ai/ideogram-v3-turbo') {
        console.log("Adding Ideogram parameters");
        requestData.styleType = styleType;
        requestData.magicPrompt = magicPrompt;
      }
      
      if (currentModel.type === 'audio') {
        console.log("Adding audio parameters");
        requestData.voiceId = voiceId;
        requestData.emotionControl = emotionControl;
      }
      
      if (currentModel.id === 'google/imagen-4') {
        console.log("Adding Imagen parameters");
        requestData.safetyFilter = safetyFilter;
      }

      console.log("Final request data:", requestData);
      console.log("Making API call to /api/replicate");

      const response = await axios.post('/api/replicate', requestData);
      console.log("API response received:", response.data);
      
      const result = response.data;
  
      if (!result || (!result.output && !result.url)) {
        console.log("Invalid response - no output or url");
        throw new Error("Invalid response received from the server.");
      }

      console.log("Creating new content with result:", result);
      const newContent: GeneratedContent = {
        url: result.output || result.url, 
        prompt: prompt,
        model: currentModel.name,
        likes: 0,
        views: 1,
        type: currentModel.type === 'image-edit' ? 'image' : currentModel.type,
      };
      
      console.log("New content created:", newContent);
      setGeneratedContent([newContent, ...generatedContent.slice(0, 5)]);
      console.log("Updated generated content list");
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
      console.log("Set generating to false");
    }
  };

  const aspectRatios: AspectRatio[] = currentModel.id === 'ideogram-ai/ideogram-v3-turbo' 
    ? ["1:1", "16:9", "9:16", "4:3", "3:2"]
    : ["1:1", "16:9", "9:16", "4:3"]

  const renderModelSpecificControls = () => {
    switch (currentModel.id) {
      case "ideogram-ai/ideogram-v3-turbo":
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3">Style Type</label>
              <select
                value={styleType}
                onChange={(e) => setStyleType(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              >
                <option value="auto">Auto</option>
                <option value="general">General</option>
                <option value="realistic">Realistic</option>
                <option value="design">Design</option>
                <option value="render_3d">3D Render</option>
                <option value="anime">Anime</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3">Magic Prompt</label>
              <select
                value={magicPrompt}
                onChange={(e) => setMagicPrompt(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              >
                <option value="auto">Auto</option>
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>
          </>
        );

      case "black-forest-labs/flux-kontext-pro":
        return (
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">Input Image</label>
            <div className="space-y-3">
              {inputImage ? (
                <div className="relative">
                  <img src={inputImage} alt="Input" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => setInputImage("")}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/[0.08] rounded-xl py-8 px-4 text-center hover:border-white/[0.16] transition-colors"
                  >
                    <Upload className="h-6 w-6 mx-auto mb-2 text-white/60" />
                    <p className="text-sm text-white/60">Click to upload image</p>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-white/80 mb-3">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              >
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
          </div>
        );

      case "luma/reframe-video":
        return (
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">Video URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
          </div>
        );

      case "resemble-ai/chatterbox":
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3">Voice ID (optional)</label>
              <input
                type="text"
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                placeholder="Enter voice ID"
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3">Emotion Control</label>
              <input
                type="text"
                value={emotionControl}
                onChange={(e) => setEmotionControl(e.target.value)}
                placeholder="happy, sad, excited, etc."
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>
          </>
        );

      case "google/imagen-4":
        return (
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">Safety Filter Level</label>
            <select
              value={safetyFilter}
              onChange={(e) => setSafetyFilter(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            >
              <option value="block_most">Block Most</option>
              <option value="block_medium_and_above">Block Medium and Above</option>
              <option value="block_few">Block Few</option>
              <option value="block_none">Block None</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  const renderContent = (content: GeneratedContent) => {
    switch (content.type) {
      case 'video':
        return (
          <video 
            src={content.url} 
            controls 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        );
      case 'audio':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <audio src={content.url} controls className="w-full" />
          </div>
        );
      default:
        return (
          <img
            src={content.url || "/placeholder.svg"}
            alt={content.prompt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        );
    }
  };

  const sampleContent: GeneratedContent[] = [
    {
      url: "/placeholder.svg?height=400&width=400",
      prompt: "A futuristic cityscape at sunset with flying cars and neon lights",
      model: "FLUX.1 [dev]",
      likes: 142,
      views: 1205,
      type: "image",
    },
    {
      url: "/placeholder.svg?height=400&width=400",
      prompt: "Portrait of a cyberpunk warrior in detailed armor",
      model: "Stable Diffusion XL",
      likes: 89,
      views: 756,
      type: "image",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.08] backdrop-blur-xl bg-black/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Models</span>
              </Link>
              <div className="w-px h-6 bg-white/[0.08]"></div>
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">{currentModel.name}</h1>
                  <p className="text-xs text-white/60">{currentModel.category} Model</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {models.slice(0, 4).map((model) => (
                <Link
                  key={model.id}
                  href={`/model/${model.id.replace("/", "--")}`}
                  className={`w-8 h-8 border rounded-lg flex items-center justify-center text-xs transition-all ${
                    model.id === modelId
                      ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
                      : "bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.08] text-white/60"
                  }`}
                  title={model.name}
                >
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Model Description */}
        <div className="mb-8">
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{currentModel.name}</h2>
                <p className="text-white/70 leading-relaxed">{currentModel.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel - generation controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-6">
                <Settings className="h-4 w-4 text-white/60" />
                <h3 className="font-medium">Generation Settings</h3>
              </div>

              {/* Model Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-3">Model</label>
                <div className="grid grid-cols-1 gap-2">
                  {models.map((model) => (
                    <Link
                      key={model.id}
                      href={`/model/${model.id.replace("/", "--")}`}
                      className={`p-3 rounded-xl text-left transition-all block ${
                        selectedModel === model.id
                          ? "bg-blue-500/20 border border-blue-500/30 text-blue-300"
                          : "bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] text-white/80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{model.name}</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-white/[0.08] rounded-full">{model.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-3">
                  {currentModel.type === 'audio' ? 'Text to Speech' : 'Prompt'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => {
                    console.log("Prompt changed:", e.target.value);
                    setPrompt(e.target.value);
                  }}
                  placeholder={
                    currentModel.type === 'audio' 
                      ? "Enter text to convert to speech..." 
                      : "Describe your vision in detail..."
                  }
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/40 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                />
              </div>

              {/* Model-specific controls */}
              {renderModelSpecificControls()}

              {/* Only show negative prompt for image models */}
              {(currentModel.type === 'image' || currentModel.type === 'image-edit') && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/80 mb-3">Negative Prompt</label>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => {
                      console.log("Negative prompt changed:", e.target.value);
                      setNegativePrompt(e.target.value);
                    }}
                    placeholder="What to avoid..."
                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/40 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Aspect Ratio - not needed for audio */}
              {currentModel.type !== 'audio' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/80 mb-3">Aspect Ratio</label>
                  <div className="grid grid-cols-4 gap-2">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => {
                          console.log("Aspect ratio changed to:", ratio);
                          setAspectRatio(ratio);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          aspectRatio === ratio
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            : "bg-white/[0.02] border border-white/[0.08] text-white/70 hover:bg-white/[0.04]"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced settings - only for image models */}
              {(currentModel.type === 'image' || currentModel.type === 'image-edit') && (
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-white/80">Steps</label>
                      <span className="text-sm text-white/60">{steps}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={steps}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        console.log("Steps changed to:", value);
                        setSteps(value);
                      }}
                      className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-white/80">Guidance Scale</label>
                      <span className="text-sm text-white/60">{guidanceScale}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={guidanceScale}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        console.log("Guidance scale changed to:", value);
                        setGuidanceScale(value);
                      }}
                      className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Seed (optional)</label>
                    <input
                      type="text"
                      value={seed}
                      onChange={(e) => {
                        console.log("Seed changed to:", e.target.value);
                        setSeed(e.target.value);
                      }}
                      placeholder="Random seed"
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-white/10 disabled:to-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 disabled:shadow-none"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-medium mb-4">Properties</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Model:</span>
                  <span className="text-white/90">{currentModel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Type:</span>
                  <span className="text-white/90 capitalize">{currentModel.type}</span>
                </div>
                {currentModel.type !== 'audio' && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Aspect Ratio:</span>
                    <span className="text-white/90">{aspectRatio}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/60">Quality:</span>
                  <span className="text-white/90">Standard</span>
                </div>
                {(currentModel.type === 'image' || currentModel.type === 'image-edit') && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-white/60">Steps:</span>
                      <span className="text-white/90">{steps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Guidance:</span>
                      <span className="text-white/90">{guidanceScale}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Generated Content */}
          <div className="lg:col-span-8">
            {/* User's Generations */}
            {generatedContent.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Grid3X3 className="h-4 w-4 text-white/60" />
                  <h2 className="text-lg font-medium">Your Generations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedContent.map((content, index) => (
                    <div
                      key={index}
                      className="group bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <div className="aspect-square bg-white/[0.02] overflow-hidden">
                        {renderContent(content)}
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-white/80 mb-3 line-clamp-2 leading-relaxed">{content.prompt}</p>
                        <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                          <span className="px-2 py-1 bg-white/[0.08] rounded-full">{content.model}</span>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span>{content.likes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{content.views}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="flex-1 bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1 transition-colors">
                            <Download className="h-3 w-3" />
                            <span>Download</span>
                          </button>
                          <button className="bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs py-2.5 px-3 rounded-lg transition-colors">
                            <Share2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Generations */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="h-4 w-4 text-white/60" />
                <h2 className="text-lg font-medium">Featured Generations</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sampleContent.map((content, index) => (
                  <div
                    key={index}
                    className="group bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <div className="aspect-square bg-white/[0.02] overflow-hidden">
                      {renderContent(content)}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-white/80 mb-3 line-clamp-2 leading-relaxed">{content.prompt}</p>
                      <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                        <span className="px-2 py-1 bg-white/[0.08] rounded-full">{content.model}</span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{content.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{content.views}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>2h</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPrompt(content.prompt)}
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1 transition-all"
                        >
                          <Zap className="h-3 w-3" />
                          <span>Use Prompt</span>
                        </button>
                        <button className="bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs py-2.5 px-3 rounded-lg transition-colors">
                          <Download className="h-3 w-3" />
                        </button>
                        <button className="bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs py-2.5 px-3 rounded-lg transition-colors">
                          <Share2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}