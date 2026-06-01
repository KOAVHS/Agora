import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/theme';

const TABS = ['Resumen', 'Estadísticas', 'Roadmap'];

const LOGROS = [
  { id: '1', emoji: '🌟', label: 'Primera semana', done: true },
  { id: '2', emoji: '⚡', label: '10 sesiones', done: true },
  { id: '3', emoji: '🔥', label: 'Racha 7 días', done: true },
  { id: '4', emoji: '⏱️', label: '50 horas totales', done: false },
  { id: '5', emoji: '📦', label: 'Módulo completo', done: false },
  { id: '6', emoji: '🏆', label: 'Top 100', done: false },
];

const ROADMAP = [
  { id: '1', label: 'Fundamentos', done: true },
  { id: '2', label: 'Conceptos Core', done: true },
  { id: '3', label: 'Práctica Básica', done: true },
  { id: '4', label: 'Patrones', done: false, active: true, progress: 65 },
  { id: '5', label: 'Proyectos Reales', done: false },
  { id: '6', label: 'Avanzado', done: false },
  { id: '7', label: 'Portfolio Final', done: false },
];

const STATS = [
  { label: 'Tasa de completado', value: 33, color: colors.primary },
  { label: 'Consistencia', value: 78, color: colors.teal },
  { label: 'Velocidad de aprendizaje', value: 62, color: colors.warning },
  { label: 'Engagement', value: 88, color: colors.teal },
];

const SEMANA = [
  { day: 'Lun', h: 2 }, { day: 'Mar', h: 1.5 }, { day: 'Mié', h: 3 },
  { day: 'Jue', h: 0 }, { day: 'Vie', h: 1.5 }, { day: 'Sáb', h: 4 }, { day: 'Dom', h: 0.5 },
];

const maxH = Math.max(...SEMANA.map(s => s.h));

const generateContribData = () => {
  const data: { week: number; day: number; level: number }[] = [];
  for (let week = 0; week < 20; week++) {
    for (let day = 0; day < 7; day++) {
      const rand = Math.random();
      data.push({ week, day, level: rand > 0.6 ? Math.ceil(rand * 4) : 0 });
    }
  }
  return data;
};

