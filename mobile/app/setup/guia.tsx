import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/theme';

const GUIAS = [
  { id: 'ana', initials: 'AG', color: '#7C3AED', name: 'Ana García', spec: 'Ingeniería de Software', students: '12,340', rating: '4.9' },
  { id: 'car', initials: 'CR', color: '#2DD4BF', name: 'Carlos Ruiz', spec: 'Data Science', students: '8,720', rating: '4.8' },
  { id: 'mar', initials: 'ML', color: '#EC4899', name: 'María López', spec: 'Diseño UI/UX', students: '5,430', rating: '4.9' },
];

export default function GuiaScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agora</Text>
        <Text style={styles.headerStep}>2/5</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '40%' }]} />
      </View>
      <View style={styles.progressLabels}>
        {['Materia', 'Guía', 'Nivel', 'Tiempo', 'Meta'].map((l, i) => (
          <Text key={l} style={[styles.progressLabel, i === 1 && styles.progressLabelActive]}>{l}</Text>
        ))}
      </View>

      <Text style={styles.title}>Elige tu guía experto</Text>
      <Text style={styles.subtitle}>Cada creador tiene su enfoque único</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {GUIAS.map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[styles.card, selected === g.id && styles.cardSelected]}
            onPress={() => setSelected(g.id)}
          >
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: g.color }]}>
              <Text style={styles.avatarText}>{g.initials}</Text>
            </View>
            {/* Info */}
            <View style={styles.info}>
              <Text style={styles.name}>{g.name}</Text>
              <Text style={styles.spec}>📚 {g.spec}</Text>
              <View style={styles.stats}>
                <Text style={styles.statText}>👥 {g.students}</Text>
                <Text style={styles.statText}>⭐ {g.rating}</Text>
              </View>
            </View>
            {/* Check */}
            {selected === g.id && (
              <View style={styles.check}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
          <Text style={styles.btnBackText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnNext, !selected && styles.btnDisabled]}
          onPress={() => selected && router.push('/setup/nivel')}
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
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  scroll: { flex: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(124,58,237,0.1)' },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  info: { flex: 1, gap: 3 },
  name: { ...typography.h4, color: colors.text },
  spec: { ...typography.small, color: colors.textMuted },
  stats: { flexDirection: 'row', gap: spacing.md, marginTop: 2 },
  statText: { ...typography.small, color: colors.textMuted },
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