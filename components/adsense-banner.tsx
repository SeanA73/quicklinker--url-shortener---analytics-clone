import React, { useEffect, useRef } from "react";
import { Platform, View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

interface AdsenseBannerProps {
  adSlot?: string;
  adClient?: string;
  style?: { [key: string]: unknown };
  testID?: string;
}

export function AdsenseBanner({ adSlot, adClient, style, testID }: AdsenseBannerProps) {
  const containerRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    try {
      const win = window as unknown as { adsbygoogle?: unknown[] } & Window;

      if (!document.querySelector('script[data-adsbygoogle]')) {
        const s = document.createElement('script');
        s.setAttribute('data-adsbygoogle', 'true');
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adClient ?? 'ca-pub-0000000000000000')}`;
        document.head.appendChild(s);
      }

      const host = containerRef.current as unknown as HTMLDivElement | null;
      if (!host) return;

      host.innerHTML = '';
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.style.minWidth = '300px';
      ins.style.minHeight = '250px';
      ins.setAttribute('data-ad-client', adClient ?? 'ca-pub-0000000000000000');
      if (adSlot) ins.setAttribute('data-ad-slot', adSlot);
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      host.appendChild(ins);

      (win.adsbygoogle = win.adsbygoogle || []).push({});
    } catch (e) {
      console.log('Adsense init error', e);
    }
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

  return <View ref={containerRef} style={[styles.webContainer, style]} testID={testID ?? 'adsense-web'} />;
}

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
    minHeight: 250,
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