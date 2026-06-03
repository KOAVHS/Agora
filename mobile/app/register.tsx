import { useAuthStore } from '../store/useAuthStore';
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
import { apiRegister } from '../services/api';
import { Image } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
  if (!name || !email || !password || !passwordConfirm) {
    Alert.alert('Error', 'Completa todos los campos');
    return;
  }

  if (password !== passwordConfirm) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }

  setLoading(true);
  try {
    console.log('Intentando registrar:', { name, email });
    const data = await apiRegister(name, email, password);
    console.log('Respuesta:', data);
    Alert.alert('Éxito', JSON.stringify(data));
  } catch (e: any) {
    console.log('Error completo:', e);
    Alert.alert('Error', e.message || 'No se pudo crear la cuenta');
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

        <Text style={styles.title}>Bienvenido a Agora</Text>
        <Text style={styles.subtitle}>Tu aventura de aprendizaje comienza aquí</Text>

        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor={colors.textSub}
            value={name}
            onChangeText={setName}
          />
        </View>

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
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <MaterialCommunityIcons
                name={showPass ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Confirmar Contraseña</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={colors.textSub}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <MaterialCommunityIcons
                name={showPass ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btnPrimary, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnPrimaryText}>Crear mi cuenta</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center', padding: spacing.lg,
  },
  card: {
    width: '100%', backgroundColor: colors.bgCard,
    borderRadius: radius.xl, padding: spacing.xl,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  logoBox: {
    width: 56, height: 56, borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  title: { ...typography.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg },
  fieldWrap: { width: '100%', marginBottom: spacing.md },
  fieldLabel: { ...typography.small, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    width: '100%', backgroundColor: colors.bg,
    borderRadius: radius.md, padding: spacing.md,
    color: colors.text, borderWidth: 1, borderColor: colors.border,
    ...typography.body,
  },
  passwordWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bg, borderRadius: radius.md,
    paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  passwordInput: { flex: 1, paddingVertical: spacing.md, color: colors.text, ...typography.body },
  btnPrimary: {
    width: '100%', backgroundColor: colors.primary,
    borderRadius: radius.lg, paddingVertical: spacing.md,
    alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md,
  },
  btnPrimaryText: { ...typography.body, color: '#fff', fontWeight: '700' },
  backBtn: { paddingVertical: spacing.sm },
  backText: { ...typography.body, color: colors.textMuted },
});