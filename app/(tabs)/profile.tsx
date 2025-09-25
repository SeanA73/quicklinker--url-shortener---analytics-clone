import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NavBar } from "@/components/nav-bar";
import { User, Crown, Calendar, Link2, BarChart3, Zap } from "lucide-react-native";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleUpgrade = () => {
    router.push("/payment");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.authPrompt}>
          <User color="#9ca3af" size={64} />
          <Text style={styles.authTitle}>Sign in to view your profile</Text>
          <Text style={styles.authSubtitle}>
            Create an account to track your links and access premium features
          </Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push("/auth")}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
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
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User color="#ffffff" size={32} />
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.planBadge}>
              {user.plan === "pro" ? (
                <>
                  <Crown color="#f59e0b" size={16} />
                  <Text style={styles.planText}>Pro Plan</Text>
                </>
              ) : (
                <>
                  <Zap color="#10b981" size={16} />
                  <Text style={styles.planText}>Free Plan</Text>
                </>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {user.plan === "free" && (
          <TouchableOpacity style={styles.upgradeCard} onPress={handleUpgrade}>
            <LinearGradient
              colors={["#f59e0b", "#d97706"]}
              style={styles.upgradeGradient}
            >
              <Crown color="#ffffff" size={24} />
              <View style={styles.upgradeContent}>
                <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
                <Text style={styles.upgradeSubtitle}>
                  Unlock custom aliases, advanced analytics, and more
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Link2 color="#6366f1" size={20} />
              <Text style={styles.statValue}>{user.stats?.totalLinks || 0}</Text>
              <Text style={styles.statLabel}>Links Created</Text>
            </View>
            <View style={styles.statItem}>
              <BarChart3 color="#10b981" size={20} />
              <Text style={styles.statValue}>{user.stats?.totalClicks || 0}</Text>
              <Text style={styles.statLabel}>Total Clicks</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Account Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <View style={styles.infoValue}>
              <Calendar color="#6b7280" size={16} />
              <Text style={styles.infoText}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Plan</Text>
            <Text style={styles.infoText}>
              {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
            </Text>
          </View>
          {user.plan === "pro" && user.subscriptionEnd && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Subscription Ends</Text>
              <Text style={styles.infoText}>
                {new Date(user.subscriptionEnd).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
  profileHeader: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#e2e8f0",
    marginBottom: 12,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  planText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  authPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  authButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  authButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  upgradeCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: -20,
    marginBottom: 20,
  },
  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: "#fef3c7",
  },
  statsCard: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  infoValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});