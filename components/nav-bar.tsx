import React, { useCallback, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/providers/auth-provider";
import { router, usePathname } from "expo-router";
import { ChevronDown, HelpCircle, Crown, LogIn, UserPlus } from "lucide-react-native";

export function NavBar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [featuresOpen, setFeaturesOpen] = useState<boolean>(false);

  const onNavigate = useCallback((path: string) => {
    router.push(path as never);
  }, []);

  const onExternal = useCallback(async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.log("Failed to open URL", e);
    }
  }, []);

  const isActive = useCallback(
    (path: string) => pathname === path,
    [pathname]
  );

  const featureItems = useMemo(
    () => [
      { label: "Custom Aliases", path: "/(tabs)" },
      { label: "Analytics", path: "/(tabs)/analytics" },
    ],
    []
  );

  return (
    <LinearGradient
      testID="navbar-root"
      colors={["#0f2940", "#0b2337"]}
      style={styles.container}
    >
      <View style={styles.inner}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => onNavigate("/(tabs)")}
          style={styles.brand}
          testID="navbar-brand"
        >
          <Text style={styles.brandText}>QUICKLINK</Text>
        </TouchableOpacity>

        <View style={styles.menuPill} testID="navbar-menu">
          <TouchableOpacity
            style={[styles.menuItem, isActive("/(tabs)") && styles.menuItemActive]}
            onPress={() => onNavigate("/(tabs)")}
            testID="nav-my-urls"
          >
            <Text style={[styles.menuText, isActive("/(tabs)") && styles.menuTextActive]}>My URLs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onNavigate("/payment")}
            testID="nav-plans"
          >
            <Crown size={14} color="#e5eef7" />
            <Text style={styles.menuText}>Plans</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onExternal("https://quicklink.click/blog")}
            testID="nav-blog"
          >
            <Text style={styles.menuText}>Blog</Text>
          </TouchableOpacity>

          <View style={styles.featuresWrapper}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setFeaturesOpen((v) => !v)}
              testID="nav-features"
            >
              <Text style={styles.menuText}>Features</Text>
              <ChevronDown size={14} color="#e5eef7" />
            </TouchableOpacity>
            {featuresOpen && (
              <View style={styles.dropdown} testID="features-dropdown">
                {featureItems.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFeaturesOpen(false);
                      onNavigate(item.path);
                    }}
                  >
                    <Text style={styles.dropdownText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {!user && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => onNavigate("/auth")}
                testID="nav-signup"
              >
                <UserPlus size={14} color="#e5eef7" />
                <Text style={styles.menuText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => onNavigate("/auth")}
                testID="nav-signin"
              >
                <LogIn size={14} color="#e5eef7" />
                <Text style={styles.menuText}>Sign In</Text>
              </TouchableOpacity>
            </>
          )}

          {!!user && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onNavigate("/(tabs)/profile")}
              testID="nav-profile"
            >
              <HelpCircle size={14} color="#e5eef7" />
              <Text style={styles.menuText}>Account</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 16 : 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  inner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  brandText: {
    color: "#e5eef7",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
  },
  menuPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(54, 99, 139, 0.6)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  menuText: {
    color: "#e5eef7",
    fontSize: 14,
    fontWeight: "600",
  },
  menuTextActive: {
    color: "#ffffff",
  },
  featuresWrapper: {
    position: "relative",
  },
  dropdown: {
    position: "absolute",
    top: 36,
    right: 0,
    backgroundColor: "#18324a",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#21415f",
    minWidth: 160,
    zIndex: 50,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: "#e5eef7",
    fontSize: 14,
    fontWeight: "500",
  },
});