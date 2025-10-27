'use client';

import { Share2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => handleShare('facebook')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Facebook size={16} />
        <span className="hidden sm:inline">Facebook</span>
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
      >
        <Twitter size={16} />
        <span className="hidden sm:inline">Twitter</span>
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline">LinkedIn</span>
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline">Copy Link</span>
      </button>
    </div>
  );
}
