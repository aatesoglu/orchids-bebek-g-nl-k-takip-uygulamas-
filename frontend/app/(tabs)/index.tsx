import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui';
import { formatDateTime } from '@/services';
import {
  mockMoods,
  mockFeedings,
  mockDailyNotes,
  mockPanasRecords,
} from '@/services';
import { MOOD_CONFIG, FEEDING_TYPE_CONFIG } from '@/types';

function StatCard({
  emoji,
  count,
  label,
  color,
  onPress,
}: {
  emoji: string;
  count: number;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        flex: 1,
        backgroundColor: `${color}15`,
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
        marginHorizontal: 4,
      }}
    >
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text style={{ fontSize: 22, fontWeight: '800', color, marginTop: 4 }}>{count}</Text>
      <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '500', textAlign: 'center', marginTop: 2 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useApp();

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const todayMoods = state.moods.filter((m) => {
    const d = new Date(m.createdAt);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const todayFeedings = state.feedings.filter((f) => {
    const d = new Date(f.createdAt);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const lastMood = state.moods[0];
  const lastFeeding = state.feedings[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 24,
            backgroundColor: '#EC4899',
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>
            {today}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginTop: 4 }}>
            Hoş geldin! 👶
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            Bebeğinin bugünkü durumunu takip et
          </Text>

          {/* Günlük Özet */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 16,
              padding: 14,
              gap: 8,
            }}
          >
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                {todayMoods.length}
              </Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Duygu</Text>
            </View>
            <View
              style={{
                width: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
              }}
            />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                {todayFeedings.length}
              </Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Beslenme</Text>
            </View>
            <View
              style={{
                width: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
              }}
            />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                {state.dailyNotes.length}
              </Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Not</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Hızlı Erişim */}
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
            Hızlı Erişim
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 20, marginHorizontal: -4 }}>
            <StatCard
              emoji="💛"
              count={state.moods.length}
              label="Duygu"
              color="#F59E0B"
              onPress={() => router.push('/(tabs)/mood')}
            />
            <StatCard
              emoji="🍼"
              count={state.feedings.length}
              label="Beslenme"
              color="#8B5CF6"
              onPress={() => router.push('/(tabs)/feeding')}
            />
            <StatCard
              emoji="📊"
              count={state.panasRecords.length}
              label="PANAS"
              color="#10B981"
              onPress={() => router.push('/(tabs)/panas')}
            />
            <StatCard
              emoji="📝"
              count={state.dailyNotes.length}
              label="Not"
              color="#6366F1"
              onPress={() => router.push('/(tabs)/notes')}
            />
          </View>

          {/* Son Duygu */}
          {lastMood && (
            <Card
              style={{ marginBottom: 14 }}
              accent={MOOD_CONFIG[lastMood.moodLevel].color}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280' }}>
                  SON DUYGU DURUMU
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 36, marginRight: 12 }}>{lastMood.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
                    {lastMood.moodLabel}
                  </Text>
                  {lastMood.note && (
                    <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
                      {lastMood.note}
                    </Text>
                  )}
                  <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 4 }}>
                    {formatDateTime(lastMood.createdAt)}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Son Beslenme */}
          {lastFeeding && (
            <Card
              style={{ marginBottom: 14 }}
              accent={FEEDING_TYPE_CONFIG[lastFeeding.type].color}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280' }}>
                  SON BESLENME
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 36, marginRight: 12 }}>
                  {FEEDING_TYPE_CONFIG[lastFeeding.type].icon}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
                    {lastFeeding.type}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
                    {lastFeeding.type === 'Meme' && `${lastFeeding.durationMinutes} dakika`}
                    {lastFeeding.type === 'Biberon' && `${lastFeeding.amountMl} mL`}
                    {lastFeeding.type === 'Mama' && `${lastFeeding.amountGram} gram`}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 4 }}>
                    {formatDateTime(lastFeeding.createdAt)}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Modüller Grid */}
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12, marginTop: 8 }}>
            Modüller
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/mood')}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: '#FFF5F8',
                borderRadius: 16,
                padding: 16,
                alignItems: 'flex-start',
                borderWidth: 1.5,
                borderColor: '#FBCFE8',
              }}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>💛</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>
                Duygu Durumu
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                Nasıl hissediyorum?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/feeding')}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: '#F5F3FF',
                borderRadius: 16,
                padding: 16,
                alignItems: 'flex-start',
                borderWidth: 1.5,
                borderColor: '#DDD6FE',
              }}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>🍼</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>
                Beslenme
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                Anne sütü / Biberon
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/panas')}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: '#F0FDF4',
                borderRadius: 16,
                padding: 16,
                alignItems: 'flex-start',
                borderWidth: 1.5,
                borderColor: '#BBF7D0',
              }}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>📊</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>
                PANAS Testi
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                Duygu ölçek testi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/notes')}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: '#EEF2FF',
                borderRadius: 16,
                padding: 16,
                alignItems: 'flex-start',
                borderWidth: 1.5,
                borderColor: '#C7D2FE',
              }}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>📝</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>
                Günlük Notlar
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                Bebeğim için...
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
