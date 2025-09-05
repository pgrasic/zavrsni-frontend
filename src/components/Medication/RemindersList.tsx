import React, { useEffect, useState } from 'react';
import { getUserReminders, deleteKorisnikLijek, updateKorisnikLijek, getAllMeds } from '../../utils/api';
import { KorisnikLijekRead } from '../../types/medication';
import { Box, Button, Stack, Input, Select, Text, Heading, HStack, VStack, Spinner, useToast } from '@chakra-ui/react';

type EditState = {
  [lijek_id: number]: Partial<KorisnikLijekRead>;
};

const RemindersList: React.FC = () => {
  const [items, setItems] = useState<KorisnikLijekRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState>({});
  const [meds, setMeds] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [rem, allMeds] = await Promise.all([getUserReminders(), getAllMeds()]);
        setItems(rem || []);
        setMeds(allMeds || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load reminders');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const startEdit = (lijek_id: number) => {
    const item = items.find(i => i.lijek_id === lijek_id);
    if (!item) return;
    setEditing({ ...editing, [lijek_id]: { ...item } });
  };

  const cancelEdit = (lijek_id: number) => {
    const n = { ...editing };
    delete n[lijek_id];
    setEditing(n);
  };

  const validate = (p: Partial<KorisnikLijekRead>) => {
    const errors: Record<string,string> = {};
    if (!p.pocetno_vrijeme) errors.pocetno_vrijeme = 'Start time is required';
    if (!p.razmak_sati || Number(p.razmak_sati) <= 0) errors.razmak_sati = 'Interval must be > 0';
    if (!p.kolicina || Number(p.kolicina) <= 0) errors.kolicina = 'Quantity must be > 0';
    return errors;
  };

  const saveEdit = async (lijek_id: number) => {
    const payload = editing[lijek_id];
    if (!payload) return;
    const errors = validate(payload);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors).join('; '));
      toast({ title: 'Validation error', description: Object.values(errors).join('; '), status: 'error' });
      return;
    }
    try {
      // ensure pocetno_vrijeme is full ISO (add :00 seconds if missing)
      let p = { ...payload } as any;
      if (p.pocetno_vrijeme && p.pocetno_vrijeme.length === 16) {
        p.pocetno_vrijeme = p.pocetno_vrijeme + ':00';
      }
      await updateKorisnikLijek(lijek_id, p);
      // refresh
      const rem = await getUserReminders();
      setItems(rem || []);
      cancelEdit(lijek_id);
      setError(null);
      toast({ title: 'Saved', status: 'success' });
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
      toast({ title: 'Save failed', description: e?.message || 'Failed to save', status: 'error' });
    }
  };

  const remove = async (lijek_id: number) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    try {
      await deleteKorisnikLijek(lijek_id);
      setItems(items.filter(i => i.lijek_id !== lijek_id));
      toast({ title: 'Deleted', status: 'success' });
    } catch (e: any) {
      setError(e?.message || 'Failed to delete');
      toast({ title: 'Delete failed', description: e?.message || 'Failed to delete', status: 'error' });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Box role="alert">{error}</Box>;

  return (
    <Box aria-label="Your reminders">
      <Heading size="md" mb={4}>Moji podsjetnici</Heading>
      {items.length === 0 && <Text>Nemate spremljenih podsjetnika.</Text>}
      <VStack spacing={4} align="stretch">
        {items.map(item => {
          const isEditing = !!editing[item.lijek_id];
          const edit = editing[item.lijek_id] || {};
          const med = meds.find(m => m.id === item.lijek_id);
          return (
            <Box key={item.lijek_id} borderWidth="1px" p={3} borderRadius="md">
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="bold">{med ? med.naziv : `Medicine #${item.lijek_id}`}</Text>
                  <Text fontSize="sm">Start: {new Date(item.pocetno_vrijeme).toLocaleString()}</Text>
                  <Text fontSize="sm">Every: {item.razmak_sati} hours</Text>
                  <Text fontSize="sm">Quantity: {item.kolicina}</Text>
                </Box>
                <Box>
          {!isEditing && (
                    <HStack>
            <Button size="sm" onClick={() => startEdit(item.lijek_id)}>Uredi</Button>
            <Button size="sm" colorScheme="red" onClick={() => remove(item.lijek_id)}>Obriši</Button>
                    </HStack>
                  )}
                </Box>
              </HStack>
                  {isEditing && (
                <Stack direction={{ base: 'column', md: 'row' }} spacing={3} mt={3}>
                  <Input aria-label="start-time" type="datetime-local" value={edit.pocetno_vrijeme ? edit.pocetno_vrijeme.slice(0,16) : ''} onChange={e => setEditing({ ...editing, [item.lijek_id]: { ...edit, pocetno_vrijeme: e.target.value } })} />
                  <Input aria-label="hours" type="number" placeholder="Hours" value={edit.razmak_sati ?? ''} onChange={e => setEditing({ ...editing, [item.lijek_id]: { ...edit, razmak_sati: Number(e.target.value) } })} />
                  <Input aria-label="quantity" type="number" placeholder="Quantity" value={edit.kolicina ?? ''} onChange={e => setEditing({ ...editing, [item.lijek_id]: { ...edit, kolicina: Number(e.target.value) } })} />
                  <Button colorScheme="green" onClick={() => saveEdit(item.lijek_id)}>Spremi</Button>
                  <Button onClick={() => cancelEdit(item.lijek_id)}>Odustani</Button>
                </Stack>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default RemindersList;
