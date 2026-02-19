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
import { FAB, BottomModal, Button, EmptyState, ScreenHeader, Card } from '@/components/ui';
import { noteService, formatDateTime } from '@/services';
import { DailyNote } from '@/types';

// ============================================================
// Note Card
// ============================================================
function NoteCard({
  note,
  onDelete,
  onEdit,
}: {
  note: DailyNote;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <Card style={{ marginBottom: 12 }} accent="#6366F1">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#EEF2FF',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 20 }}>📝</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 11, color: '#D1D5DB' }}>
              {formatDateTime(note.createdAt)}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={onEdit} style={{ padding: 4 }}>
                <Text style={{ fontSize: 15 }}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Sil', 'Bu notu silmek istiyor musunuz?', [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'Sil', onPress: onDelete, style: 'destructive' },
                  ])
                }
                style={{ padding: 4 }}
              >
                <Text style={{ fontSize: 15 }}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: '#374151',
              lineHeight: 20,
            }}
          >
            {note.text}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// ============================================================
// Add/Edit Note Modal
// ============================================================
function NoteModal({
  visible,
  onClose,
  onSave,
  initialText,
  loading,
  isEdit,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  initialText?: string;
  loading: boolean;
  isEdit?: boolean;
}) {
  const [text, setText] = useState(initialText ?? '');

  React.useEffect(() => {
    setText(initialText ?? '');
  }, [initialText, visible]);

  const handleSave = () => {
    if (!text.trim()) {
      return;
    }
    onSave(text.trim());
  };

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      title={isEdit ? 'Notu Düzenle' : 'Bebeğim İçin...'}
    >
      <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 12, lineHeight: 18 }}>
          Bugün bebeğinle geçirdiğin anları, özel notları buraya yaz.
        </Text>
        <TextInput
          placeholder="Yazınız..."
          placeholderTextColor="#D1D5DB"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={6}
          style={{
            borderWidth: 1.5,
            borderColor: '#E5E7EB',
            borderRadius: 12,
            padding: 14,
            fontSize: 14,
            color: '#1F2937',
            minHeight: 120,
            textAlignVertical: 'top',
            lineHeight: 20,
            backgroundColor: '#FAFAFA',
          }}
          autoFocus
        />
        <Text style={{ fontSize: 11, color: '#D1D5DB', textAlign: 'right', marginTop: 4 }}>
          {text.length} karakter
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Button
            title="İptal"
            onPress={onClose}
            variant="outline"
            style={{ flex: 1 }}
          />
          <Button
            title={isEdit ? 'Güncelle' : 'Kaydet'}
            onPress={handleSave}
            loading={loading}
            disabled={!text.trim()}
            style={{ flex: 1, backgroundColor: '#6366F1' }}
          />
        </View>
      </View>
    </BottomModal>
  );
}

// ============================================================
// Main Screen
// ============================================================
export default function NotesScreen() {
  const { state, addNote, updateNote, deleteNote, showToast } = useApp();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<DailyNote | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (text: string) => {
    setLoading(true);
    try {
      const note = await noteService.create(text);
      addNote(note);
      showToast('Not kaydedildi! 📝', 'success');
      setAddModalVisible(false);
    } catch {
      showToast('Kayıt sırasında hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (text: string) => {
    if (!editingNote) return;
    setLoading(true);
    try {
      const updated = await noteService.update(editingNote.id, text);
      updateNote({ ...editingNote, text });
      showToast('Not güncellendi! ✅', 'success');
      setEditModalVisible(false);
      setEditingNote(null);
    } catch {
      showToast('Güncelleme sırasında hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    showToast('Not silindi', 'info');
  };

  const openEdit = (note: DailyNote) => {
    setEditingNote(note);
    setEditModalVisible(true);
  };

  // Group notes by date
  const grouped = state.dailyNotes.reduce<Record<string, DailyNote[]>>((acc, note) => {
    const date = new Date(note.createdAt).toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(note);
    return acc;
  }, {});

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScreenHeader
        title="Bebeğim İçin"
        subtitle={`${state.dailyNotes.length} not`}
        color="#6366F1"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {state.dailyNotes.length === 0 ? (
          <EmptyState
            icon="📝"
            title="Henüz not yok"
            subtitle="Bebeğinizle ilgili özel anları ve notları kaydetmek için + butonuna basın."
            actionLabel="İlk Notu Ekle"
            onAction={() => setAddModalVisible(true)}
          />
        ) : (
          Object.entries(grouped).map(([date, notes]) => (
            <View key={date}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                  marginTop: 4,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: '#E5E7EB',
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#9CA3AF',
                    marginHorizontal: 10,
                  }}
                >
                  {date}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: '#E5E7EB',
                  }}
                />
              </View>
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={() => handleDelete(note.id)}
                  onEdit={() => openEdit(note)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <FAB onPress={() => setAddModalVisible(true)} color="#6366F1" />

      {/* Add Modal */}
      <NoteModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAdd}
        loading={loading}
      />

      {/* Edit Modal */}
      <NoteModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingNote(null);
        }}
        onSave={handleEdit}
        initialText={editingNote?.text}
        loading={loading}
        isEdit
      />
    </SafeAreaView>
  );
}
