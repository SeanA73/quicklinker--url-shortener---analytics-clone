import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Link2, Copy, ExternalLink, Sparkles, Crown, BarChart3, Share2, ListChecks, Settings, Zap } from "lucide-react-native";
import { useAuth } from "@/providers/auth-provider";
import { useUrlShortener } from "@/hooks/use-url-shortener";
import { RecentLinks } from "@/components/recent-links";
import { AdsenseBanner } from "@/components/adsense-banner";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

export default function ShortenScreen() {
  const { user } = useAuth();
  const { shortenUrl, isLoading } = useUrlShortener();
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState<string>("");
  const [customAlias, setCustomAlias] = useState<string>("");
  const [shortenedUrl, setShortenedUrl] = useState<string>("");
  const domains = useMemo(() => ["quicklink.click", "ql.ink", "qlink.to"], []);
  const [selectedDomainIndex, setSelectedDomainIndex] = useState<number>(0);

  const handleShorten = async () => {
    if (!url.trim()) {
      console.log("Error: Please enter a URL to shorten");
      return;
    }

    if (!isValidUrl(url)) {
      console.log("Error: Please enter a valid URL");
      return;
    }

    try {
      const result = await shortenUrl(url, customAlias);
      setShortenedUrl(result.shortUrl);
      setUrl("");
      setCustomAlias("");
      
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      console.log("Error: Failed to shorten URL. Please try again.");
    }
  };

  const copyToClipboard = async () => {
    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(shortenedUrl);
    } else {
      const Clipboard = await import("expo-clipboard");
      await Clipboard.setStringAsync(shortenedUrl);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log("Copied! Short URL copied to clipboard");
  };

  const openUrl = async () => {
    await Linking.openURL(shortenedUrl);
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient colors={["#667eea", "#764ba2"]} style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.headerContent}>
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <Zap color="#ffffff" size={28} />
              </View>
              <Text style={styles.brandText}>Quicklink</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/(tabs)/settings")}>
              <Settings color="#ffffff" size={24} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.welcomeText}>
            {user ? `Welcome back, ${user.email}!` : "Welcome to Quicklink"}
          </Text>
          <Text style={styles.subtitleText}>
            Transform long URLs into short, shareable links
          </Text>
        </LinearGradient>

        {/* Main Shortening Card */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Link2 color="#667eea" size={24} />
            <Text style={styles.cardTitle}>Shorten URL</Text>
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Enter your long URL</Text>
            <TextInput
              style={styles.urlInput}
              placeholder="https://example.com/very-long-url..."
              placeholderTextColor="#9ca3af"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              testID="input-url"
            />
          </View>

          {/* Custom Alias Section */}
          <View style={styles.inputSection}>
            <View style={styles.aliasHeader}>
              <Text style={styles.inputLabel}>Custom alias</Text>
              {!user && <Crown color="#f59e0b" size={16} />}
            </View>
            <View style={styles.aliasContainer}>
              <TouchableOpacity
                style={styles.domainPicker}
                onPress={() => setSelectedDomainIndex((i) => (i + 1) % domains.length)}
                testID="domain-selector"
              >
                <Text style={styles.domainText}>{domains[selectedDomainIndex]}/</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.aliasInput, !user && styles.disabledInput]}
                placeholder="custom-alias"
                placeholderTextColor={user ? "#9ca3af" : "#d1d5db"}
                value={customAlias}
                onChangeText={setCustomAlias}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!!user}
                testID="input-alias"
              />
            </View>
            {!user && (
              <Text style={styles.proFeature}>🔒 Upgrade to Pro for custom aliases</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.shortenButton, isLoading && styles.shortenButtonDisabled]}
            onPress={handleShorten}
            disabled={isLoading}
            testID="btn-shorten"
          >
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.buttonGradient}>
              <Link2 color="#ffffff" size={20} />
              <Text style={styles.buttonText}>
                {isLoading ? "Creating..." : "Create Short URL"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Result Card */}
        {shortenedUrl && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.successIcon}>
                <Sparkles color="#10b981" size={20} />
              </View>
              <Text style={styles.resultTitle}>Success! Your short URL is ready</Text>
            </View>
            <View style={styles.urlResultContainer}>
              <Text style={styles.shortUrlText} numberOfLines={1}>{shortenedUrl}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionBtn} onPress={copyToClipboard} testID="btn-copy">
                  <Copy color="#667eea" size={18} />
                  <Text style={styles.actionBtnText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={openUrl} testID="btn-open">
                  <ExternalLink color="#667eea" size={18} />
                  <Text style={styles.actionBtnText}>Open</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why choose Quicklink?</Text>
          <View style={styles.featuresList}>
            <FeatureItem icon={<BarChart3 color="#667eea" size={20} />} title="Analytics" description="Track clicks and performance" />
            <FeatureItem icon={<Share2 color="#667eea" size={20} />} title="Bulk URLs" description="Shorten multiple links at once" />
            <FeatureItem icon={<Crown color="#667eea" size={20} />} title="Custom Domains" description="Use your own branded domains" />
            <FeatureItem icon={<ListChecks color="#667eea" size={20} />} title="Management" description="Organize and manage all links" />
          </View>
        </View>

        {/* CTA Section */}
        {!user && (
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to get started?</Text>
            <Text style={styles.ctaSubtitle}>Join thousands of users who trust Quicklink</Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity style={styles.primaryCtaBtn} onPress={() => Linking.openURL("/auth") as unknown as void}>
                <Text style={styles.primaryCtaText}>Create Free Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCtaBtn} onPress={() => Linking.openURL("/payment") as unknown as void}>
                <Crown color="#667eea" size={16} />
                <Text style={styles.secondaryCtaText}>View Pro Plans</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Ads Section */}
        <View style={styles.adsSection}>
          <AdsenseBanner adClient="ca-pub-0000000000000000" adSlot="0000000000" style={styles.adBanner} testID="ad-1" />
        </View>

        <RecentLinks />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        {icon}
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  brandText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 1,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
  },
  mainCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  urlInput: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    minHeight: 56,
  },
  aliasHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  aliasContainer: {
    flexDirection: "row",
    gap: 0,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    overflow: "hidden",
  },
  domainPicker: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f3f4f6",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    justifyContent: "center",
  },
  domainText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667eea",
  },
  aliasInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  disabledInput: {
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
  },
  proFeature: {
    fontSize: 14,
    color: "#f59e0b",
    fontWeight: "500",
    marginTop: 8,
  },
  shortenButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  shortenButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  successIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10b981",
    flex: 1,
  },
  urlResultContainer: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 16,
  },
  shortUrlText: {
    fontSize: 16,
    color: "#059669",
    fontWeight: "600",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#667eea",
  },
  featuresSection: {
    marginHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  ctaSection: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  ctaButtons: {
    width: "100%",
    gap: 12,
  },
  primaryCtaBtn: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryCtaText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  secondaryCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f8fafc",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  secondaryCtaText: {
    color: "#667eea",
    fontSize: 17,
    fontWeight: "700",
  },
  adsSection: {
    marginHorizontal: 20,
    marginTop: 32,
  },
  adBanner: {
    borderRadius: 16,
    overflow: "hidden",
  },
  bottomSpacing: {
    height: 40,
  },
});