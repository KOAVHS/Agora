import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/theme';

const METAS = [
  { id: 'hobby', emoji: '🎯', label: 'Hobby personal' },
  { id: 'career', emoji: '💼', label: 'Cambio de carrera' },
  { id: 'project', emoji: '🔧', label: 'Proyecto específico' },
  { id: 'cert', emoji: '🏆', label: 'Certificación' },
];

export default function MetaScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agora</Text>
        <Text style={styles.headerStep}>5/5</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '100%' }]} />
      </View>
      <View style={styles.progressLabels}>
        {['Materia', 'Guía', 'Nivel', 'Tiempo', 'Meta'].map((l, i) => (
          <Text key={l} style={[styles.progressLabel, i === 4 && styles.progressLabelActive]}>{l}</Text>
        ))}
      </View>

      <Text style={styles.title}>¿Cuál es tu meta?</Text>
      <Text style={styles.subtitle}>Esto personaliza tu experiencia</Text>

      {/* Grid 2x2 */}
      <View style={styles.grid}>
        {METAS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.card, selected === m.id && styles.cardSelected]}
            onPress={() => setSelected(m.id)}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text style={[styles.label, selected === m.id && styles.labelActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
          <Text style={styles.btnBackText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnNext, !selected && styles.btnDisabled]}
          onPress={() => selected && router.push('/dashboard')}
          disabled={!selected}
        >
          <Text style={styles.btnNextText}>✦ Comenzar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  headerTitle: { ...typography.h3, color: colors.text },
  headerStep: { ...typography.small, color: colors.textMuted },
  progressBar: { height: 3, backgroundColor: colors.border, borderRadius: 2, marginBottom: spacing.sm },
  progressFill: { height: 3, backgroundColor: colors.primary, borderRadius: 2 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  progressLabel: { fontSize: 10, fontWeight: '700', color: colors.textSub, letterSpacing: 0.5 },
  progressLabelActive: { color: colors.primary },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.xl },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(124,58,237,0.1)' },
  emoji: { fontSize: 36 },
  label: { ...typography.body, color: colors.text, fontWeight: '600', textAlign: 'center' },
  labelActive: { color: colors.primary },
  footer: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.lg },
  btnBack: {
    flex: 1, backgroundColor: colors.bgCard,
    borderRadius: radius.lg, paddingVertical: spacing.md,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  btnBackText: { ...typography.body, color: colors.text, fontWeight: '600' },
  btnNext: {
    flex: 1, backgroundColor: colors.primary,
    borderRadius: radius.lg, paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnNextText: { ...typography.body, color: '#fff', fontWeight: '700' },
});