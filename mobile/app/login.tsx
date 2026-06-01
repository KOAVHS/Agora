import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../constants/theme';
import { apiLogin } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Image } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { setToken, fetchMe } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const data = await apiLogin(email, password);

      setToken(data.access_token);

      await fetchMe(data.access_token);

      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert(
        'Error',
        e?.message || 'No se pudo iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <View style={styles.logoBox}>
          <Image
                         source={require('../assets/Agora-Icon1.png')}
                         style={{
                                  width: 100,
                                  height: 100,
                        }}
                       resizeMode="contain"
         />
        </View>

        <Text style={styles.title}>Bienvenido de nuevo</Text>

        <Text style={styles.subtitle}>
          Inicia sesión para continuar
        </Text>

        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Email</Text>

          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor={colors.textSub}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Contraseña</Text>

          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={colors.textSub}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
            >
              <MaterialCommunityIcons
                name={showPass ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.btnPrimary,
            loading && { opacity: 0.7 },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnPrimaryText}>
              Iniciar sesión
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/register')}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>
            ¿No tienes cuenta? Crear cuenta
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>
            ← Volver
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },

  card: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  logoBox: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  fieldWrap: {
    width: '100%',
    marginBottom: spacing.md,
  },

  fieldLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  input: {
    width: '100%',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.body,
  },

  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.text,
    ...typography.body,
  },

  btnPrimary: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  btnPrimaryText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '700',
  },

  linkBtn: {
    marginTop: spacing.md,
  },

  linkText: {
    ...typography.body,
    color: colors.primary,
  },

  backBtn: {
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },

  backText: {
    ...typography.body,
    color: colors.textMuted,
  },
});