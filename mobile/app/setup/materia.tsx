import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors, radius, spacing, typography } from '../../constants/theme';

const MATERIAS = [
  { id: 'prog', icon: 'code-tags', color: '#7C3AED', label: 'Programación', sub: 'Fundamentos a arquitectura' },
  { id: 'math', icon: 'function-variant', color: '#2DD4BF', label: 'Matemáticas', sub: 'Álgebra, cálculo y más' },
  { id: 'sci', icon: 'flask', color: '#10B981', label: 'Ciencias', sub: 'Física, química, biología' },
  { id: 'lang', icon: 'globe-model', color: '#F59E0B', label: 'Idiomas', sub: 'Inglés, francés y más' },
  { id: 'art', icon: 'palette', color: '#EC4899', label: 'Arte & Diseño', sub: 'UI/UX, ilustración' },
  { id: 'cripto', icon: 'bitcoin', color: '#8B5CF6', label: 'Criptomonedas', sub: 'Fundamenos y Práctica' },
  { id: 'lit', icon: 'book-open-variant', color: '#06B6D4', label: 'Literatura', sub: 'Escritura y análisis' },
  { id: 'hist', icon: 'bank', color: '#F97316', label: 'Historia', sub: 'Civilizaciones mundiales' },
];

export default function MateriaScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agora</Text>
        <Text style={styles.headerStep}>1/5</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '20%' }]} />
      </View>
      <View style={styles.progressLabels}>
        {['Materia', 'Guía', 'Nivel', 'Tiempo', 'Meta'].map((l, i) => (
          <Text key={l} style={[styles.progressLabel, i === 0 && styles.progressLabelActive]}>{l}</Text>
        ))}
      </View>

      {/* Title */}
      <Text style={styles.title}>¿Qué quieres aprender?</Text>
      <Text style={styles.subtitle}>Elige tu materia principal</Text>

      {/* Grid */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.grid}>
          {MATERIAS.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.card, selected === m.id && styles.cardSelected]}
              onPress={() => setSelected(m.id)}
            >
              {m.icon === 'bitcoin' && <FontAwesome6 name="bitcoin" size={28} color={m.color} />}
              <MaterialCommunityIcons name={m.icon as any} size={28} color={m.color} />
              <Text style={styles.cardLabel}>{m.label}</Text>
              <Text style={styles.cardSub}>{m.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <TouchableOpacity
        style={[styles.btnNext, !selected && styles.btnDisabled]}
        onPress={() => selected && router.push('/setup/guia')}
        disabled={!selected}
      >
        <Text style={styles.btnNextText}>Siguiente ›</Text>
      </TouchableOpacity>
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
  progressLabel: { ...typography.label, color: colors.textSub, fontSize: 10 },
  progressLabelActive: { color: colors.primary },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  scroll: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingBottom: spacing.lg },
  card: {
    width: '48%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(124,58,237,0.1)' },
  cardLabel: { ...typography.h4, color: colors.text },
  cardSub: { ...typography.small, color: colors.textMuted },
  btnNext: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  btnDisabled: { opacity: 0.4 },
  btnNextText: { ...typography.body, color: '#fff', fontWeight: '700' },
});