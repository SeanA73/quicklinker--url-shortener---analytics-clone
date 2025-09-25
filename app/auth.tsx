import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Link2, Mail, Lock, User, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!isLogin && !formData.name) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
              <Link2 color="#ffffff" size={48} />
              <Text style={styles.logoText}>Quicklink</Text>
              <Text style={styles.logoSubtext}>
                {isLogin ? "Welcome back!" : "Create your account"}
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.formContainer}>
            <View style={styles.form}>
              <Text style={styles.formTitle}>
                {isLogin ? "Sign In" : "Sign Up"}
              </Text>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <User color="#9ca3af" size={20} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Mail color="#9ca3af" size={20} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Lock color="#9ca3af" size={20} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff color="#9ca3af" size={20} />
                  ) : (
                    <Eye color="#9ca3af" size={20} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#6366f1", "#8b5cf6"]}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading
                      ? "Please wait..."
                      : isLogin
                      ? "Sign In"
                      : "Create Account"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </Text>
                <TouchableOpacity onPress={toggleMode}>
                  <Text style={styles.switchLink}>
                    {isLogin ? "Sign Up" : "Sign In"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  logoSubtext: {
    fontSize: 16,
    color: "#e2e8f0",
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    marginTop: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#f9fafb",
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  passwordToggle: {
    paddingHorizontal: 16,
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 4,
  },
  switchText: {
    fontSize: 14,
    color: "#6b7280",
  },
  switchLink: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
  },
});