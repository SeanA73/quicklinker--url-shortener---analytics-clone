import React, { useEffect, useRef, useState } from "react";
import { Platform, View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

interface AdsenseBannerProps {
  adSlot?: string;
  adClient?: string;
  style?: { [key: string]: unknown };
  testID?: string;
}

export function AdsenseBanner({ adSlot, adClient, style, testID }: AdsenseBannerProps) {
  const containerRef = useRef<View>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const initializeAdsense = () => {
      try {
        const win = window as unknown as { adsbygoogle?: unknown[] } & Window;

        // Check if AdSense script is already loaded
        if (!document.querySelector('script[data-adsbygoogle]')) {
          const s = document.createElement('script');
          s.setAttribute('data-adsbygoogle', 'true');
          s.async = true;
          s.crossOrigin = 'anonymous';
          s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adClient ?? 'ca-pub-0000000000000000')}`;
          
          s.onload = () => {
            setTimeout(() => createAd(), 100);
          };
          
          s.onerror = () => {
            console.log('AdSense script failed to load');
            setHasError(true);
          };
          
          document.head.appendChild(s);
        } else {
          // Script already exists, create ad immediately
          setTimeout(() => createAd(), 100);
        }

        const createAd = () => {
          const host = containerRef.current as unknown as HTMLDivElement | null;
          if (!host) {
            console.log('AdSense container not found');
            setHasError(true);
            return;
          }

          // Ensure container has proper dimensions
          host.style.width = '100%';
          host.style.minHeight = '250px';
          host.style.display = 'block';

          host.innerHTML = '';
          const ins = document.createElement('ins');
          ins.className = 'adsbygoogle';
          ins.style.display = 'block';
          ins.style.width = '100%';
          ins.style.minWidth = '300px';
          ins.style.minHeight = '250px';
          ins.setAttribute('data-ad-client', adClient ?? 'ca-pub-0000000000000000');
          if (adSlot) ins.setAttribute('data-ad-slot', adSlot);
          ins.setAttribute('data-ad-format', 'auto');
          ins.setAttribute('data-full-width-responsive', 'true');
          host.appendChild(ins);

          // Push ad with error handling
          try {
            (win.adsbygoogle = win.adsbygoogle || []).push({});
            setIsLoaded(true);
          } catch (e) {
            console.log('AdSense push error:', e);
            setHasError(true);
          }
        };
      } catch (e) {
        console.log('AdSense init error:', e);
        setHasError(true);
      }
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAdsense);
    } else {
      initializeAdsense();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', initializeAdsense);
    };
  }, [adClient, adSlot]);

  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.card, style]} testID={testID ?? 'adsense-fallback'}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1529336953121-a0fe3d8e7b86?q=80&w=1200&auto=format&fit=crop' }}
          style={styles.img}
        />
        <View style={styles.body}>
          <Text style={styles.title}>Sponsored</Text>
          <Text style={styles.subtitle}>Your ad could be here. Upgrade to remove ads.</Text>
          <TouchableOpacity style={styles.cta}>
            <Text style={styles.ctaText}>Learn more</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View ref={containerRef} style={[styles.webContainer, style]} testID={testID ?? 'adsense-web'}>
      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ad failed to load</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
    minHeight: 250,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  errorContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  errorText: {
    color: '#6b7280',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  img: {
    width: '100%',
    height: 120,
  },
  body: {
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ctaText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});