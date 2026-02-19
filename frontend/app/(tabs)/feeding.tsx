import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useApp } from '@/context/AppContext';
import { FAB, Button, EmptyState, ScreenHeader, Card, BottomModal } from '@/components/ui';
import { feedingService, formatDateTime } from '@/services';
import { FeedingType, FeedingRecord, FEEDING_TYPE_CONFIG } from '@/types';

// ============================================================
// Feeding Type Chip
// ============================================================
function TypeChip({
  type,
  selected,
  onSelect,
}: {
  type: FeedingType;
  selected: boolean;
  onSelect: () => void;
}) {
  const config = FEEDING_TYPE_CONFIG[type];
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      style={{
        flex: 1,
        backgroundColor: selected ? config.color : `${config.color}15`,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: selected ? config.color : 'transparent',
        marginHorizontal: 3,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 4 }}>{config.icon}</Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: selected ? '#FFFFFF' : config.color,
        }}
      >
        {type}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// Number Input with +/-
// ============================================================
function NumberStepper({
  value,
  onChange,
  min,
  max,
  step,
  label,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit: string;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => onChange(Math.max(min, value - step))}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 20, color: '#374151', fontWeight: '600' }}>-</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#1F2937' }}>
            {value}
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{unit}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onChange(Math.min(max, value + step))}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 20, color: '#374151', fontWeight: '600' }}>+</Text>
        </TouchableOpacity>
      </View>
      {/* Progress bar */}
      <View style={{ height: 4, backgroundColor: '#F3F4F6', borderRadius: 2, marginTop: 8 }}>
        <View
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: '#8B5CF6',
            width: `${((value - min) / (max - min)) * 100}%`,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={{ fontSize: 10, color: '#D1D5DB' }}>{min}</Text>
        <Text style={{ fontSize: 10, color: '#D1D5DB' }}>{max}</Text>
      </View>
    </View>
  );
}

// ============================================================
// Feeding Card
// ============================================================
function FeedingCard({ record, onDelete }: { record: FeedingRecord; onDelete: () => void }) {
  const config = FEEDING_TYPE_CONFIG[record.type];
  return (
    <Card style={{ marginBottom: 12 }} accent={config.color}>
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
          <Text style={{ fontSize: 26 }}>{config.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
              {record.type}
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
          <Text style={{ fontSize: 14, color: config.color, fontWeight: '600', marginTop: 4 }}>
            {record.type === 'Meme' && `${record.durationMinutes} dakika`}
            {record.type === 'Biberon' && `${record.amountMl} mL`}
            {record.type === 'Mama' && `${record.amountGram} gram`}
          </Text>
          {record.note && (
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{record.note}</Text>
          )}
          <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 4 }}>
            {formatDateTime(record.createdAt)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// ============================================================
// Main Screen
// ============================================================
export default function FeedingScreen() {
  const { state, addFeeding, deleteFeeding, showToast } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedingType>('Biberon');
  const [duration, setDuration] = useState(10);
  const [amountMl, setAmountMl] = useState(80);
  const [amountGram, setAmountGram] = useState(50);
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const data: any = { type: selectedType, note: noteText.trim() || undefined };
      if (selectedType === 'Meme') data.durationMinutes = duration;
      if (selectedType === 'Biberon') data.amountMl = amountMl;
      if (selectedType === 'Mama') data.amountGram = amountGram;

      const record = await feedingService.create(data);
      addFeeding(record);
      showToast('Beslenme kaydedildi! 🍼', 'success');
      setModalVisible(false);
      resetForm();
    } catch {
      showToast('Kayıt sırasında hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType('Biberon');
    setDuration(10);
    setAmountMl(80);
    setAmountGram(50);
    setNoteText('');
  };

  const handleDelete = (id: string) => {
    deleteFeeding(id);
    showToast('Kayıt silindi', 'info');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScreenHeader
        title="Beslenme"
        subtitle={`${state.feedings.length} kayıt`}
        color="#8B5CF6"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {state.feedings.length === 0 ? (
          <EmptyState
            icon="🍼"
            title="Henüz beslenme kaydı yok"
            subtitle="Bebeğinizin beslenme bilgilerini kaydetmek için + butonuna basın."
            actionLabel="İlk Kaydı Ekle"
            onAction={() => setModalVisible(true)}
          />
        ) : (
          state.feedings.map((record) => (
            <FeedingCard
              key={record.id}
              record={record}
              onDelete={() => handleDelete(record.id)}
            />
          ))
        )}
      </ScrollView>

      <FAB onPress={() => setModalVisible(true)} color="#8B5CF6" />

      {/* Add Feeding Modal */}
      <BottomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        title="Beslenme Kaydı"
      >
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          {/* Type Selector */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 10 }}>
            Beslenme Türü
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            {(['Meme', 'Biberon', 'Mama'] as FeedingType[]).map((t) => (
              <TypeChip
                key={t}
                type={t}
                selected={selectedType === t}
                onSelect={() => setSelectedType(t)}
              />
            ))}
          </View>

          {/* Dynamic input */}
          {selectedType === 'Meme' && (
            <NumberStepper
              value={duration}
              onChange={setDuration}
              min={1}
              max={60}
              step={1}
              label="Süre"
              unit="dakika"
            />
          )}
          {selectedType === 'Biberon' && (
            <NumberStepper
              value={amountMl}
              onChange={setAmountMl}
              min={10}
              max={300}
              step={10}
              label="Miktar"
              unit="mL"
            />
          )}
          {selectedType === 'Mama' && (
            <NumberStepper
              value={amountGram}
              onChange={setAmountGram}
              min={10}
              max={200}
              step={5}
              label="Miktar"
              unit="gram"
            />
          )}

          <TextInput
            placeholder="Not ekle (isteğe bağlı)..."
            placeholderTextColor="#D1D5DB"
            value={noteText}
            onChangeText={setNoteText}
            style={{
              borderWidth: 1.5,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 12,
              fontSize: 14,
              color: '#1F2937',
              marginBottom: 16,
            }}
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button
              title="İptal"
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
              variant="outline"
              style={{ flex: 1 }}
            />
            <Button
              title="Kaydet"
              onPress={handleSave}
              loading={loading}
              variant="secondary"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </BottomModal>
    </SafeAreaView>
  );
}
