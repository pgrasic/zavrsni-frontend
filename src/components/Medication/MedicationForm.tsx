import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
  Text,
  Spinner,
  List,
  ListItem,
  HStack,
  
} from "@chakra-ui/react";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { getAllMeds, createKorisnikLijek, getUserIdFromToken } from "../../utils/api";
import { m } from "framer-motion";
function formatCroatianDateWith24Hour(isoLike: Date | string | null){
  if (!isoLike) return '';
  const d = isoLike instanceof Date ? isoLike : new Date(isoLike);
  const parts = new Intl.DateTimeFormat('hr-HR', {
          timeZone: 'Europe/Zagreb',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).formatToParts(d);
        const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

        const dd = get('day');
        const MM = get('month');
        const YYYY = get('year');
        const HH = get('hour');
        const mm = get('minute');
  return `${dd}-${MM}-${YYYY} ${HH}:${mm}`;
      };
const MedicationForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [meds, setMeds] = useState<Array<any>>([]);
  const [medId, setMedId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  // store as a Date for flatpickr and reliable 24-hour handling
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [intervalHours, setIntervalHours] = useState<number>(24);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMeds, setLoadingMeds] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

  useEffect(() => {
    setLoadingMeds(true);
    getAllMeds()
      .then((data) => {
        setMeds(data || []);
        if (data && data.length > 0) setMedId(Number(data[0].id));
      })
      .catch(() => setError("Ne mogu učitati lijekove"))
      .finally(() => setLoadingMeds(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!medId) {
      setError("Odaberite lijek");
      return;
    }
    setLoading(true);
    try {
      const korisnik_id = getUserIdFromToken();
      if (!korisnik_id) throw new Error("Niste prijavljeni");
      

      const entry = {
        korisnik_id: Number(korisnik_id),
        lijek_id: medId,
        pocetno_vrijeme: formatCroatianDateWith24Hour(startTime),
        razmak_sati: Number(intervalHours),
        kolicina: Number(quantity),
      };
      await createKorisnikLijek(entry);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  if (loadingMeds) return <Spinner />;

  const filteredMeds = meds.filter((m: any) => m.naziv.toLowerCase().includes(search.toLowerCase()));

  
  return (
    <Box as="form" onSubmit={handleSubmit} aria-label="Medication form" width="100%" >
      <VStack spacing={6} align="center" width="100%">
  <FormControl isRequired width="100%" maxW="560px" mx="auto" position="relative">
          <FormLabel textAlign="center" fontWeight={700} fontSize="1.5rem">Lijek</FormLabel>
          <Input
            id="medication-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // show suggestions when user types
              setShowSuggestions(true);
              // clear selection when user types
              if (medId !== null) setMedId(null);
            }}
            placeholder="Pretraži lijek..."
            size="lg"
            textAlign="center"
          />

          {(search.length > 0 && showSuggestions)   && (
            <Box position="absolute" left={0} right={0} top="100%" mt={2} borderRadius="8px" borderWidth="1px" borderColor="gray.200" maxH="200px" overflowY="auto" bg="white" zIndex={20} >
              <List spacing={0}>
                {filteredMeds.length === 0 && (

                  <ListItem p={3} textAlign="center" color="gray.500">Nema rezultata</ListItem>
                )}
                {filteredMeds.map((m: any) => (
                    <ListItem
                    key={m.id}
                    p={3}
                    _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                    onClick={() => {
                      setMedId(Number(m.id));
                      // prefill the search input with the selected med name
                      setSearch(m.naziv);
                      // hide suggestions after selection
                      setShowSuggestions(false);
                    }}
                  >
                    <HStack justify="space-between">
                      <Text>{m.naziv}</Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {/* selection is visible in the search input */}
        </FormControl>

        <FormControl isRequired width="100%" maxW="560px" mx="auto">
                <FormLabel textAlign="center" fontWeight={700} fontSize="1.5rem">Početno vrijeme</FormLabel>
                <Flatpickr
                  options={{
                    enableTime: true,
                    time_24hr: true,
                    // internal value format (not shown) keeps full precision
                    dateFormat: "Y-m-d H:i",
                    // show a friendly 24h format to the user (no AM/PM)
                    altInput: true,
                    altFormat: "d-m-Y H:i",
                    minuteIncrement: 1,
                    onReady: (selectedDates: Date[], dateStr: string, instance: any) => {
                      // reinforce 24-hour mode and altFormat on ready for browsers that prefer 12h
                      try {
                        instance.set('time_24hr', true);
                        instance.set('altFormat', 'd-m-Y H:i');
                      } catch (e) {
                        // ignore if API unavailable
                      }
                    }
                  }}
                  value={startTime ?? undefined}
                  onChange={(dates: Date[]) => {
                    const d = dates && dates[0] ? dates[0] : null;
                    setStartTime(d);
                  }}
                  className="chakra-input"
                />
                {/* human-friendly Croatian preview */}
                <Text fontSize="0.95rem" color="gray.600" mt={2} aria-live="polite">{formatCroatianDateWith24Hour(startTime)}</Text>
        </FormControl>

        <FormControl isRequired width="100%" maxW="560px" mx="auto">
          <FormLabel textAlign="center" fontWeight={700} fontSize="1.5rem">Razmak (sati)</FormLabel>
          <NumberInput min={1} value={intervalHours} onChange={(_, val) => setIntervalHours(Number(val))} size="lg" width="100%">
            <NumberInputField aria-label="hours" width="100%" textAlign="center" />
          </NumberInput>
        </FormControl>

        <FormControl isRequired width="100%" maxW="560px" mx="auto">
          <FormLabel textAlign="center" fontWeight={700} fontSize="1.5rem">Količina</FormLabel>
          <NumberInput min={1} value={quantity} onChange={(_, val) => setQuantity(Number(val))} size="lg" width="100%">
            <NumberInputField aria-label="quantity" width="100%" textAlign="center" />
          </NumberInput>
        </FormControl>

        <Button type="submit" isLoading={loading} size="lg" width="60%">
          Spremi podsjetnik
        </Button>

        {error && (
          <Text role="alert" aria-live="assertive" color="red.500" textAlign="center">
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default MedicationForm;
