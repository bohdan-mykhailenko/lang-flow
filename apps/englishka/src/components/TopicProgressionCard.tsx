import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
  Textarea,
  SimpleGrid,
  HStack,
} from '@chakra-ui/react';
import {
  Calendar,
  CheckCircle2,
  Lock,
  Play,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Edit3,
  Award,
  Send,
} from 'lucide-react';
import {
  progressionStorage,
  TopicProgression,
} from '@/services/progressionStorage';
import { useColorMode, useColorModeValue } from '@/components/ui/color-mode';

interface TopicProgressionCardProps {
  topicId: string;
  topicTitle: string;
}

interface RatingOption {
  level: number;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  bgDark: string;
  border: string;
  isSuga?: boolean;
}

const ratingOptions: RatingOption[] = [
  {
    level: 1,
    label: 'Важко',
    emoji: '😭',
    color: '#E53E3E',
    bg: '#FFF5F5',
    bgDark: 'rgba(229, 62, 62, 0.15)',
    border: '#FEB2B2',
  },
  {
    level: 2,
    label: 'Складно',
    emoji: '🥺',
    color: '#DD6B20',
    bg: '#FFFAF0',
    bgDark: 'rgba(221, 107, 32, 0.15)',
    border: '#FBD38D',
  },
  {
    level: 3,
    label: 'Нормально',
    emoji: '😐',
    color: '#D69E2E',
    bg: '#FFFFF0',
    bgDark: 'rgba(214, 158, 46, 0.15)',
    border: '#FAF089',
  },
  {
    level: 4,
    label: 'Добре!',
    emoji: '😊',
    color: '#38A169',
    bg: '#F0FFF4',
    bgDark: 'rgba(56, 161, 105, 0.15)',
    border: '#9AE6B4',
  },
  {
    level: 5,
    label: 'Suga! 🔥',
    emoji: '🏆',
    color: '#2563EB',
    bg: '#EFF6FF',
    bgDark: 'rgba(37, 99, 235, 0.15)',
    border: '#BFDBFE',
    isSuga: true,
  },
];

// --- ULTRA-FAST PRE-RENDERED HARDWARE-ACCELERATED BURST OVERLAY ---

interface BurstEvent {
  level: number;
  triggerId: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  scale: number;
  opacity: number;
  sprite: HTMLCanvasElement;
}

const SPRITE_SIZE = 56;

function createEmojiSprite(emoji: string): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = SPRITE_SIZE;
  c.height = SPRITE_SIZE;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.font =
      '40px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, SPRITE_SIZE / 2, SPRITE_SIZE / 2 + 2);
  }
  return c;
}

function createSugaSprite(img: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = SPRITE_SIZE;
  c.height = SPRITE_SIZE;
  const ctx = c.getContext('2d');
  if (ctx) {
    const r = SPRITE_SIZE / 2 - 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(SPRITE_SIZE / 2, SPRITE_SIZE / 2, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 2, 2, SPRITE_SIZE - 4, SPRITE_SIZE - 4);
    ctx.restore();
    // Vibrant blue border
    ctx.beginPath();
    ctx.arc(SPRITE_SIZE / 2, SPRITE_SIZE / 2, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  return c;
}

function FastBurstOverlay({
  burst,
  onDone,
}: {
  burst: BurstEvent | null;
  onDone: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sugaImgRef = useRef<HTMLImageElement | null>(null);
  const sugaSpriteRef = useRef<HTMLCanvasElement | null>(null);
  const emojiSpritesRef = useRef<Record<string, HTMLCanvasElement>>({});
  const animFrameRef = useRef<number | null>(null);

  // Pre-load Suga image and create offscreen sprite once
  useEffect(() => {
    const img = new Image();
    img.src = '/misc/Suga.jpg';
    img.onload = () => {
      sugaImgRef.current = img;
      sugaSpriteRef.current = createSugaSprite(img);
    };
  }, []);

  const getEmojiSprite = useCallback((emoji: string): HTMLCanvasElement => {
    if (!emojiSpritesRef.current[emoji]) {
      emojiSpritesRef.current[emoji] = createEmojiSprite(emoji);
    }
    return emojiSpritesRef.current[emoji]!;
  }, []);

  useEffect(() => {
    if (!burst) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;

    // Pick sprite pool according to grade
    const level = burst.level;
    let spritePool: HTMLCanvasElement[] = [];

    if (level === 5) {
      const sugaSprite =
        sugaSpriteRef.current ||
        (sugaImgRef.current?.complete
          ? createSugaSprite(sugaImgRef.current)
          : null);
      const celebrationEmojis = ['🔥', '🏆', '⭐', '💙', '🎉'].map((e) =>
        getEmojiSprite(e),
      );
      if (sugaSprite) {
        // 50% Suga circular avatar, 50% celebration icons
        spritePool = [sugaSprite, sugaSprite, ...celebrationEmojis];
      } else {
        spritePool = celebrationEmojis;
      }
    } else {
      // For all other grades: burst of that specific grade's emoji
      const emojiMap: Record<number, string> = {
        1: '😭',
        2: '🥺',
        3: '😐',
        4: '😊',
      };
      const targetEmoji = emojiMap[level] ?? '⭐';
      spritePool = [getEmojiSprite(targetEmoji)];
    }

    const particleCount = level === 5 ? 170 : 140;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Launch from lower-middle screen area with outward explosive fountain arc
      const originX = W * 0.5 + (Math.random() - 0.5) * (W * 0.45);
      const originY = H * 0.88;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.65;
      const speed = Math.random() * 20 + 11;
      const sprite =
        spritePool[Math.floor(Math.random() * spritePool.length)] ??
        spritePool[0]!;

      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        scale: Math.random() * 0.4 + 0.55,
        opacity: 1,
        sprite,
      });
    }

    const startTime = performance.now();
    const DURATION = 4200; // ms (longer, more delightful float)

    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed > DURATION) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        onDone();
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth fade-out in final 25% of duration
      const fadeProgress =
        elapsed > DURATION * 0.75
          ? (elapsed - DURATION * 0.75) / (DURATION * 0.25)
          : 0;
      const globalOpacity = Math.max(0, 1 - fadeProgress);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        // Floatier, graceful physics
        p.vy += 0.27; // lighter gravity for longer hanging arc
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.opacity = globalOpacity;

        // Blit pre-rendered sprite with GPU texture acceleration
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        const size = SPRITE_SIZE * p.scale;
        ctx.drawImage(p.sprite, -size / 2, -size / 2, size, size);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [burst, getEmojiSprite, onDone]);

  if (!burst) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}

