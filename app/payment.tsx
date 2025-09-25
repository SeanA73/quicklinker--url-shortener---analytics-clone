import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Crown, Check, CreditCard, Calendar } from "lucide-react-native";
import { router } from "expo-router";

type PlanType = "monthly" | "yearly";

export default function PaymentScreen() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const plans = {
    monthly: {
      price: "$9.99",
      period: "per month",
      savings: null,
    },
    yearly: {
      price: "$99.99",
      period: "per year",
      savings: "Save 17%",
    },
  };

  const features = [
    "Unlimited custom aliases",
    "Advanced analytics & insights",
    "Bulk URL shortening",
    "API access",
    "Priority support",
    "Custom domains",
    "Team collaboration",
    "Export data",
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Payment Successful!",
        "Welcome to Pro! Your account has been upgraded.",
        [
          {
            text: "Continue",
            onPress: () => router.back(),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#f59e0b", "#d97706"]}
          style={styles.header}
        >
          <Crown color="#ffffff" size={48} />
          <Text style={styles.headerTitle}>Upgrade to Pro</Text>
          <Text style={styles.headerSubtitle}>
            Unlock all premium features and take your link management to the next level
          </Text>
        </LinearGradient>

        <View style={styles.planSelector}>
          <TouchableOpacity
            style={[
              styles.planOption,
              selectedPlan === "monthly" && styles.planOptionSelected,
            ]}
            onPress={() => setSelectedPlan("monthly")}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Monthly</Text>
              {selectedPlan === "monthly" && (
                <View style={styles.selectedBadge}>
                  <Check color="#ffffff" size={16} />
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>{plans.monthly.price}</Text>
            <Text style={styles.planPeriod}>{plans.monthly.period}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planOption,
              selectedPlan === "yearly" && styles.planOptionSelected,
            ]}
            onPress={() => setSelectedPlan("yearly")}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Yearly</Text>
              {plans.yearly.savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>{plans.yearly.savings}</Text>
                </View>
              )}
              {selectedPlan === "yearly" && (
                <View style={styles.selectedBadge}>
                  <Check color="#ffffff" size={16} />
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>{plans.yearly.price}</Text>
            <Text style={styles.planPeriod}>{plans.yearly.period}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What&apos;s included:</Text>
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Check color="#10b981" size={20} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.paymentSection}>
          <TouchableOpacity style={styles.paymentMethod}>
            <CreditCard color="#6366f1" size={24} />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Credit Card</Text>
              <Text style={styles.paymentSubtitle}>Secure payment via Stripe</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.upgradeButton, isProcessing && styles.upgradeButtonDisabled]}
            onPress={handlePayment}
            disabled={isProcessing}
          >
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              style={styles.upgradeGradient}
            >
              <Calendar color="#ffffff" size={20} />
              <Text style={styles.upgradeButtonText}>
                {isProcessing
                  ? "Processing..."
                  : `Start ${selectedPlan === "monthly" ? "Monthly" : "Yearly"} Plan`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            You can cancel anytime. No hidden fees. Secure payment processing.
          </Text>
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
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fef3c7",
    textAlign: "center",
    lineHeight: 24,
  },
  planSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -20,
    gap: 12,
  },
  planOption: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#f0f9ff",
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  selectedBadge: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  savingsBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
    color: "#6b7280",
  },
  featuresCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#374151",
  },
  paymentSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  upgradeButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  upgradeButtonDisabled: {
    opacity: 0.6,
  },
  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  upgradeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
});