const CONTRIB_DATA = generateContribData();
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function DashboardScreen() {
  const [tab, setTab] = useState(0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="book-open-variant" size={22} color="#fff" />
          <Text style={styles.headerTitle}>Agora</Text>
        </View>
        <View style={styles.headerRight}>
          <Ionicons name="settings-outline" size={22} color={colors.textMuted} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ES</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>ES</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Estudiante</Text>
              <Text style={styles.profileSub}>🌐 Matemáticas · principiante</Text>
              <Text style={styles.profileStreak}>🔥 12 días de racha</Text>
            </View>
          </View>
          <Text style={styles.progressLabel}>
            Progreso del roadmap <Text style={styles.progressPct}>33%</Text>
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.profileMetaText}>🎯 Hobby personal</Text>
            <Text style={styles.profileMetaText}>⏱ 2h/día</Text>
          </View>
        </View>

        {/* Stats cards */}
        <View style={styles.statsGrid}>
          {[
            { icon: 'flame', color: colors.warning, label: 'Racha actual', value: '12', unit: 'días' },
            { icon: 'clock-outline', color: colors.teal, label: 'Horas totales', value: '47.5', unit: 'hrs' },
            { icon: 'layers-outline', color: colors.primary, label: 'Módulos', value: '8', unit: '/24' },
            { icon: 'trophy-outline', color: '#EC4899', label: 'Posición', value: '#42', unit: 'global' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={styles.statHeader}>
                <Ionicons name={s.icon as any} size={18} color={s.color} />
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              <Text style={styles.statValue}>
                {s.value}<Text style={styles.statUnit}> {s.unit}</Text>
              </Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === i && styles.tabActive]}
              onPress={() => setTab(i)}
            >
              <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── TAB 0: RESUMEN ── */}
        {tab === 0 && (
          <View style={styles.tabContent}>

            {/* Días de estudio */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📅 Días de estudio</Text>
              <Text style={styles.sectionSub}>461 contribuciones en el último año</Text>
              <View style={styles.contribCalendar}>
                <View style={styles.contribDayLabels}>
                  {DAYS.map((d, i) => (
                    <Text key={i} style={styles.contribDayLabel}>{d}</Text>
                  ))}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.contribGrid}>
                    {Array.from({ length: 20 }).map((_, week) => (
                      <View key={week} style={styles.contribCol}>
                        {Array.from({ length: 7 }).map((_, day) => {
                          const cell = CONTRIB_DATA.find(c => c.week === week && c.day === day);
                          const level = cell?.level ?? 0;
                          const bg =
                            level === 0 ? colors.bgCard
                            : level === 1 ? '#3D1F8C'
                            : level === 2 ? '#5B2DB5'
                            : level === 3 ? '#7C3AED'
                            : '#9F6FF0';
                          return <View key={day} style={[styles.contribCell, { backgroundColor: bg }]} />;
                        })}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* Esta semana */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Esta semana</Text>
              <View style={styles.barChart}>
                {SEMANA.map((s) => (
                  <View key={s.day} style={styles.barWrap}>
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { height: `${(s.h / maxH) * 100}%` }]} />
                    </View>
                    <Text style={styles.barDay}>{s.day}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Logros */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏅 Logros</Text>
              <View style={styles.logrosGrid}>
                {LOGROS.map((l) => (
                  <View key={l.id} style={[styles.logroCard, !l.done && styles.logroCardDim]}>
                    <Text style={styles.logroEmoji}>{l.emoji}</Text>
                    <Text style={styles.logroLabel}>{l.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Sesión de hoy */}
            <View style={styles.sesionCard}>
              <View style={styles.sesionIcon}>
                <Ionicons name="flash" size={20} color="#fff" />
              </View>
              <View style={styles.sesionInfo}>
                <Text style={styles.sesionTitle}>Sesión de hoy</Text>
                <Text style={styles.sesionSub}>Continúa donde lo dejaste</Text>
              </View>
              <TouchableOpacity style={styles.sesionBtn}>
                <Text style={styles.sesionBtnText}>▶ Continuar</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

        {/* ── TAB 1: ESTADÍSTICAS ── */}
        {tab === 1 && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📈 Estadísticas globales</Text>
              {STATS.map((s) => (
                <View key={s.label} style={styles.statRow}>
                  <View style={styles.statRowHeader}>
                    <Text style={styles.statRowLabel}>{s.label}</Text>
                    <Text style={[styles.statRowPct, { color: s.color }]}>{s.value}%</Text>
                  </View>
                  <View style={styles.statBarBg}>
                    <View style={[styles.statBarFill, { width: `${s.value}%`, backgroundColor: s.color }]} />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Horas por semana</Text>
              <View style={styles.barChart}>
                {SEMANA.map((s) => (
                  <View key={s.day} style={styles.barWrap}>
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { height: `${(s.h / maxH) * 100}%`, backgroundColor: colors.teal }]} />
                    </View>
                    <Text style={styles.barDay}>{s.day}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Historial */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📅 Historial de actividad</Text>
              <Text style={styles.sectionSub}>461 contribuciones en el último año</Text>
              <View style={styles.contribCalendar}>
                <View style={styles.contribDayLabels}>
                  {DAYS.map((d, i) => (
                    <Text key={i} style={styles.contribDayLabel}>{d}</Text>
                  ))}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.contribGrid}>
                    {Array.from({ length: 20 }).map((_, week) => (
                      <View key={week} style={styles.contribCol}>
                        {Array.from({ length: 7 }).map((_, day) => {
                          const cell = CONTRIB_DATA.find(c => c.week === week && c.day === day);
                          const level = cell?.level ?? 0;
                          const bg =
                            level === 0 ? colors.bgCard
                            : level === 1 ? '#3D1F8C'
                            : level === 2 ? '#5B2DB5'
                            : level === 3 ? '#7C3AED'
                            : '#9F6FF0';
                          return <View key={day} style={[styles.contribCell, { backgroundColor: bg }]} />;
                        })}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        )}

        {/* ── TAB 2: ROADMAP ── */}
        {tab === 2 && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.roadmapHeader}>
                <Text style={styles.sectionTitle}>🗺️ Tu roadmap</Text>
                <Text style={[styles.sectionSub, { color: colors.primary }]}>Matemáticas</Text>
              </View>
              {ROADMAP.map((r, i) => (
                <View key={r.id} style={styles.roadmapItem}>
                  <View style={styles.roadmapLeft}>
                    <View style={[
                      styles.roadmapDot,
                      r.done && styles.roadmapDotDone,
                      r.active && styles.roadmapDotActive,
                    ]}>
                      {r.done
                        ? <Text style={styles.roadmapCheck}>✓</Text>
                        : <Text style={styles.roadmapNum}>{r.id}</Text>
                      }
                    </View>
                    {i < ROADMAP.length - 1 && (
                      <View style={[styles.roadmapLine, r.done && styles.roadmapLineDone]} />
                    )}
                  </View>
                  <View style={styles.roadmapContent}>
                    <Text style={[
                      styles.roadmapLabel,
                      r.active && styles.roadmapLabelActive,
                      !r.done && !r.active && styles.roadmapLabelDim,
                    ]}>
                      {r.label}
                    </Text>
                    {r.active && r.progress && (
                      <View style={styles.roadmapProgressBar}>
                        <View style={[styles.roadmapProgressFill, { width: `${r.progress}%` }]} />
                        <Text style={styles.roadmapProgressPct}>{r.progress}%</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.sesionCard}>
              <View style={styles.sesionIcon}>
                <Ionicons name="flash" size={20} color="#fff" />
              </View>
              <View style={styles.sesionInfo}>
                <Text style={styles.sesionTitle}>Sesión de hoy</Text>
                <Text style={styles.sesionSub}>Continúa donde lo dejaste</Text>
              </View>
              <TouchableOpacity style={styles.sesionBtn}>
                <Text style={styles.sesionBtnText}>▶ Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerTitle: { ...typography.h3, color: colors.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  profileCard: {
    margin: spacing.lg, backgroundColor: colors.bgCard,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, gap: spacing.sm,
  },
  profileTop: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', marginBottom: spacing.sm },
  profileAvatar: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
  },
  profileAvatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { ...typography.h3, color: colors.text },
  profileSub: { ...typography.small, color: colors.textMuted },
  profileStreak: { ...typography.small, color: colors.warning, fontWeight: '700' },
  progressLabel: { ...typography.small, color: colors.textMuted },
  progressPct: { color: colors.primary, fontWeight: '700' },
  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: colors.teal, borderRadius: 3 },
  profileMeta: { flexDirection: 'row', gap: spacing.lg },
  profileMetaText: { ...typography.small, color: colors.textMuted },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    paddingHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  statCard: {
    width: '47%', backgroundColor: colors.bgCard,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: spacing.sm,
  },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { ...typography.small, color: colors.textMuted },
  statValue: { ...typography.h2, color: colors.text },
  statUnit: { ...typography.small, color: colors.textMuted },
  tabs: {
    flexDirection: 'row', marginHorizontal: spacing.lg,
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    padding: 4, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.md },
  tabActive: { backgroundColor: '#1E1E35' },
  tabText: { ...typography.small, color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: colors.text, fontWeight: '700' },
  tabContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  section: {
    backgroundColor: colors.bgCard, borderRadius: radius.xl,
    padding: spacing.lg, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: spacing.md,
  },
  sectionTitle: { ...typography.body, color: colors.text, fontWeight: '700' },
  sectionSub: { ...typography.small, color: colors.textMuted },
  contribCalendar: { flexDirection: 'row', gap: 4 },
  contribDayLabels: { justifyContent: 'space-between', paddingVertical: 2, width: 24 },
  contribDayLabel: { fontSize: 9, color: colors.textSub, height: 15, lineHeight: 15 },
  contribGrid: { flexDirection: 'row', gap: 3 },
  contribCol: { flexDirection: 'column', gap: 3 },
  contribCell: { width: 12, height: 12, borderRadius: 2 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, height: 100 },
  barWrap: { flex: 1, alignItems: 'center', gap: 4 },
  barBg: { flex: 1, width: '100%', backgroundColor: colors.border, borderRadius: 4, justifyContent: 'flex-end' },
  barFill: { width: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  barDay: { ...typography.small, color: colors.textMuted, fontSize: 10 },
  logrosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  logroCard: {
    width: '30%', backgroundColor: '#1E1E35',
    borderRadius: radius.lg, padding: spacing.md,
    alignItems: 'center', gap: spacing.xs,
    borderWidth: 1, borderColor: colors.border,
  },
  logroCardDim: { opacity: 0.4 },
  logroEmoji: { fontSize: 24 },
  logroLabel: { ...typography.small, color: colors.textMuted, textAlign: 'center', fontSize: 10 },
  sesionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: radius.xl,
    padding: spacing.lg, gap: spacing.md,
    borderWidth: 1, borderColor: colors.teal + '44',
    marginTop: spacing.sm,
  },
  sesionIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
  },
  sesionInfo: { flex: 1 },
  sesionTitle: { ...typography.body, color: colors.text, fontWeight: '700' },
  sesionSub: { ...typography.small, color: colors.textMuted },
  sesionBtn: {
    backgroundColor: colors.teal, borderRadius: radius.lg,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
  },
  sesionBtnText: { ...typography.small, color: '#fff', fontWeight: '700' },
  statRow: { gap: spacing.xs },
  statRowHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  statRowLabel: { ...typography.small, color: colors.text },
  statRowPct: { ...typography.small, fontWeight: '700' },
  statBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  statBarFill: { height: 6, borderRadius: 3 },
  roadmapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roadmapItem: { flexDirection: 'row', gap: spacing.md, minHeight: 50 },
  roadmapLeft: { alignItems: 'center', width: 32 },
  roadmapDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#1E1E35',
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  roadmapDotDone: { backgroundColor: colors.teal, borderColor: colors.teal },
  roadmapDotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roadmapLine: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
  roadmapLineDone: { backgroundColor: colors.teal },
  roadmapCheck: { color: '#fff', fontWeight: '800', fontSize: 14 },
  roadmapNum: { color: colors.textMuted, fontWeight: '700', fontSize: 12 },
  roadmapContent: { flex: 1, paddingTop: spacing.sm, gap: spacing.xs },
  roadmapLabel: { ...typography.body, color: colors.text, fontWeight: '600' },
  roadmapLabelActive: { color: colors.primary },
  roadmapLabelDim: { color: colors.textMuted },
  roadmapProgressBar: {
    height: 6, backgroundColor: colors.border, borderRadius: 3,
    flexDirection: 'row', alignItems: 'center',
  },
  roadmapProgressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  roadmapProgressPct: { ...typography.small, color: colors.primary, fontSize: 10, marginLeft: spacing.xs },
});
