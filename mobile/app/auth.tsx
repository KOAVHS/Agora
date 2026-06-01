import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/theme';
import { Image } from 'react-native';

export default function AuthScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
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

        {/* Google */}
        <TouchableOpacity style={styles.btnGoogle} onPress={() => {}}>
          <Image
                         source={require('../assets/google-icon.png')}
                         style={{
                                  width: 30,
                                  height: 20,
                        }}
                       resizeMode="contain"
                 />
          <Text style={styles.btnGoogleText}>Continuar con Google</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Crear cuenta */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.btnPrimaryText}>Crear cuenta gratis</Text>
        </TouchableOpacity>

        {/* Iniciar sesión */}
        <TouchableOpacity
          style={styles.btnGhost}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.btnGhostText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    width: 56, height: 56, borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  btnGoogle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  btnGoogleText: {
    ...typography.body,
    color: '#111',
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1, height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.small,
    color: colors.textMuted,
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  btnPrimaryText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '700',
  },
  btnGhost: {
    width: '100%',
    backgroundColor: colors.bgCardHigh ?? '#1E1E35',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnGhostText: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: '600',
  },
});