import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NavBar } from "@/components/nav-bar";
import { BarChart3, TrendingUp, Globe, Smartphone, Monitor } from "lucide-react-native";
import { useAnalytics } from "@/hooks/use-analytics";

export default function AnalyticsScreen() {
  const { data: analytics, isLoading } = useAnalytics();
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("7d");

  const periods = [
    { key: "7d" as const, label: "7 Days" },
    { key: "30d" as const, label: "30 Days" },
    { key: "90d" as const, label: "90 Days" },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <NavBar />
        <LinearGradient
          colors={["#0b2340", "#0a1e34"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <BarChart3 color="#ffffff" size={28} />
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSubtitle}>
              Track your link performance
            </Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp color="#10b981" size={24} />
            </View>
            <Text style={styles.statValue}>{analytics?.totalClicks || 0}</Text>
            <Text style={styles.statLabel}>Total Clicks</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <BarChart3 color="#6366f1" size={24} />
            </View>
            <Text style={styles.statValue}>{analytics?.totalLinks || 0}</Text>
            <Text style={styles.statLabel}>Total Links</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Click Activity</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartPlaceholder}>
              <BarChart3 color="#9ca3af" size={48} />
              <Text style={styles.chartPlaceholderText}>
                Chart visualization would appear here
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.deviceCard}>
          <Text style={styles.deviceTitle}>Device Breakdown</Text>
          <View style={styles.deviceList}>
            <View style={styles.deviceItem}>
              <Smartphone color="#6366f1" size={20} />
              <Text style={styles.deviceLabel}>Mobile</Text>
              <Text style={styles.devicePercentage}>65%</Text>
            </View>
            <View style={styles.deviceItem}>
              <Monitor color="#10b981" size={20} />
              <Text style={styles.deviceLabel}>Desktop</Text>
              <Text style={styles.devicePercentage}>30%</Text>
            </View>
            <View style={styles.deviceItem}>
              <Globe color="#f59e0b" size={20} />
              <Text style={styles.deviceLabel}>Other</Text>
              <Text style={styles.devicePercentage}>5%</Text>
            </View>
          </View>
        </View>

        <View style={styles.topLinksCard}>
          <Text style={styles.topLinksTitle}>Top Performing Links</Text>
          {analytics?.topLinks?.map((link: { shortUrl: string; originalUrl: string; clicks: number }, index: number) => (
            <View key={index} style={styles.linkItem}>
              <View style={styles.linkInfo}>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  {link.shortUrl}
                </Text>
                <Text style={styles.linkOriginal} numberOfLines={1}>
                  {link.originalUrl}
                </Text>
              </View>
              <Text style={styles.linkClicks}>{link.clicks}</Text>
            </View>
          )) || (
            <Text style={styles.noDataText}>No links created yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 8,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    textAlign: "center",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 4,
    marginTop: -20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: "#6366f1",
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  periodButtonTextActive: {
    color: "#ffffff",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  chartContainer: {
    height: 200,
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  chartPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  deviceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  deviceList: {
    gap: 12,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deviceLabel: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  devicePercentage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  topLinksCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topLinksTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  linkInfo: {
    flex: 1,
  },
  linkUrl: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
    marginBottom: 2,
  },
  linkOriginal: {
    fontSize: 14,
    color: "#6b7280",
  },
  linkClicks: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  noDataText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 16,
    paddingVertical: 20,
  },
});