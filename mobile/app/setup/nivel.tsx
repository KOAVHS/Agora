import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/theme';

const NIVELES = [
  { id: 'beginner', emoji: '🌱', label: 'Principiante', sub: 'Sin experiencia previa' },
  { id: 'basic', emoji: '📘', label: 'Básico', sub: 'Conceptos fundamentales claros' },
  { id: 'mid', emoji: '⚡', label: 'Intermedio', sub: 'Experiencia moderada' },
  { id: 'advanced', emoji: '🚀', label: 'Avanzado', sub: 'Conocimiento profundo' },
];

export default function NivelScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agora</Text>
        <Text style={styles.headerStep}>3/5</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '60%' }]} />
      </View>
      <View style={styles.progressLabels}>
        {['Materia', 'Guía', 'Nivel', 'Tiempo', 'Meta'].map((l, i) => (
          <Text key={l} style={[styles.progressLabel, i === 2 && styles.progressLabelActive]}>{l}</Text>
        ))}
      </View>

      <Text style={styles.title}>¿Cuál es tu nivel?</Text>
      <Text style={styles.subtitle}>Sé honesto, adaptaremos el camino</Text>

      <View style={styles.list}>
        {NIVELES.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={[styles.card, selected === n.id && styles.cardSelected]}
            onPress={() => setSelected(n.id)}
          >
            <Text style={styles.emoji}>{n.emoji}</Text>
            <View style={styles.info}>
              <Text style={[styles.label, selected === n.id && styles.labelActive]}>{n.label}</Text>
              <Text style={styles.sub}>{n.sub}</Text>
            </View>
            {selected === n.id && (
              <View style={styles.check}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
          <Text style={styles.btnBackText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnNext, !selected && styles.btnDisabled]}
          onPress={() => selected && router.push('/setup/tiempo')}
          disabled={!selected}
        >
          <Text style={styles.btnNextText}>Siguiente ›</Text>
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
  list: { flex: 1, gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(124,58,237,0.1)' },
  emoji: { fontSize: 28 },
  info: { flex: 1, gap: 3 },
  label: { ...typography.h4, color: colors.text },
  labelActive: { color: colors.primary },
  sub: { ...typography.small, color: colors.textMuted },
  check: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { color: '#fff', fontSize: 12, fontWeight: '700' },
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