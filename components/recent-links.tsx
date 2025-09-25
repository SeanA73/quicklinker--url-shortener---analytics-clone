import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { ExternalLink, Copy, BarChart3 } from "lucide-react-native";
import { useRecentLinks } from "@/hooks/use-url-shortener";

export function RecentLinks() {
  const { data: links, isLoading } = useRecentLinks();

  const copyToClipboard = async (url: string) => {
    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(url);
    } else {
      const Clipboard = await import("expo-clipboard");
      await Clipboard.setStringAsync(url);
    }
    Alert.alert("Copied!", "URL copied to clipboard");
  };

  const openUrl = async (url: string) => {
    await Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Links</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!links || links.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Links</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No links created yet</Text>
          <Text style={styles.emptySubtext}>
            Your shortened URLs will appear here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Links</Text>
      <View style={styles.linksList}>
        {links.slice(0, 5).map((link) => (
          <View key={link.id} style={styles.linkItem}>
            <View style={styles.linkInfo}>
              <Text style={styles.shortUrl} numberOfLines={1}>
                {link.shortUrl}
              </Text>
              <Text style={styles.originalUrl} numberOfLines={1}>
                {link.originalUrl}
              </Text>
              <View style={styles.linkMeta}>
                <View style={styles.clicksContainer}>
                  <BarChart3 color="#6b7280" size={14} />
                  <Text style={styles.clicksText}>{link.clicks} clicks</Text>
                </View>
                <Text style={styles.dateText}>
                  {new Date(link.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.linkActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => copyToClipboard(link.shortUrl)}
              >
                <Copy color="#6366f1" size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openUrl(link.shortUrl)}
              >
                <ExternalLink color="#6366f1" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  loadingText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    paddingVertical: 20,
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  linksList: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  linkInfo: {
    flex: 1,
  },
  shortUrl: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
    marginBottom: 4,
  },
  originalUrl: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  linkMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clicksContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clicksText: {
    fontSize: 12,
    color: "#6b7280",
  },
  dateText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  linkActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f8fafc",
  },
});