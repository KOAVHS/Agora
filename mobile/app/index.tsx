import { useRouter } from 'expo-router';
import { useRef, useState, FC, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
import { colors, radius, spacing, typography } from '../constants/theme';


const { width } = Dimensions.get('window');

// ── Ilustración 1: Cerebro con íconos flotantes ──────────────────────────────
const BrainIllustration = () => (
  <View style={il.wrap}>
    {/* Ícono </> arriba derecha */}
    <View style={[il.floatingIcon, { top: 10, right: 30 }]}>
      <MaterialCommunityIcons name="code-tags" size={18} color={colors.primary} />
    </View>
    {/* Ícono cerebro izquierda */}
    <View style={[il.floatingIcon, { top: 40, left: 20 }]}>
      <MaterialCommunityIcons name="brain" size={18} color="#E879F9" />
    </View>
    {/* Cerebro central */}
    <View style={il.centerIcon}>
      <MaterialCommunityIcons name="brain" size={72} color={colors.primary} />
    </View>
    {/* Globo abajo izquierda */}
    <View style={[il.floatingIcon, { bottom: 10, left: 35 }]}>
      <Ionicons name="globe-outline" size={18} color={colors.warning} />
    </View>
  </View>
);

// ── Ilustración 2: Roadmap ────────────────────────────────────────────────────
const RoadmapIllustration = () => (
  <View style={il.wrap}>
    <Svg width={160} height={160} viewBox="0 0 160 160">
      <Line x1="70" y1="30" x2="90" y2="65" stroke={colors.border} strokeWidth={2} strokeDasharray="4,4" />
      <Line x1="90" y1="65" x2="55" y2="100" stroke={colors.border} strokeWidth={2} strokeDasharray="4,4" />
      <Line x1="55" y1="100" x2="105" y2="128" stroke={colors.border} strokeWidth={2} strokeDasharray="4,4" />
      <Circle cx={70} cy={30} r={13} fill={colors.primary} />
      <Circle cx={70} cy={30} r={5} fill="#fff" />
      <Circle cx={90} cy={65} r={13} fill={colors.primary} opacity={0.85} />
      <Circle cx={90} cy={65} r={5} fill="#fff" />
      <Circle cx={55} cy={100} r={13} fill={colors.primary} opacity={0.65} />
      <Circle cx={55} cy={100} r={5} fill="#fff" />
      <Circle cx={105} cy={128} r={13} fill={colors.bgCard} stroke={colors.borderStrong} strokeWidth={2} />
      <Circle cx={105} cy={128} r={5} fill={colors.border} />
    </Svg>
  </View>
);

// ── Ilustración 3: Barras ─────────────────────────────────────────────────────
const StatsIllustration = () => {
  const bars = [
    { day: 'M', h: 50 }, { day: 'T', h: 25 }, { day: 'W', h: 40 },
    { day: 'T', h: 100, active: true }, { day: 'F', h: 60 },
    { day: 'S', h: 35 }, { day: 'S', h: 45 },
  ];
  const barW = 16, gap = 8, startX = 10, baseY = 120;
  return (
    <View style={il.wrap}>
      <Svg width={180} height={140} viewBox="0 0 180 140">
        {bars.map((b, i) => {
          const x = startX + i * (barW + gap);
          return (
            <Rect
              key={`bar-${i}`}
              x={x} y={baseY - b.h}
              width={barW} height={b.h}
              rx={5}
              fill={b.active ? colors.primary : '#2A2A4A'}
            />
          );
        })}
      </Svg>
      <View style={il.labels}>
        {bars.map((b, i) => (
          <Text key={`label-${i}`} style={[il.dayLabel, b.active && il.dayActive]}>{b.day}</Text>
        ))}
      </View>
    </View>
  );
};

const il = StyleSheet.create({
  wrap: {
    width: '100%', height: 170,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  centerIcon: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(124,58,237,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  floatingIcon: {
    position: 'absolute',
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bgCard,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  labels: { flexDirection: 'row', gap: 8, marginTop: 4 },
  dayLabel: { fontSize: 11, color: colors.textMuted, width: 24, textAlign: 'center' },
  dayActive: { color: colors.primary, fontWeight: '700' },
});
// ── Slides ────────────────────────────────────────────────────────────────────
const SLIDES: { id: string; tag: string; title: string; desc: string; features: string[]; Illustration: FC }[] = [
  {
    id: '1',
    tag: 'TU UNIVERSIDAD PERSONAL',
    title: 'Aprende a tu ritmo',
    desc: 'Agora te guía desde cero hasta el dominio en cualquier materia con rutas diseñadas por expertos.',
    features: ['Rutas personalizadas', 'Progreso gamificado', 'Comunidad activa'],
    Illustration: BrainIllustration,
  },
  {
    id: '2',
    tag: 'EL CAMINO MÁS EFICIENTE',
    title: 'Roadmaps inteligentes',
    desc: 'Cada materia cuenta con un roadmap creado por profesionales. Sin contenido desactualizado.',
    features: ['Creados por expertos', 'Actualizados constantemente', 'Orden lógico garantizado'],
    Illustration: RoadmapIllustration,
  },
  {
    id: '3',
    tag: 'DATOS QUE TE MOTIVAN',
    title: 'Visualiza tu crecimiento',
    desc: 'Calendario de contribuciones, rachas de estudio y estadísticas que te mantienen enfocado.',
    features: ['Calendario', 'Rachas y logros', 'Análisis semanal'],
    Illustration: StatsIllustration,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const { token } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);

  // Add a sentinel slide so user can swipe past the last slide to navigate
  const slidesData = [
    ...SLIDES,
    {
      id: 'end',
      tag: '',
      title: '',
      desc: '',
      features: [],
      Illustration: (() => <View />) as FC,
    },
  ];

  useEffect(() => {
    // When user reaches the sentinel index, navigate to auth
    if (current === SLIDES.length) {
      (async () => {
        try {
          await AsyncStorage.setItem('seenOnboarding', 'true');
        } catch {}
        router.replace('/auth');
      })();
    }
  }, [current]);

  // On mount: if user already registered (has token) or already saw onboarding, skip it
  useEffect(() => {
    (async () => {
      try {
        const seen = await AsyncStorage.getItem('seenOnboarding');
        if (token || seen === 'true') {
          router.replace('/auth');
        }
      } catch {}
    })();
  }, []);

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('seenOnboarding', 'true');
    } catch {}
    router.replace('/auth');
  };

  const goNext = async () => {
    if (current < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: current + 1 });
      setCurrent(current + 1);
    } else {
      try {
        await AsyncStorage.setItem('seenOnboarding', 'true');
      } catch {}
      router.push('/auth');
    }
  };

  const goPrev = () => {
    if (current > 0) {
      flatListRef.current?.scrollToIndex({ index: current - 1 });
      setCurrent(current - 1);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slidesData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrent(index);
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Illustration */}
            <View style={styles.illustrationCard}>
              <item.Illustration />
            </View>
            {/* Tag */}
            <Text style={styles.tag}>{item.tag}</Text>
            {/* Title */}
            <Text style={styles.title}>{item.title}</Text>
            {/* Desc */}
            <Text style={styles.desc}>{item.desc}</Text>
            {/* Features */}
            <View style={styles.features}>
              {item.features.map((f: string, i: number) => (
                <View key={`${i}-${f}`} style={styles.featureRow}>
                  <View style={styles.checkCircle}>
                    <Text style={styles.check}>✓</Text>
                  </View>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={goPrev} style={styles.arrowBtn} disabled={current === 0}>
          <Text style={[styles.arrow, current === 0 && styles.arrowDisabled]}>‹</Text>
        </TouchableOpacity>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goNext} style={styles.nextBtn}>
            <Text style={styles.nextArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  slide: {
    width,
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  illustrationCard: {
    width: '100%',
    height: 200,
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.md },
  desc: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  features: { gap: spacing.sm },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  check: { color: '#fff', fontSize: 12, fontWeight: '700' },
  featureText: { ...typography.body, color: colors.text },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },
  arrowBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  arrow: { fontSize: 32, color: colors.textMuted },
  arrowDisabled: { color: colors.textSub },
  dots: { flexDirection: 'row', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, borderRadius: 4, backgroundColor: colors.primary },
  nextBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  nextArrow: { fontSize: 28, color: '#fff', lineHeight: 36 },
  skipText: {
  color: '#999',
  fontSize: 16,
  marginRight: 16,
},
});
