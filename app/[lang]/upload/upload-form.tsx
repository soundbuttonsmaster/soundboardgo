"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Loader2, Music, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/contexts/auth-context"
import { SOUND_COLORS } from "@/lib/constants/colors"
import type { Locale } from "@/lib/i18n/config"
import Link from "next/link"

interface Props {
  lang: Locale
  dict: any
  categories: { id: number; name: string }[]
}

export default function UploadForm({ lang, dict, categories }: Props) {
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [color, setColor] = useState("red")
  const [tags, setTags] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!["audio/mpeg", "audio/wav", "audio/mp3", "audio/wave"].includes(selectedFile.type)) {
        setError("Please select an MP3 or WAV file")
        return
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }
      setFile(selectedFile)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("Please login to upload sounds")
      return
    }
    if (!file) {
      setError("Please select an audio file")
      return
    }
    if (!name.trim()) {
      setError("Please enter a sound name")
      return
    }
    // Category is optional in API, so we don't require it

    setLoading(true)
    setError("")

    try {
      // Upload sound using Python API
      const categoryIdNum = categoryId ? parseInt(categoryId) : undefined
      const tagString = tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .join(", ")
        : undefined

      await apiClient.createSound({
        name: name.trim(),
        sound_file: file,
        tag: tagString,
        category: categoryIdNum,
      })

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to upload sound")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <Upload className="mx-auto h-12 w-12 text-slate-400" />
        <h2 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Login Required</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Please login or create an account to upload sounds
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link
            href={`/${lang}/login`}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
          >
            Login
          </Link>
          <Link
            href={`/${lang}/register`}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Sign up
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-8 text-center dark:bg-green-900/20">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-lg font-semibold text-green-800 dark:text-green-200">Sound Uploaded!</h2>
        <p className="mt-2 text-sm text-green-600 dark:text-green-300">Your sound has been uploaded successfully</p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSuccess(false)
              setName("")
              setFile(null)
              setTags("")
            }}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Upload Another
          </button>
          <Link
            href={`/${lang}`}
            className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-900/30"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  console.log("Current color state:", color);
  const submitButtonBgClass = SOUND_COLORS.find((c) => c.value === color)?.bg || "bg-red-500";
  console.log("Submit button background class:", submitButtonBgClass);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* File Upload */}
      <div>
        <label
          htmlFor="upload-audio-file"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Audio File *
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            file
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : "border-slate-300 hover:border-red-500 dark:border-slate-700"
          }`}
        >
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <Music className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">{file.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                }}
                className="ml-2 rounded-full p-1 hover:bg-green-200 dark:hover:bg-green-800"
                aria-label="Remove file"
              >
                <X className="h-4 w-4 text-green-600" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Click to upload MP3 or WAV (max 10MB)</p>
            </>
          )}
        </div>
        <input
          id="upload-audio-file"
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,audio/wav,audio/mp3"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload audio file"
        />
      </div>

      {/* Sound Name */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Sound Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Funny Laugh"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {/* Category Selection */}
      <div>
        <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Category (optional)
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="">Select a category (optional)</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Color Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Button Color *</label>
        <div className="flex flex-wrap gap-2">
          {SOUND_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                color === c.value ? "border-slate-900 dark:border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Tags (optional)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="funny, meme, viral (comma separated)"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
          SOUND_COLORS.find((c) => c.value === color)?.bg || "bg-red-500"
        } ${
          SOUND_COLORS.find((c) => c.value === color)?.hover || "hover:bg-red-600"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Sound
          </>
        )}
      </button>
    </form>
  )
}
