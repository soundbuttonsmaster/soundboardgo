import { useState, useEffect, useRef } from "react";
import type { SoundButton } from "@/types";

interface ShareModalProps {
  sound: SoundButton;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({
  sound,
  isOpen,
  onClose,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const soundUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/sounds/${sound.id}`
      : "";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    if (!soundUrl) {
      console.error("Sound URL is empty");
      return;
    }

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(soundUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback:", err);
    }

    // Fallback for older browsers or when clipboard API fails
    try {
      if (urlInputRef.current) {
        // Use the existing input field
        urlInputRef.current.select();
        urlInputRef.current.setSelectionRange(0, 99999); // For mobile devices

        const successful = document.execCommand("copy");
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error("Copy command failed");
        }
      } else {
        // Last resort: create temporary input
        const input = document.createElement("input");
        input.value = soundUrl;
        input.style.position = "fixed";
        input.style.opacity = "0";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, 99999);

        const successful = document.execCommand("copy");
        document.body.removeChild(input);

        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error("Copy command failed");
        }
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      // Last resort: select the text and show message
      if (urlInputRef.current) {
        urlInputRef.current.select();
        urlInputRef.current.setSelectionRange(0, 99999);
      }
      alert("Please copy the link manually (Ctrl+C or Cmd+C)");
    }
  };

  const handleShareViaDevice = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sound.title || sound.name,
          url: soundUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed:", err);
      }
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(soundUrl);
    const encodedTitle = encodeURIComponent(sound.title || sound.name);
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "instagram":
        // Instagram doesn't support direct URL sharing, open app or show message
        alert("Please copy the link and share it on Instagram");
        return;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "reddit":
        shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
        break;
      case "tumblr":
        shareUrl = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&title=${encodedTitle}`;
        break;
      case "snapchat":
        // Snapchat doesn't support direct URL sharing
        alert("Please copy the link and share it on Snapchat");
        return;
      case "email":
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Share Sound</h2>
            <p className="text-sm text-gray-600 mt-1">
              {sound.title || sound.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Social Media Buttons Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* X (Twitter) */}
            <button
              onClick={() => shareToSocial("twitter")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on X"
            >
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">X</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => shareToSocial("facebook")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on Facebook"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">Facebook</span>
            </button>

            {/* Instagram */}
            <button
              onClick={() => shareToSocial("instagram")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on Instagram"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">Instagram</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => shareToSocial("whatsapp")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on WhatsApp"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={() => shareToSocial("telegram")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on Telegram"
            >
              <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">Telegram</span>
            </button>

            {/* Reddit */}
            <button
              onClick={() => shareToSocial("reddit")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on Reddit"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.33.33 0 0 0-.196.07.326.326 0 0 0-.065.219.312.312 0 0 0 .117.245.338.338 0 0 0 .26.07.328.328 0 0 0 .196-.07.326.326 0 0 0 .065-.219.312.312 0 0 0-.117-.245.338.338 0 0 0-.26-.07z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">Reddit</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => shareToSocial("linkedin")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">LinkedIn</span>
            </button>

            {/* Pinterest */}
            <button
              onClick={() => shareToSocial("pinterest")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on Pinterest"
            >
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">Pinterest</span>
            </button>

            {/* Tumblr */}
            <button
              onClick={() => shareToSocial("tumblr")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on Tumblr"
            >
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.563 24c-5.093-.2-7.031-3.031-7.031-5.906v-7.875H4.031V7.22c3.182-1.031 4.344-4.125 4.344-6.406C8.375 2.938 8.312 1.219 8.5.031c.688-.062 1.844.406 2.375.781.531.375.844.844 1.188 1.406.219.375.406.844.531 1.375.125.531.188 1.063.188 1.656v5.563h4.844v4.219h-4.844v7.313c0 1.656.469 2.469 1.656 2.469.5 0 1.031-.125 1.5-.344l1.031 3.844c-.375.125-1.031.281-1.656.281z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">Tumblr</span>
            </button>

            {/* Snapchat */}
            <button
              onClick={() => shareToSocial("snapchat")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share on Snapchat"
            >
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C8.396 0 5.29 1.476 3.22 3.835.95 6.37.097 9.847.002 13.3c-.09 3.26.19 6.587 2.358 8.746 1.8 1.8 4.157 2.699 6.657 2.699a9.94 9.94 0 003.965-.803c2.99-1.19 5.096-3.636 5.959-6.724a9.903 9.903 0 00.8-3.965c0-5.523-4.477-10-10-10zm-.02 2.18c4.302 0 7.8 3.498 7.8 7.8 0 1.29-.32 2.526-.92 3.6-.6 1.074-1.48 2.006-2.54 2.706-.6.4-1.26.72-1.96.96-.7.24-1.44.36-2.2.36-1.34 0-2.6-.52-3.54-1.46-.94-.94-1.46-2.2-1.46-3.54 0-4.302 3.498-7.8 7.8-7.8zm-3.78 4.02c-.48 0-.88.4-.88.88s.4.88.88.88.88-.4.88-.88-.4-.88-.88-.88zm7.56 0c-.48 0-.88.4-.88.88s.4.88.88.88.88-.4.88-.88-.4-.88-.88-.88z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">Snapchat</span>
            </button>

            {/* Email */}
            <button
              onClick={() => shareToSocial("email")}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share via Email"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xs text-gray-700">Email</span>
            </button>
          </div>

          {/* Copy Link Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Copy Link
            </label>
            <div className="flex gap-2">
              <input
                ref={urlInputRef}
                type="text"
                value={soundUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share via Device Button */}
          {navigator.share && navigator.share() !== undefined ? (
            <button
              onClick={() => handleShareViaDevice() || (() => {})}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share via Device
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
