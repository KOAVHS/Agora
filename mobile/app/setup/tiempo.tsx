import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../constants/theme';

const HORAS = ['0.5h', '1h', '1.5h', '2h', '3h', '4h', '5h', '6h'];

const getDias = (h: string) => {
  const val = parseFloat(h);
  const dias = Math.round(120 / val);
  return `~${dias} días para completar el roadmap`;
};

export default function TiempoScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('2h');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agora</Text>
        <Text style={styles.headerStep}>4/5</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '80%' }]} />
      </View>
      <View style={styles.progressLabels}>
        {['Materia', 'Guía', 'Nivel', 'Tiempo', 'Meta'].map((l, i) => (
          <Text key={l} style={[styles.progressLabel, i === 3 && styles.progressLabelActive]}>{l}</Text>
        ))}
      </View>

      <Text style={styles.title}>¿Cuánto tiempo tienes?</Text>
      <Text style={styles.subtitle}>Horas de estudio diarias</Text>

      {/* Big number */}
      <View style={styles.bigNumberWrap}>
        <Text style={styles.bigNumber}>{selected.replace('h', '')}</Text>
        <Text style={styles.bigNumberSub}>horas por día</Text>
      </View>

      {/* Chips */}
      <View style={styles.chips}>
        {HORAS.map((h) => (
          <TouchableOpacity
            key={h}
            style={[styles.chip, selected === h && styles.chipSelected]}
            onPress={() => setSelected(h)}
          >
            <Text style={[styles.chipText, selected === h && styles.chipTextSelected]}>{h}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Estimado */}
      <View style={styles.estimado}>
        <Ionicons name="time-outline" size={18} color={colors.textMuted} />
        <View>
          <Text style={styles.estimadoTitle}>Estimado de finalización</Text>
          <Text style={styles.estimadoSub}>{getDias(selected)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
          <Text style={styles.btnBackText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnNext}
          onPress={() => router.push('/setup/meta')}
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
  bigNumberWrap: { alignItems: 'center', marginBottom: spacing.xl },
  bigNumber: { fontSize: 80, fontWeight: '900', color: colors.primary, lineHeight: 90 },
  bigNumberSub: { ...typography.body, color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.xl },
  chip: {
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.bgCard,
    borderWidth: 1, borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.body, color: colors.textMuted, fontWeight: '600' },
  chipTextSelected: { color: '#fff' },
  estimado: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  estimadoTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  estimadoSub: { ...typography.small, color: colors.textMuted },
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
  btnNextText: { ...typography.body, color: '#fff', fontWeight: '700' },
});