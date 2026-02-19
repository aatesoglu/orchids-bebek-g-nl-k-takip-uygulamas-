import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { Button, EmptyState, ScreenHeader, Card } from '@/components/ui';
import { panasService, formatDate, formatDateTime } from '@/services';
import {
  PANAS_QUESTIONS,
  PANAS_SCALE_LABELS,
  PanasScore,
  PanasAnswer,
  PanasRecord,
} from '@/types';

// ============================================================
// PANAS Score Selector (0-5 butonlar)
// ============================================================
const SCORES: PanasScore[] = [0, 1, 2, 3, 4, 5];

function ScoreButton({
  score,
  selected,
  onPress,
  color,
}: {
  score: PanasScore;
  selected: boolean;
  onPress: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: selected ? color : '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: selected ? 0 : 1,
        borderColor: '#E5E7EB',
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: selected ? '#FFFFFF' : '#6B7280',
        }}
      >
        {score}
      </Text>
    </TouchableOpacity>
  );
}

function QuestionCard({
  question,
  answer,
  onAnswerChange,
  index,
}: {
  question: (typeof PANAS_QUESTIONS)[0];
  answer: PanasScore;
  onAnswerChange: (score: PanasScore) => void;
  index: number;
}) {
  const isPositive = question.category === 'positive';
  const color = isPositive ? '#10B981' : '#EF4444';

  return (
    <Card style={{ marginBottom: 12 }} accent={color}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: `${color}20`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '800', color }}>{index + 1}</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#1F2937', flex: 1 }}>
          {question.label}
        </Text>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 8,
            backgroundColor: `${color}15`,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '700', color }}>
            {isPositive ? 'POZİTİF' : 'NEGATİF'}
          </Text>
        </View>
      </View>

      {/* Scale labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        {SCORES.map((score) => (
          <Text key={score} style={{ fontSize: 9, color: '#D1D5DB', width: 40, textAlign: 'center' }}>
            {PANAS_SCALE_LABELS[score]}
          </Text>
        ))}
      </View>

      {/* Score buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {SCORES.map((score) => (
          <ScoreButton
            key={score}
            score={score}
            selected={answer === score}
            onPress={() => onAnswerChange(score)}
            color={color}
          />
        ))}
      </View>

      {/* Selected value display */}
      <View style={{ marginTop: 8, alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 12, color, fontWeight: '600' }}>
          {PANAS_SCALE_LABELS[answer]}
        </Text>
      </View>
    </Card>
  );
}

