import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import {
  FAB,
  BottomModal,
  Button,
  EmptyState,
  ScreenHeader,
  Card,
} from '@/components/ui';
import { moodService, formatDateTime } from '@/services';
import {
  MoodLevel,
  MoodRecord,
  MOOD_CONFIG,
} from '@/types';

// ============================================================
// Mood Emoji Slider Component
// ============================================================
const MOOD_LEVELS: MoodLevel[] = [1, 2, 3, 4, 5];

function MoodSelector({
  value,
  onChange,
}: {
  value: MoodLevel;
  onChange: (level: MoodLevel) => void;
}) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
        {MOOD_LEVELS.map((level) => {
          const config = MOOD_CONFIG[level];
          const isSelected = value === level;
          return (
            <TouchableOpacity
              key={level}
              onPress={() => onChange(level)}
              activeOpacity={0.8}
              style={{
                alignItems: 'center',
                padding: 8,
                borderRadius: 12,
                backgroundColor: isSelected ? `${config.color}20` : 'transparent',
                borderWidth: isSelected ? 2 : 0,
                borderColor: isSelected ? config.color : 'transparent',
              }}
            >
              <Text style={{ fontSize: 32 }}>{config.emoji}</Text>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: isSelected ? '700' : '400',
                  color: isSelected ? config.color : '#9CA3AF',
                  marginTop: 4,
                  textAlign: 'center',
                }}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Seçili mood göstergesi */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          backgroundColor: `${MOOD_CONFIG[value].color}15`,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 24, marginRight: 8 }}>{MOOD_CONFIG[value].emoji}</Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: MOOD_CONFIG[value].color,
          }}
        >
          {MOOD_CONFIG[value].label}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// Mood Card Component
// ============================================================
function MoodCard({ mood, onDelete }: { mood: MoodRecord; onDelete: () => void }) {
  const config = MOOD_CONFIG[mood.moodLevel];
  return (
    <Card
      style={{ marginBottom: 12 }}
      accent={config.color}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: `${config.color}15`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 28 }}>{mood.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
              {mood.moodLabel}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Sil', 'Bu kaydı silmek istiyor musunuz?', [
                  { text: 'İptal', style: 'cancel' },
                  { text: 'Sil', onPress: onDelete, style: 'destructive' },
                ])
              }
              style={{ padding: 4 }}
            >
              <Text style={{ fontSize: 16 }}>🗑</Text>
            </TouchableOpacity>
          </View>
          {mood.note && (
            <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 18 }}>
              {mood.note}
            </Text>
          )}
          <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 6 }}>
            {formatDateTime(mood.createdAt)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// ============================================================
// Main Screen
// ============================================================
export default function MoodScreen() {
  const { state, addMood, deleteMood, showToast } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodLevel>(3);
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const config = MOOD_CONFIG[selectedMood];
      const record = await moodService.create({
        moodLevel: selectedMood,
        moodLabel: config.label,
        emoji: config.emoji,
        note: noteText.trim() || undefined,
      });
      addMood(record);
      showToast('Duygu durumu kaydedildi! 💛', 'success');
      setModalVisible(false);
      setNoteText('');
      setSelectedMood(3);
    } catch {
      showToast('Kayıt sırasında hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteMood(id);
    showToast('Kayıt silindi', 'info');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScreenHeader
        title="Nasıl Hissediyorum?"
        subtitle={`${state.moods.length} kayıt`}
        color="#F59E0B"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {state.moods.length === 0 ? (
          <EmptyState
            icon="💛"
            title="Henüz kayıt yok"
            subtitle="Bugün nasıl hissettiğini kaydetmek için + butonuna bas."
            actionLabel="İlk Kaydı Ekle"
            onAction={() => setModalVisible(true)}
          />
        ) : (
          state.moods.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              onDelete={() => handleDelete(mood.id)}
            />
          ))
        )}
      </ScrollView>

      <FAB onPress={() => setModalVisible(true)} color="#F59E0B" />

      {/* Add Mood Modal */}
      <BottomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setNoteText('');
        }}
        title="Nasıl Hissediyorum?"
      >
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <MoodSelector value={selectedMood} onChange={setSelectedMood} />

          <TextInput
            placeholder="Not ekle (isteğe bağlı)..."
            placeholderTextColor="#D1D5DB"
            value={noteText}
            onChangeText={setNoteText}
            multiline
            numberOfLines={3}
            style={{
              borderWidth: 1.5,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 12,
              fontSize: 14,
              color: '#1F2937',
              marginTop: 16,
              minHeight: 80,
              textAlignVertical: 'top',
            }}
          />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <Button
              title="İptal"
              onPress={() => {
                setModalVisible(false);
                setNoteText('');
              }}
              variant="outline"
              style={{ flex: 1 }}
            />
            <Button
              title="Kaydet"
              onPress={handleSave}
              loading={loading}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </BottomModal>
    </SafeAreaView>
  );
}