// --- CUSTOM CHAKRA DATE PICKER COMPONENT (ALIGNED WITH THEME, NO NATIVE BROWSER POPUPS) ---

const UKR_MONTH_NAMES = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
];

const UKR_WEEKDAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

interface ChakraDatePickerProps {
  value: string | null;
  onChange: (val: string | null) => void;
  minDate?: string | null;
  disabled?: boolean;
  accentColor?: string;
  placeholder?: string;
  alignRight?: boolean;
}

function ChakraDatePicker({
  value,
  onChange,
  minDate,
  disabled = false,
  accentColor = '#2563EB',
  placeholder = 'Оберіть дату',
  alignRight = false,
}: ChakraDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  const bgCard = useColorModeValue('#FFFFFF', '#1E293B');
  const borderColor = useColorModeValue('#E2E8F0', '#334155');
  const headingColor = useColorModeValue('#1E293B', '#F8FAFC');
  const subtextColor = useColorModeValue('#64748B', '#94A3B8');
  const hoverBg = useColorModeValue('#F1F5F9', '#334155');
  const todayBg = useColorModeValue('#EFF6FF', '#172554');

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const formatDisplay = (val: string | null) => {
    if (!val) return placeholder;
    const parts = val.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return val;
  };

  const todayStr = new Date().toISOString().split('T')[0] ?? '';

  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  interface CalendarDay {
    year: number;
    month: number;
    day: number;
    dateStr: string;
    isCurrentMonth: boolean;
  }

  const calendarDays: CalendarDay[] = [];

  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      year: y,
      month: m,
      day: d,
      dateStr,
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      year: viewYear,
      month: viewMonth,
      day: d,
      dateStr,
      isCurrentMonth: true,
    });
  }

  const remainingSlots = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remainingSlots; d++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      year: y,
      month: m,
      day: d,
      dateStr,
      isCurrentMonth: false,
    });
  }

  return (
    <Box position="relative" ref={containerRef} display="inline-block">
      <HStack
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        bg={bgCard}
        px={2.5}
        py={1.5}
        borderRadius="lg"
        border="1px solid"
        borderColor={isOpen ? accentColor : borderColor}
        gap={1.5}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        opacity={disabled ? 0.45 : 1}
        transition="all 0.15s ease"
        boxShadow={isOpen ? `0 0 0 1px ${accentColor}` : 'none'}
        _hover={!disabled ? { borderColor: accentColor } : undefined}
      >
        <Calendar size={13} color={value ? accentColor : subtextColor} />
        <Text
          fontSize="12px"
          fontWeight="700"
          color={value ? headingColor : subtextColor}
        >
          {formatDisplay(value)}
        </Text>
      </HStack>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left={alignRight ? 'auto' : 0}
          right={alignRight ? 0 : 'auto'}
          zIndex={1000}
          w="260px"
          maxW="calc(100vw - 36px)"
          p={3}
          borderRadius="xl"
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          boxShadow="0 10px 30px rgba(0,0,0,0.3)"
        >
          <Flex justify="space-between" align="center" mb={2.5}>
            <Button
              size="xs"
              variant="ghost"
              onClick={prevMonth}
              p={1}
              minW="24px"
              h="24px"
              borderRadius="md"
              color={subtextColor}
              _hover={{ bg: hoverBg, color: headingColor }}
            >
              <ChevronLeft size={14} />
            </Button>
            <Text fontSize="12px" fontWeight="800" color={headingColor}>
              {UKR_MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <Button
              size="xs"
              variant="ghost"
              onClick={nextMonth}
              p={1}
              minW="24px"
              h="24px"
              borderRadius="md"
              color={subtextColor}
              _hover={{ bg: hoverBg, color: headingColor }}
            >
              <ChevronRight size={14} />
            </Button>
          </Flex>

          <SimpleGrid columns={7} gap={1} mb={1.5} textAlign="center">
            {UKR_WEEKDAY_NAMES.map((wd, i) => (
              <Text
                key={i}
                fontSize="10px"
                fontWeight="bold"
                color={subtextColor}
              >
                {wd}
              </Text>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={7} gap={1}>
            {calendarDays.map((cDay) => {
              const isSelected = value === cDay.dateStr;
              const isToday = todayStr === cDay.dateStr;
              const isDisabled = minDate ? cDay.dateStr < minDate : false;

              return (
                <Box
                  key={cDay.dateStr}
                  role="button"
                  tabIndex={isDisabled ? -1 : 0}
                  onClick={() => {
                    if (!isDisabled) {
                      onChange(cDay.dateStr);
                      setIsOpen(false);
                    }
                  }}
                  w="28px"
                  h="28px"
                  mx="auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  fontSize="11px"
                  fontWeight={isSelected ? '800' : '600'}
                  bg={
                    isSelected ? accentColor : isToday ? todayBg : 'transparent'
                  }
                  color={
                    isSelected
                      ? '#FFFFFF'
                      : isDisabled
                        ? subtextColor
                        : cDay.isCurrentMonth
                          ? headingColor
                          : subtextColor
                  }
                  opacity={isDisabled ? 0.25 : cDay.isCurrentMonth ? 1 : 0.4}
                  cursor={isDisabled ? 'not-allowed' : 'pointer'}
                  border={
                    isToday && !isSelected ? `1px solid ${accentColor}` : 'none'
                  }
                  transition="all 0.1s ease"
                  _hover={
                    !isDisabled && !isSelected
                      ? {
                          bg: hoverBg,
                          color: headingColor,
                        }
                      : undefined
                  }
                >
                  {cDay.day}
                </Box>
              );
            })}
          </SimpleGrid>

          <Flex
            justify="space-between"
            align="center"
            mt={2.5}
            pt={2}
            borderTop="1px solid"
            borderColor={borderColor}
          >
            <Button
              size="xs"
              variant="ghost"
              fontSize="10px"
              fontWeight="bold"
              color={accentColor}
              onClick={() => {
                onChange(todayStr);
                setIsOpen(false);
              }}
              _hover={{ bg: hoverBg }}
            >
              Сьогодні
            </Button>
            <Button
              size="xs"
              variant="ghost"
              fontSize="10px"
              fontWeight="bold"
              color={subtextColor}
              onClick={() => setIsOpen(false)}
              _hover={{ bg: hoverBg, color: headingColor }}
            >
              Закрити
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
}

// --- MAIN CARD COMPONENT ---

export function TopicProgressionCard({
  topicId,
  topicTitle,
}: TopicProgressionCardProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const bgCard = useColorModeValue('#FFFFFF', '#1E293B');
  const borderColor = useColorModeValue('#E2E8F0', '#334155');
  const innerBg = useColorModeValue('#F8FAFC', '#0F172A');
  const headingColor = useColorModeValue('#1E293B', '#F8FAFC');
  const subtextColor = useColorModeValue('#64748B', '#94A3B8');
  const blueAccent = '#2563EB';

  const getTodayString = (): string =>
    new Date().toISOString().split('T')[0] ?? '';

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [topicRating, setTopicRating] = useState<number>(3);
  const [confidenceRating, setConfidenceRating] = useState<number>(3);
  const [teacherRating, setTeacherRating] = useState<number>(3);
  // Dedicated teacher evaluation (1-12 system)
  const [teacherGrade, setTeacherGrade] = useState<number | null>(null);
  const [teacherNotes, setTeacherNotes] = useState<string>('');

  // Notes MUST be empty by default
  const [notes, setNotes] = useState<string>('');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSavedMode, setIsSavedMode] = useState<boolean>(false);
  const [wasEverSaved, setWasEverSaved] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmSource, setConfirmSource] = useState<'all' | 'teacher'>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [burstEvent, setBurstEvent] = useState<BurstEvent | null>(null);

  const getTeacherGradeLabel = (grade: number): string => {
    if (grade >= 10) return 'Високий рівень 🌟';
    if (grade >= 7) return 'Достатній рівень 👍';
    if (grade >= 4) return 'Середній рівень 📚';
    return 'Початковий рівень ✍️';
  };

  useEffect(() => {
    let active = true;
    const fetchProgression = async () => {
      try {
        const existing = await progressionStorage.get(topicId);
        if (existing && active) {
          setStartDate(existing.startDate ?? null);
          setEndDate(existing.endDate ?? null);
          setIsCompleted(Boolean(existing.isCompleted));
          setTopicRating(existing.topicRating || 3);
          setConfidenceRating(existing.confidenceRating || 3);
          setTeacherRating(existing.teacherRating || 3);
          setTeacherGrade(existing.teacherGrade ?? null);
          setTeacherNotes(existing.teacherNotes ?? '');

          if (existing.isCompleted) {
            setIsSavedMode(true);
            setWasEverSaved(true);
          }

          // Clean out any test string that was previously saved to Firestore
          const rawNotes = existing.notes || '';
          const isJunkNote =
            rawNotes.includes('Sync z proektom') ||
            rawNotes.includes('englishka-228') ||
            rawNotes.includes('uspishna');

          if (isJunkNote) {
            setNotes('');
            // Overwrite junk in Firestore so it's permanently cleaned
            progressionStorage
              .save({
                ...existing,
                notes: '',
                updatedAt: new Date().toISOString(),
              })
              .catch(() => {});
          } else {
            setNotes(rawNotes);
          }
        }
      } catch (e) {
        console.warn('Firestore fetch error:', e);
      }
    };
    fetchProgression();
    return () => {
      active = false;
    };
  }, [topicId]);

  const handleStartLearning = () => {
    setStartDate(getTodayString());
    setIsSavedMode(false);
    setErrorMsg(null);
  };

  const handleMarkAsLearned = () => {
    if (!startDate) {
      setErrorMsg('Спочатку встановіть дату початку вивчення!');
      return;
    }
    setEndDate(getTodayString());
    setIsCompleted(true);
    setIsSavedMode(false);
    setErrorMsg(null);
  };

  const handleTeacherSubmit = () => {
    if (!startDate) {
      setStartDate(getTodayString());
    }
    if (!isCompleted) {
      setIsCompleted(true);
      if (!endDate) setEndDate(getTodayString());
    }
    if (!teacherGrade) {
      setErrorMsg('Будь ласка, виберіть бал оцінки викладача (від 1 до 12)!');
      return;
    }
    setErrorMsg(null);
    setConfirmSource('teacher');
    setShowConfirmModal(true);
  };

  const handleSave = async () => {
    if (!startDate) {
      setErrorMsg('Неможливо зберегти: встановіть дату початку вивчення!');
      return;
    }
    if (!isCompleted) {
      setErrorMsg('Спочатку натисніть «Я вивчила!», щоб завершити тему.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    try {
      const data: TopicProgression = {
        topicId,
        topicTitle,
        startDate,
        endDate: endDate || getTodayString(),
        isCompleted: true,
        topicRating,
        confidenceRating,
        teacherRating,
        teacherGrade: teacherGrade ?? undefined,
        teacherNotes: teacherNotes.trim() || undefined,
        notes: notes.trim(),
        updatedAt: new Date().toISOString(),
      };
      await progressionStorage.save(data);
      setIsSaved(true);
      setIsSavedMode(true);
      setWasEverSaved(true);
      setShowConfirmModal(false);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (e: unknown) {
      setErrorMsg(
        e instanceof Error ? e.message : 'Помилка збереження у Firebase',
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger burst animation for ANY grade selected (1 to 5)
  const handleRatingChange = (setter: (val: number) => void, val: number) => {
    if (!isCompleted || !startDate) return;
    setter(val);
    if (!endDate) setEndDate(getTodayString());
    setBurstEvent({ level: val, triggerId: Date.now() });
  };

  const isSugaTier =
    isCompleted &&
    (topicRating === 5 || confidenceRating === 5 || teacherRating === 5);

  // Progressive gradient background combining all 3 graders from left to right (33% each)
  const getSaveButtonBg = (): string => {
    if (isSaving) return blueAccent;
    if (isSaved) return '#10B981';
    if (!isCompleted) return blueAccent;

    const ratingColorMap: Record<number, string> = {
      1: '#E53E3E',
      2: '#DD6B20',
      3: '#D97706',
      4: '#10B981',
      5: '#2563EB',
    };

    const c1 = ratingColorMap[topicRating] ?? '#2563EB';
    const c2 = ratingColorMap[confidenceRating] ?? '#2563EB';
    const c3 = ratingColorMap[teacherRating] ?? '#2563EB';

    // 1 solid color if all 3 grades are the same
    if (c1 === c2 && c2 === c3) {
      return c1;
    }

    // 2 or 3 colors gradient combining all 3 graders from left to right (~33% each)
    return `linear-gradient(90deg, ${c1} 0%, ${c1} 22%, ${c2} 42%, ${c2} 58%, ${c3} 78%, ${c3} 100%)`;
  };

  // Static button text (no dynamic text changing on grade selection)
  const getSaveButtonText = (): string => {
    if (isSaving) return 'Збереження...';
    if (isSaved) return '✓ Збережено!';
    return 'Зберегти прогрес';
  };

  const renderRatingBar = (
    title: string,
    currentValue: number,
    onChange: (val: number) => void,
  ) => {
    const currentOpt = ratingOptions[currentValue - 1] ?? ratingOptions[2]!;

    return (
      <Box
        mb={5}
        opacity={isCompleted ? 1 : 0.45}
        pointerEvents={isCompleted ? 'auto' : 'none'}
      >
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontSize="13px" fontWeight="700" color={headingColor}>
            {title}
          </Text>
          <Badge
            bg={isDark ? currentOpt.bgDark : currentOpt.bg}
            color={currentOpt.color}
            border="1px solid"
            borderColor={currentOpt.border}
            borderRadius="full"
            px={2.5}
            py={0.5}
            fontSize="11px"
            fontWeight="bold"
          >
            {currentOpt.emoji} {currentOpt.label}
          </Badge>
        </Flex>

        <SimpleGrid columns={5} gap={{ base: 1, sm: 1.5 }}>
          {ratingOptions.map((opt) => {
            const isSelected = currentValue === opt.level;
            return (
              <Box
                key={opt.level}
                as="button"
                onClick={() =>
                  !isSavedMode &&
                  isCompleted &&
                  handleRatingChange(onChange, opt.level)
                }
                p={{ base: 1.5, sm: 2 }}
                borderRadius="lg"
                bg={isSelected ? (isDark ? opt.bgDark : opt.bg) : bgCard}
                border="2px solid"
                borderColor={isSelected ? opt.color : borderColor}
                textAlign="center"
                cursor={!isCompleted || isSavedMode ? 'not-allowed' : 'pointer'}
                opacity={
                  !isCompleted ? 0.45 : isSavedMode && !isSelected ? 0.4 : 1
                }
                transition="all 0.15s ease"
                _hover={
                  isCompleted && !isSavedMode
                    ? {
                        borderColor: opt.color,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 10px ${opt.color}30`,
                      }
                    : undefined
                }
              >
                {opt.isSuga ? (
                  <Box display="flex" justifyContent="center" mb={0.5}>
                    <img
                      src="/misc/Suga.jpg"
                      alt="Suga"
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: isSelected
                          ? `2px solid ${opt.color}`
                          : '2px solid transparent',
                        display: 'block',
                      }}
                    />
                  </Box>
                ) : (
                  <Text
                    fontSize={{ base: '17px', sm: '20px' }}
                    lineHeight="1"
                    mb={0.5}
                  >
                    {opt.emoji}
                  </Text>
                )}
                <Text
                  fontSize={{ base: '8.5px', sm: '9px' }}
                  fontWeight="800"
                  color={isSelected ? opt.color : subtextColor}
                  letterSpacing="0.3px"
                >
                  {opt.level}/5
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    );
  };

  return (
    <>
      <FastBurstOverlay burst={burstEvent} onDone={() => setBurstEvent(null)} />

      <Box
        p={{ base: 3.5, sm: 5, md: 6 }}
        borderRadius="2xl"
        bg={bgCard}
        border="1px solid"
        borderColor={isSugaTier ? '#2563EB' : borderColor}
        boxShadow={
          isSugaTier
            ? '0 6px 24px rgba(37,99,235,0.12)'
            : '0 4px 16px rgba(0,0,0,0.04)'
        }
        mb={8}
        position="relative"
        overflow="hidden"
        transition="all 0.3s ease"
      >
        {/* Top accent bar */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="3px"
          bg={
            isSugaTier
              ? 'linear-gradient(90deg, #2563EB, #60A5FA, #10B981)'
              : isCompleted
                ? '#10B981'
                : startDate
                  ? '#2563EB'
                  : '#CBD5E0'
          }
        />

        {/* Header */}
        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center" gap={2}>
            <Heading size="sm" color={headingColor} fontWeight="800">
              📊 Оцінка уроку
            </Heading>
            {isCompleted && (
              <Badge
                bg={useColorModeValue('#ECFDF5', 'rgba(16,185,129,0.15)')}
                color={useColorModeValue('#065F46', '#34D399')}
                borderRadius="full"
                px={2}
                py={0.5}
                fontSize="10px"
                fontWeight="bold"
              >
                <CheckCircle2
                  size={10}
                  style={{ display: 'inline', marginRight: '3px' }}
                />
                Вивчено
              </Badge>
            )}
            {isSugaTier && (
              <Badge
                bg={useColorModeValue('#EFF6FF', 'rgba(37,99,235,0.2)')}
                color="#2563EB"
                borderRadius="full"
                px={2}
                py={0.5}
                fontSize="10px"
                fontWeight="bold"
              >
                🏆 Suga level
              </Badge>
            )}
          </Flex>
          <Text fontSize="xs" color={subtextColor} fontStyle="italic">
            «{topicTitle}»
          </Text>
        </Flex>

        {/* Saved state notification banner */}
        {isSavedMode && (
          <Flex
            p={3}
            mb={4}
            borderRadius="xl"
            bg={useColorModeValue(
              'rgba(16,185,129,0.08)',
              'rgba(16,185,129,0.15)',
            )}
            border="1px solid"
            borderColor="#10B981"
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={2}
          >
            <HStack gap={2}>
              <CheckCircle2 size={16} color="#10B981" />
              <Box>
                <Text
                  fontSize="12px"
                  fontWeight="800"
                  color={useColorModeValue('#065F46', '#34D399')}
                >
                  Прогрес зафіксовано в базі ✅
                </Text>
                <Text
                  fontSize="10px"
                  color={useColorModeValue('#047857', '#A7F3D0')}
                >
                  Усі оцінки збережено. Для внесення змін натисніть «Оновити».
                </Text>
              </Box>
            </HStack>
            <Button
              variant="outline"
              borderColor={blueAccent}
              color={blueAccent}
              _hover={{
                bg: useColorModeValue('#EFF6FF', '#1E293B'),
                borderColor: '#1D4ED8',
              }}
              size="xs"
              borderRadius="full"
              px={3.5}
              fontWeight="bold"
              onClick={() => setIsSavedMode(false)}
            >
              <Edit3 size={12} style={{ marginRight: '4px' }} />
              Оновити / Редагувати
            </Button>
          </Flex>
        )}

        {/* Date tracker */}
        <Box
          p={3.5}
          borderRadius="xl"
          bg={innerBg}
          border="1px solid"
          borderColor={borderColor}
          mb={4}
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'stretch', sm: 'center' }}
            gap={3}
          >
            <HStack gap={3} wrap="wrap">
              {/* Start date */}
              <Box>
                <Text
                  fontSize="10px"
                  fontWeight="bold"
                  color={subtextColor}
                  mb={1}
                >
                  📅 Початок
                </Text>
                {startDate ? (
                  <ChakraDatePicker
                    value={startDate}
                    disabled={isSavedMode}
                    accentColor={blueAccent}
                    onChange={(val) => {
                      setStartDate(val);
                      if (!val) {
                        setEndDate(null);
                        setIsCompleted(false);
                      }
                    }}
                  />
                ) : (
                  <Button
                    size="xs"
                    bg={blueAccent}
                    color="white"
                    _hover={{ opacity: 0.9 }}
                    borderRadius="lg"
                    px={3}
                    onClick={handleStartLearning}
                  >
                    <Play size={11} style={{ marginRight: '4px' }} />
                    Почати
                  </Button>
                )}
              </Box>

              {/* End date */}
              <Box>
                <Text
                  fontSize="10px"
                  fontWeight="bold"
                  color={subtextColor}
                  mb={1}
                >
                  🏁 Завершення
                </Text>
                {startDate ? (
                  <ChakraDatePicker
                    value={endDate}
                    minDate={startDate}
                    disabled={!isCompleted || isSavedMode}
                    accentColor="#10B981"
                    placeholder="Ще не завершено"
                    alignRight={true}
                    onChange={(val) => setEndDate(val)}
                  />
                ) : (
                  <HStack
                    px={2.5}
                    py={1}
                    borderRadius="lg"
                    bg={innerBg}
                    color={subtextColor}
                    fontSize="11px"
                    gap={1}
                  >
                    <Lock size={11} />
                    <Text>Потрібен старт</Text>
                  </HStack>
                )}
              </Box>
            </HStack>

            {/* Mark as learned button */}
            {!isCompleted ? (
              <Button
                size="sm"
                w={{ base: 'full', sm: 'auto' }}
                bg={
                  startDate
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : isDark
                      ? '#1E293B'
                      : '#F1F5F9'
                }
                color={startDate ? '#FFFFFF' : isDark ? '#64748B' : '#94A3B8'}
                border={
                  startDate
                    ? 'none'
                    : `1px solid ${isDark ? '#334155' : '#CBD5E1'}`
                }
                _hover={
                  startDate
                    ? {
                        bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px rgba(16,185,129,0.35)',
                      }
                    : undefined
                }
                cursor={startDate ? 'pointer' : 'not-allowed'}
                borderRadius="full"
                px={5}
                fontWeight="800"
                fontSize="xs"
                boxShadow={
                  startDate ? '0 3px 10px rgba(16,185,129,0.3)' : 'none'
                }
                transition="all 0.2s ease"
                onClick={handleMarkAsLearned}
              >
                <PartyPopper
                  size={14}
                  style={{ marginRight: '5px', opacity: startDate ? 1 : 0.5 }}
                />
                Я вивчила!
              </Button>
            ) : (
              <Badge
                bg={useColorModeValue('#ECFDF5', 'rgba(16,185,129,0.15)')}
                color={useColorModeValue('#065F46', '#34D399')}
                border="1px solid"
                borderColor={useColorModeValue(
                  '#A7F3D0',
                  'rgba(16,185,129,0.3)',
                )}
                borderRadius="full"
                px={3}
                py={1.5}
                fontSize="xs"
                fontWeight="bold"
              >
                🎉 Тему завершено!
              </Badge>
            )}
          </Flex>

          {/* Status hint */}
          {!startDate && (
            <Text
              fontSize="10px"
              color={useColorModeValue('#DC2626', '#FCA5A5')}
              mt={2.5}
              fontWeight="medium"
            >
              ⚠️ Натисніть «Почати», щоб зафіксувати старт уроку.
            </Text>
          )}
          {startDate && !isCompleted && (
            <Text
              fontSize="10px"
              color={useColorModeValue('#1D4ED8', '#93C5FD')}
              mt={2.5}
              fontWeight="medium"
            >
              💡 Тема в процесі — натисніть «Я вивчила!», щоб відкрити
              оцінювання.
            </Text>
          )}
        </Box>

        {/* Suga Achievement Banner */}
        {isSugaTier && (
          <Flex
            p={3}
            mb={4}
            borderRadius="xl"
            bg={useColorModeValue(
              'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            )}
            border="1px solid"
            borderColor={useColorModeValue('#BFDBFE', '#2563EB')}
            align="center"
            gap={3}
          >
            <img
              src="/misc/Suga.jpg"
              alt="Suga"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
                border: '2px solid #2563EB',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                display: 'block',
              }}
            />
            <Box flex="1">
              <Text
                fontSize="13px"
                fontWeight="800"
                color={useColorModeValue('#1D4ED8', '#60A5FA')}
              >
                Suga схвалює твій прогрес! 🏆
              </Text>
              <Text
                fontSize="11px"
                color={useColorModeValue('#2563EB', '#93C5FD')}
                mt={0.5}
              >
                Ти досягла найвищого рівня впевненості — це справді вражає!
              </Text>
            </Box>
            <Badge
              bg="#2563EB"
              color="white"
              px={2.5}
              py={1}
              borderRadius="full"
              fontSize="10px"
              fontWeight="bold"
            >
              5/5 ✦
            </Badge>
          </Flex>
        )}

        {/* Rating locked notice */}
        {!isCompleted && (
          <Flex
            align="center"
            gap={2}
            p={2.5}
            mb={4}
            borderRadius="lg"
            bg={useColorModeValue('#F1F5F9', '#0F172A')}
            border="1px solid"
            borderColor={borderColor}
            color={subtextColor}
            fontSize="11px"
            fontWeight="bold"
          >
            <Lock size={13} color="#2563EB" />
            Оцінювання відкриється після «Я вивчила!»
          </Flex>
        )}

        {/* Rating bars */}
        {renderRatingBar('1. Як тобі тема?', topicRating, setTopicRating)}
        {renderRatingBar(
          '2. Твоя впевненість?',
          confidenceRating,
          setConfidenceRating,
        )}
        {renderRatingBar(
          '3. Наскільки крутим був Богдан? 😄',
          teacherRating,
          setTeacherRating,
        )}

        {/* Dedicated Teacher Section in Red (Iconic Red Pen Aesthetic, 1–12 System) */}
        <Box
          p={{ base: 3.5, sm: 4 }}
          borderRadius="xl"
          bg={useColorModeValue('#FEF2F2', 'rgba(239, 68, 68, 0.08)')}
          border="1.5px solid"
          borderColor={useColorModeValue('#FECACA', '#7F1D1D')}
          mb={4}
          opacity={isCompleted ? 1 : 0.45}
          pointerEvents={isCompleted ? 'auto' : 'none'}
          boxShadow="0 2px 10px rgba(239, 68, 68, 0.05)"
        >
          <Flex
            justify="space-between"
            align="center"
            mb={2.5}
            wrap="wrap"
            gap={2}
          >
            <HStack gap={2}>
              <Box
                w="26px"
                h="26px"
                borderRadius="md"
                bg="#DC2626"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Award size={15} />
              </Box>
              <Box>
                <Text fontSize="13px" fontWeight="800" color="#DC2626">
                  Оцінка викладача (система 1–12)
                </Text>
                <Text
                  fontSize="10px"
                  color={useColorModeValue('#991B1B', '#FCA5A5')}
                >
                  Офіційна шкала успішності за урок (червона паста)
                </Text>
              </Box>
            </HStack>

            {teacherGrade ? (
              <Badge
                bg="#DC2626"
                color="#FFFFFF"
                borderRadius="full"
                px={3}
                py={0.8}
                fontSize="11px"
                fontWeight="800"
                boxShadow="0 2px 6px rgba(220, 38, 38, 0.3)"
              >
                {teacherGrade}/12 • {getTeacherGradeLabel(teacherGrade)}
              </Badge>
            ) : (
              <Badge
                bg={useColorModeValue('#FEE2E2', 'rgba(220, 38, 38, 0.2)')}
                color="#DC2626"
                borderRadius="full"
                px={2.5}
                py={0.5}
                fontSize="10px"
                fontWeight="bold"
              >
                Очікує оцінки викладача
              </Badge>
            )}
          </Flex>

          {/* 1–12 Scale Buttons */}
          <SimpleGrid
            columns={{ base: 6, sm: 12 }}
            gap={{ base: 1.5, sm: 1.5 }}
            mb={3}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => {
              const isSelected = teacherGrade === g;
              return (
                <Box
                  key={g}
                  role="button"
                  aria-disabled={isSavedMode}
                  onClick={() => {
                    if (!isSavedMode) {
                      if (!startDate) setStartDate(getTodayString());
                      if (!isCompleted) {
                        setIsCompleted(true);
                        if (!endDate) setEndDate(getTodayString());
                      }
                      setTeacherGrade(g);
                    }
                  }}
                  p={{ base: 1.5, sm: 2 }}
                  borderRadius="lg"
                  bg={isSelected ? '#DC2626' : isDark ? '#1E293B' : '#FFFFFF'}
                  color={
                    isSelected ? '#FFFFFF' : isDark ? '#FCA5A5' : '#991B1B'
                  }
                  border="2px solid"
                  borderColor={
                    isSelected ? '#DC2626' : isDark ? '#7F1D1D' : '#FECACA'
                  }
                  textAlign="center"
                  fontWeight="800"
                  fontSize={{ base: '12px', sm: '13px' }}
                  cursor={isSavedMode ? 'not-allowed' : 'pointer'}
                  opacity={isSavedMode && !isSelected ? 0.45 : 1}
                  boxShadow={
                    isSelected ? '0 0 12px rgba(220, 38, 38, 0.45)' : 'none'
                  }
                  transition="all 0.15s ease"
                  _hover={
                    !isSavedMode
                      ? {
                          borderColor: '#DC2626',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
                        }
                      : undefined
                  }
                >
                  {g}
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Teacher Notes Textarea in Red Section */}
          <Box mb={2}>
            <Text fontSize="11px" fontWeight="700" color="#DC2626" mb={1}>
              ✍️ Коментар та зауваження викладача:
            </Text>
            <Textarea
              value={teacherNotes}
              disabled={isSavedMode}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder="Коментар вчителя: прогрес, вимова, акценти для закріплення..."
              bg={useColorModeValue('#FFFFFF', '#0F172A')}
              borderColor={useColorModeValue('#FCA5A5', '#7F1D1D')}
              color={useColorModeValue('#7F1D1D', '#FCA5A5')}
              _focus={{
                borderColor: '#DC2626',
                boxShadow: '0 0 0 1px #DC2626',
              }}
              fontSize="12px"
              rows={2}
              borderRadius="lg"
            />
          </Box>

          {/* Teacher Submit Button / Status Bar */}
          {isSavedMode ? (
            <Flex
              justify="space-between"
              align="center"
              pt={2.5}
              borderTop="1px dashed"
              borderColor={isDark ? '#7F1D1D' : '#FECACA'}
              wrap="wrap"
              gap={2}
            >
              <HStack gap={1.5}>
                <CheckCircle2 size={14} color="#10B981" />
                <Text
                  fontSize="12px"
                  fontWeight="700"
                  color={useColorModeValue('#065F46', '#34D399')}
                >
                  Оцінку зафіксовано:{' '}
                  {teacherGrade ? `${teacherGrade}/12` : 'не виставлено'}
                </Text>
              </HStack>
              <Button
                variant="outline"
                size="xs"
                borderColor="#DC2626"
                color="#DC2626"
                _hover={{ bg: isDark ? 'rgba(220,38,38,0.15)' : '#FEF2F2' }}
                borderRadius="md"
                px={3}
                fontWeight="bold"
                onClick={() => setIsSavedMode(false)}
              >
                <Edit3 size={11} style={{ marginRight: '4px' }} />
                Редагувати оцінку
              </Button>
            </Flex>
          ) : (
            <Flex
              justify="space-between"
              align="center"
              pt={2.5}
              borderTop="1px dashed"
              borderColor={isDark ? '#7F1D1D' : '#FECACA'}
              wrap="wrap"
              gap={2}
            >
              <Text
                fontSize="11px"
                color={isDark ? '#FCA5A5' : '#991B1B'}
                fontWeight="600"
              >
                {teacherGrade
                  ? `✓ Обрано ${teacherGrade}/12 (${getTeacherGradeLabel(teacherGrade)})`
                  : '⚠️ Оберіть бал від 1 до 12'}
              </Text>
              <Button
                size="sm"
                bg="#DC2626"
                color="white"
                _hover={{ bg: '#B91C1C', transform: 'translateY(-1px)' }}
                _active={{ bg: '#991B1B' }}
                borderRadius="lg"
                px={4}
                py={2}
                fontWeight="800"
                fontSize="12px"
                boxShadow="0 2px 8px rgba(220, 38, 38, 0.35)"
                disabled={isSaving || isSavedMode || !teacherGrade}
                onClick={handleTeacherSubmit}
              >
                <Send size={13} style={{ marginRight: '6px' }} />
                Зберегти оцінку (Submit)
              </Button>
            </Flex>
          )}
        </Box>

        {/* Notes (empty by default) */}
        <Box
          mb={4}
          opacity={isCompleted ? 1 : 0.45}
          pointerEvents={isCompleted ? 'auto' : 'none'}
        >
          <Text fontSize="12px" fontWeight="700" color={headingColor} mb={1.5}>
            Нотатки учня (необов'язково):
          </Text>
          <Textarea
            value={notes}
            disabled={!isCompleted || isSavedMode}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Що запам'яталося? Що хочеться закріпити?"
            bg={innerBg}
            borderColor={borderColor}
            _hover={{ borderColor: blueAccent }}
            _focus={{ borderColor: blueAccent, bg: bgCard }}
            fontSize="12px"
            rows={2}
            borderRadius="xl"
          />
        </Box>

        {/* Save / Redo row */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          {isSavedMode ? (
            <Button
              variant="outline"
              borderColor={blueAccent}
              color={blueAccent}
              _hover={{
                bg: useColorModeValue('#EFF6FF', '#1E293B'),
                borderColor: '#1D4ED8',
              }}
              borderRadius="full"
              px={5}
              w={{ base: 'full', sm: 'auto' }}
              size="sm"
              fontWeight="bold"
              fontSize="xs"
              onClick={() => setIsSavedMode(false)}
            >
              <RotateCcw size={13} style={{ marginRight: '6px' }} />
              Оновити / Змінити оцінки
            </Button>
          ) : (
            <HStack gap={2} w={{ base: 'full', sm: 'auto' }} wrap="wrap">
              <Button
                onClick={() => {
                  if (!startDate) {
                    setErrorMsg('Спочатку встановіть дату початку вивчення!');
                    return;
                  }
                  if (!isCompleted) {
                    setErrorMsg(
                      'Спочатку натисніть «Я вивчила!», щоб завершити тему.',
                    );
                    return;
                  }
                  setConfirmSource('all');
                  setShowConfirmModal(true);
                }}
                loading={isSaving}
                disabled={isSaving || !isCompleted || !startDate}
                bg={getSaveButtonBg()}
                color="white"
                _hover={{ opacity: 0.9, transform: 'translateY(-1px)' }}
                borderRadius="full"
                px={5}
                w={{ base: 'full', sm: 'auto' }}
                size="sm"
                fontWeight="bold"
                fontSize="xs"
                boxShadow="0 3px 10px rgba(0,0,0,0.15)"
                transition="all 0.2s ease"
              >
                {getSaveButtonText()}
              </Button>

              {wasEverSaved && (
                <Button
                  variant="ghost"
                  size="sm"
                  fontSize="xs"
                  color={subtextColor}
                  borderRadius="full"
                  onClick={() => setIsSavedMode(true)}
                >
                  Скасувати
                </Button>
              )}
            </HStack>
          )}

          {isSaved && (
            <Flex
              align="center"
              gap={1.5}
              color="#10B981"
              fontSize="xs"
              fontWeight="bold"
            >
              <CheckCircle2 size={15} />
              Синхронізовано!
            </Flex>
          )}

          {errorMsg && (
            <Text color="#E53E3E" fontSize="10px" fontWeight="bold">
              {errorMsg}
            </Text>
          )}
        </Flex>
      </Box>

      {/* Confirmation Modal before saving progress */}
      {showConfirmModal && (
        <Box
          position="fixed"
          inset={0}
          zIndex={9999}
          bg="rgba(0, 0, 0, 0.65)"
          backdropFilter="blur(4px)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box
            w="full"
            maxW="460px"
            bg={bgCard}
            border="1px solid"
            borderColor={confirmSource === 'teacher' ? '#DC2626' : borderColor}
            borderRadius="2xl"
            p={{ base: 5, sm: 6 }}
            boxShadow="0 20px 50px rgba(0,0,0,0.35)"
            position="relative"
          >
            <Flex align="center" gap={3} mb={3}>
              <Box
                w="40px"
                h="40px"
                borderRadius="xl"
                bg={confirmSource === 'teacher' ? '#DC2626' : blueAccent}
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                {confirmSource === 'teacher' ? (
                  <Award size={22} />
                ) : (
                  <CheckCircle2 size={22} />
                )}
              </Box>
              <Box>
                <Heading size="sm" color={headingColor} fontWeight="800">
                  {confirmSource === 'teacher'
                    ? 'Підтвердити оцінку викладача (Submit)?'
                    : wasEverSaved
                      ? 'Підтвердити оновлення прогресу?'
                      : 'Підтвердити збереження?'}
                </Heading>
                <Text fontSize="xs" color={subtextColor}>
                  Урок: «{topicTitle}»
                </Text>
              </Box>
            </Flex>

            <Box
              bg={innerBg}
              p={3.5}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
              mb={4}
              fontSize="xs"
            >
              <Flex
                justify="space-between"
                py={1.5}
                borderBottom="1px dashed"
                borderColor={borderColor}
              >
                <Text color={subtextColor}>📅 Період вивчення:</Text>
                <Text fontWeight="bold" color={headingColor}>
                  {startDate} — {endDate || getTodayString()}
                </Text>
              </Flex>
              <Flex
                justify="space-between"
                py={1.5}
                borderBottom="1px dashed"
                borderColor={borderColor}
              >
                <Text color={subtextColor}>⭐️ Оцінки учня:</Text>
                <Text fontWeight="bold" color={headingColor}>
                  Тема: {topicRating}/5 • Впевненість: {confidenceRating}/5 •
                  Викладач: {teacherRating}/5
                </Text>
              </Flex>
              <Flex
                justify="space-between"
                py={1.5}
                borderBottom="1px dashed"
                borderColor={borderColor}
              >
                <Text color="#DC2626" fontWeight="bold">
                  👨‍🏫 Оцінка викладача (1–12):
                </Text>
                <Text fontWeight="bold" color="#DC2626">
                  {teacherGrade
                    ? `${teacherGrade}/12 (${getTeacherGradeLabel(teacherGrade)})`
                    : 'Не виставлено'}
                </Text>
              </Flex>
              {notes && (
                <Box
                  pt={1.5}
                  borderBottom="1px dashed"
                  borderColor={borderColor}
                  pb={1}
                >
                  <Text color={subtextColor} mb={0.5}>
                    📝 Нотатки учня:
                  </Text>
                  <Text fontStyle="italic" color={headingColor} lineClamp={2}>
                    «{notes}»
                  </Text>
                </Box>
              )}
              {teacherNotes && (
                <Box pt={1.5}>
                  <Text color="#DC2626" fontWeight="bold" mb={0.5}>
                    ✍️ Коментар викладача:
                  </Text>
                  <Text
                    fontStyle="italic"
                    color={useColorModeValue('#991B1B', '#FCA5A5')}
                    lineClamp={2}
                  >
                    «{teacherNotes}»
                  </Text>
                </Box>
              )}
            </Box>

            <Text fontSize="11px" color={subtextColor} mb={5}>
              Після збереження дані зафіксуються в базі Firestore. Змінити їх
              можна буде за потреби через кнопку «Оновити».
            </Text>

            <Flex justify="flex-end" gap={2.5}>
              <Button
                variant="ghost"
                size="sm"
                borderRadius="full"
                px={4}
                onClick={() => setShowConfirmModal(false)}
              >
                Скасувати
              </Button>
              <Button
                bg={confirmSource === 'teacher' ? '#DC2626' : blueAccent}
                color="white"
                _hover={{ opacity: 0.9 }}
                size="sm"
                borderRadius="full"
                px={5}
                fontWeight="bold"
                loading={isSaving}
                onClick={handleSave}
              >
                {confirmSource === 'teacher'
                  ? 'Підтвердити та надіслати'
                  : 'Підтвердити та зберегти'}
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
}