// ============================================================
// PANAS Result Card
// ============================================================
function PanasResultCard({
  record,
  onDelete,
}: {
  record: PanasRecord;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card style={{ marginBottom: 12 }}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.9}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280' }}>
              PANAS TEST SONUCU
            </Text>
            <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 2 }}>
              {formatDateTime(record.createdAt)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Sil', 'Bu testi silmek istiyor musunuz?', [
                { text: 'İptal', style: 'cancel' },
                { text: 'Sil', onPress: onDelete, style: 'destructive' },
              ])
            }
            style={{ padding: 8 }}
          >
            <Text style={{ fontSize: 16 }}>🗑</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 12, gap: 10 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#F0FDF4',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#10B981' }}>
              {record.positiveScore}
            </Text>
            <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '600', marginTop: 2 }}>
              POZİTİF
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: '#FEF2F2',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#EF4444' }}>
              {record.negativeScore}
            </Text>
            <Text style={{ fontSize: 11, color: '#EF4444', fontWeight: '600', marginTop: 2 }}>
              NEGATİF
            </Text>
          </View>
        </View>

        <Text style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 8 }}>
          {expanded ? '▲ Daralt' : '▼ Detayları gör'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 }}>
          {record.answers.map((a) => {
            const q = PANAS_QUESTIONS.find((q) => q.id === a.questionId);
            if (!q) return null;
            const color = q.category === 'positive' ? '#10B981' : '#EF4444';
            return (
              <View
                key={a.questionId}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 13, color: '#1F2937', flex: 1 }}>{q.label}</Text>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 8,
                    backgroundColor: `${color}15`,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color }}>
                    {a.score} - {PANAS_SCALE_LABELS[a.score]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

// ============================================================
// Main Screen
// ============================================================
type ViewMode = 'form' | 'history';

export default function PanasScreen() {
  const { state, addPanas, deletePanas, showToast } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [answers, setAnswers] = useState<Record<string, PanasScore>>(
    Object.fromEntries(PANAS_QUESTIONS.map((q) => [q.id, 0]))
  );
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (questionId: string, score: PanasScore) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSave = async () => {
    const allAnswered = PANAS_QUESTIONS.every((q) => answers[q.id] !== undefined);
    if (!allAnswered) {
      showToast('Lütfen tüm soruları yanıtlayın', 'error');
      return;
    }

    setLoading(true);
    try {
      const answerList: PanasAnswer[] = PANAS_QUESTIONS.map((q) => ({
        questionId: q.id,
        score: answers[q.id],
      }));

      const positiveScore = PANAS_QUESTIONS.filter((q) => q.category === 'positive').reduce(
        (sum, q) => sum + (answers[q.id] || 0),
        0
      );
      const negativeScore = PANAS_QUESTIONS.filter((q) => q.category === 'negative').reduce(
        (sum, q) => sum + (answers[q.id] || 0),
        0
      );

      const record = await panasService.create({
        answers: answerList,
        positiveScore,
        negativeScore,
      });

      addPanas(record);
      showToast('PANAS testi kaydedildi! 📊', 'success');
      setViewMode('history');
      // Reset form
      setAnswers(Object.fromEntries(PANAS_QUESTIONS.map((q) => [q.id, 0])));
    } catch {
      showToast('Kayıt sırasında hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    deletePanas(id);
    showToast('Test kaydı silindi', 'info');
  };

  const completedCount = PANAS_QUESTIONS.filter((q) => answers[q.id] > 0).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScreenHeader
        title="PANAS Testi"
        subtitle="Pozitif ve Negatif Duygu Ölçeği"
        color="#10B981"
      />

      {/* Tab switcher */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => setViewMode('form')}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: viewMode === 'form' ? '#10B981' : '#F3F4F6',
            alignItems: 'center',
            marginRight: 6,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: viewMode === 'form' ? '#FFFFFF' : '#9CA3AF',
            }}
          >
            Testi Doldur
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode('history')}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: viewMode === 'history' ? '#10B981' : '#F3F4F6',
            alignItems: 'center',
            marginLeft: 6,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: viewMode === 'history' ? '#FFFFFF' : '#9CA3AF',
            }}
          >
            Geçmiş ({state.panasRecords.length})
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'form' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {/* Progress */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280' }}>İlerleme</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#10B981' }}>
                {completedCount}/{PANAS_QUESTIONS.length}
              </Text>
            </View>
            <View style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 3 }}>
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#10B981',
                  width: `${(completedCount / PANAS_QUESTIONS.length) * 100}%`,
                }}
              />
            </View>
          </View>

          {PANAS_QUESTIONS.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answers[question.id] ?? 0}
              onAnswerChange={(score) => handleAnswerChange(question.id, score)}
              index={index}
            />
          ))}

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <Button
              title="Sıfırla"
              onPress={() =>
                setAnswers(Object.fromEntries(PANAS_QUESTIONS.map((q) => [q.id, 0])))
              }
              variant="outline"
              style={{ flex: 1 }}
            />
            <Button
              title="Kaydet"
              onPress={handleSave}
              loading={loading}
              style={{ flex: 1, backgroundColor: '#10B981' }}
            />
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {state.panasRecords.length === 0 ? (
            <EmptyState
              icon="📊"
              title="Henüz test kaydı yok"
              subtitle="PANAS testini doldurup kaydedin."
              actionLabel="Testi Başlat"
              onAction={() => setViewMode('form')}
            />
          ) : (
            state.panasRecords.map((record) => (
              <PanasResultCard
                key={record.id}
                record={record}
                onDelete={() => handleDelete(record.id)}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
