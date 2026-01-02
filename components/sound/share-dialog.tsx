'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CopyIcon, QrCodeIcon, Share2Icon, MessageSquareTextIcon, MailIcon, FacebookIcon, TwitterIcon, LinkedinIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

interface ShareDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  shareUrl: string
  soundName: string
  soundImageUrl: string
  setMessageContent: (message: string) => void
  setShowMessage: (show: boolean) => void
  dict: any // Add dict prop
}

export function ShareDialog({
  isOpen,
  onOpenChange,
  shareUrl,
  soundName,
  soundImageUrl,
  setMessageContent,
  setShowMessage,
  dict,
}: ShareDialogProps) {

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        if (setMessageContent && setShowMessage && dict?.common?.copied) {
          setMessageContent(dict.common.copied)
          setShowMessage(true)
          setTimeout(() => setShowMessage(false), 3000)
        }
      } else {
        // Fallback for browsers that do not support navigator.clipboard
        const textarea = document.createElement("textarea")
        textarea.value = shareUrl
        textarea.style.position = "fixed" // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        try {
          document.execCommand("copy")
          if (setMessageContent && setShowMessage && dict?.common?.copied) {
            setMessageContent(dict.common.copied)
            setShowMessage(true)
            setTimeout(() => setShowMessage(false), 3000)
          }
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err)
          if (setMessageContent && setShowMessage) {
            setMessageContent("Error copying link.")
            setShowMessage(true)
            setTimeout(() => setShowMessage(false), 3000)
          }
        } finally {
          document.body.removeChild(textarea)
        }
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      if (setMessageContent && setShowMessage) {
        setMessageContent("Error copying link.")
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 3000)
      }
    }
  }

  const [showQrCode, setShowQrCode] = useState(false)

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: soundName,
          url: shareUrl,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      alert('Web Share API is not supported in this browser.')
    }
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <div className="flex items-center space-x-2">
              {soundImageUrl && (
                <Image
                  src={soundImageUrl}
                  alt={soundName}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              )}
              <div>
                <p className="text-sm font-medium leading-none">{soundName}</p>
                <p className="text-sm text-muted-foreground">{shareUrl}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Input id="link" defaultValue={shareUrl} readOnly />
              <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                <span className="sr-only">Copy</span>
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button type="submit" size="sm" className="px-3" onClick={() => setShowQrCode(!showQrCode)}>
                <span className="sr-only">QR Code</span>
                <QrCodeIcon className="h-4 w-4" />
              </Button>
            </div>
            {showQrCode && (
              <div className="mt-4 flex justify-center">
                <Image src={qrCodeUrl} alt="QR Code" width={150} height={150} />
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <p className="text-sm font-medium">No contacts yet</p>
          <p className="text-sm font-medium">Share using</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Social Share Buttons - Placeholder for now */}
            <ShareOption icon={Share2Icon} label="Nearby Sharing" onClick={() => handleWebShare()} />
            <ShareOption icon={MessageSquareTextIcon} label="Discord" onClick={() => window.open(`https://discord.com/channels/@me?message=${encodeURIComponent(shareUrl)}`, '_blank')} />
            <ShareOption icon={MessageSquareTextIcon} label="WhatsApp" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`, '_blank')} />
            <ShareOption icon={MailIcon} label="Outlook" onClick={() => window.open(`mailto:?body=${encodeURIComponent(shareUrl)}`, '_blank')} />
            <ShareOption icon={MailIcon} label="Gmail" onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=Check out this sound!&body=${encodeURIComponent(shareUrl)}`, '_blank')} />
            <ShareOption icon={FacebookIcon} label="Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')} />
            <ShareOption icon={TwitterIcon} label="Twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank')} />
            <ShareOption icon={LinkedinIcon} label="LinkedIn" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`, '_blank')} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ShareOptionProps {
  icon: React.ElementType
  label: string
  onClick: () => void
}

function ShareOption({ icon: Icon, label, onClick }: ShareOptionProps) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={onClick}>
        <Icon className="h-6 w-6" />
      </Button>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
