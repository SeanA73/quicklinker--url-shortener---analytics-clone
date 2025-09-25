import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NavBar } from "@/components/nav-bar";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  HelpCircle,
  Mail,
  Trash2,
  ExternalLink,
} from "lucide-react-native";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";

export default function SettingsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<boolean>(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Need help? Reach out to our support team.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Email Support", onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <NavBar />
        <LinearGradient
          colors={["#0b2340", "#0a1e34"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <SettingsIcon color="#ffffff" size={28} />
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>
              Manage your account and preferences
            </Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell color="#6366f1" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get notified about link activity
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield color="#10b981" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Analytics Tracking</Text>
                <Text style={styles.settingDescription}>
                  Allow anonymous usage analytics
                </Text>
              </View>
            </View>
            <Switch
              value={analytics}
              onValueChange={setAnalytics}
              trackColor={{ false: "#e5e7eb", true: "#10b981" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleContactSupport}>
            <View style={styles.settingInfo}>
              <Mail color="#f59e0b" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Contact Support</Text>
                <Text style={styles.settingDescription}>
                  Get help with your account
                </Text>
              </View>
            </View>
            <ExternalLink color="#9ca3af" size={16} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <HelpCircle color="#8b5cf6" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Help Center</Text>
                <Text style={styles.settingDescription}>
                  Browse our help articles
                </Text>
              </View>
            </View>
            <ExternalLink color="#9ca3af" size={16} />
          </TouchableOpacity>
        </View>

        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity
              style={[styles.settingItem, styles.dangerItem]}
              onPress={handleDeleteAccount}
            >
              <View style={styles.settingInfo}>
                <Trash2 color="#ef4444" size={20} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, styles.dangerText]}>
                    Delete Account
                  </Text>
                  <Text style={styles.settingDescription}>
                    Permanently delete your account and data
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>© 2024 Quicklink</Text>
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
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  dangerItem: {
    borderBottomColor: "#fecaca",
  },
  dangerText: {
    color: "#ef4444",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: "#9ca3af",
  },
});