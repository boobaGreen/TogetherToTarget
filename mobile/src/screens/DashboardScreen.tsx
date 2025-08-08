import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert("Logout", "Sei sicuro di voler uscire?", [
      { text: "Annulla", style: "cancel" },
      { text: "Esci", onPress: signOut },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.welcome}>Benvenuto, {user?.email}!</Text>

      <View style={styles.content}>
        <Text style={styles.subtitle}>🎯 TogetherToTarget</Text>
        <Text style={styles.description}>
          La tua app motivazionale per raggiungere obiettivi insieme ad altri.
        </Text>

        <View style={styles.featureList}>
          <Text style={styles.feature}>✅ Autenticazione completata</Text>
          <Text style={styles.feature}>🔜 Creazione gruppi</Text>
          <Text style={styles.feature}>🔜 Matching utenti</Text>
          <Text style={styles.feature}>🔜 Sistema motivazionale</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  welcome: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 24,
  },
  featureList: {
    marginTop: 20,
  },
  feature: {
    fontSize: 16,
    marginBottom: 10,
    paddingLeft: 20,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
