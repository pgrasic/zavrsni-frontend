import React, { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Textarea, Button, useToast } from '@chakra-ui/react';
import { createMedicationRequest } from '../../utils/api';

const MedicationRequestForm: React.FC = () => {
  const [medicine, setMedicine] = useState('');
  const [active_substance, setActiveSubstance] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submit = async () => {
    if (!medicine.trim()) {
      toast({ title: 'Please enter medicine name', status: 'error' });
      return;
    }
    try {
      setLoading(true);
      await createMedicationRequest({ naziv: medicine.trim(), DjelatnaTvar: active_substance.trim(), nestasica: false, accepted: false });
      toast({ title: 'Request submitted', status: 'success' });
      setMedicine('');
      setActiveSubstance('');
    } catch (e: any) {
      toast({ title: 'Submit failed', description: e?.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="white">
      <Heading as="h3" size="md" mb={3}>Zahtjev za lijek</Heading>
      <FormControl mb={3}>
        <FormLabel>Naziv lijeka</FormLabel>
        <Input value={medicine} onChange={(e) => setMedicine(e.target.value)} />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Djelatna tvar</FormLabel>
        <Input value={active_substance} onChange={(e) => setActiveSubstance(e.target.value)} />
      </FormControl>
      <Button colorScheme="green" onClick={submit} isLoading={loading}>Pošalji zahtjev</Button>
    </Box>
  );
};

export default MedicationRequestForm;
