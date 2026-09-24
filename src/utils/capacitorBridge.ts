import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Memeriksa apakah aplikasi sedang berjalan di lingkungan Native (Android / iOS)
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Inisialisasi konfigurasi native untuk Android:
 * - Mengatur tema Status Bar (Dark mode Slate-900 khas EKSIS)
 * - Menangani tombol hardware Back Button pada perangkat Android
 */
export const initNativeFeatures = (handleBackButton?: () => boolean) => {
  if (!isNative()) return;

  // Konfigurasi Status Bar
  try {
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#0f172a' }).catch(() => {});
  } catch {
    // Ignore jika di lingkungan non-native
  }

  // Listener tombol fisik / gesture Back Android
  try {
    App.addListener('backButton', ({ canGoBack }) => {
      if (handleBackButton) {
        const handled = handleBackButton();
        if (handled) return;
      }
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  } catch {
    // Ignore
  }
};

/**
 * Membuka tautan eksternal (WhatsApp, situs yayasan, sosial media)
 * Menggunakan @capacitor/browser di Android atau window.open di web
 */
export const openExternalUrl = async (url: string): Promise<void> => {
  if (isNative()) {
    try {
      await Browser.open({ url, presentationStyle: 'popover' });
      return;
    } catch {
      // Fallback ke window.open jika browser plugin gagal
    }
  }
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Membagikan tautan/produk/pesan ke aplikasi lain
 * Menggunakan Native Share Sheet Android atau Web Share API
 */
export const nativeShare = async (options: {
  title: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
}): Promise<boolean> => {
  if (isNative()) {
    try {
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle || 'Bagikan melalui',
      });
      return true;
    } catch {
      // User cancelled or fallback
    }
  }

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return true;
    } catch {
      // User cancelled
    }
  }

  // Fallback: Copy to clipboard
  if (options.url && typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(options.url);
      return true;
    } catch {
      // Fallback
    }
  }

  return false;
};
