import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Errore", "Inserisci la tua email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Errore", "Inserisci un indirizzo email valido");
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      Alert.alert("Errore", error.message);
    } else {
      setEmailSent(true);
      Alert.alert(
        "Email inviata!",
        "Controlla la tua casella di posta e segui le istruzioni per reimpostare la password.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>✅ Email Inviata</Text>
        <Text style={styles.subtitle}>
          Abbiamo inviato le istruzioni per reimpostare la password a:
        </Text>
        <Text style={styles.emailText}>{email}</Text>
        <Text style={styles.description}>
          Controlla la tua casella di posta (incluso lo spam) e segui il link
          per reimpostare la password.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleBackToLogin}>
          <Text style={styles.buttonText}>Torna al Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Password Dimenticata</Text>
      <Text style={styles.subtitle}>
        Inserisci la tua email per ricevere le istruzioni di reset
      </Text>

      <TextInput
        style={styles.input}
        placeholder="La tua email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>📧 Invia Email di Reset</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBackToLogin} style={styles.linkButton}>
        <Text style={styles.linkText}>← Torna al Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 20,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#007AFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
