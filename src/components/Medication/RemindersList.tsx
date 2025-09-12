import React, { useEffect, useState } from "react";
import {
  getUserReminders,
  deleteKorisnikLijek,
  updateKorisnikLijek,
  getAllMeds,
  medicationTaken,
  snoozeReminder,
  dontRemindToday,
} from "../../utils/api";
import { KorisnikLijekRead } from "../../types/medication";
import {
  Box,
  Button,
  Stack,
  Input,
  Text,
  Heading,
  HStack,
  VStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import MedicationAction from "./MedicationAction";
import "../../assets/css/remindersList.css";

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

  function toLocalDatetimeValue(d: Date) {
    // Convert a Date to local YYYY-MM-DDTHH:MM for <input type="datetime-local">
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  const formatDateDDMMYYYY = (iso: string | Date) => {
    const d = typeof iso === "string" ? new Date(iso) : iso;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [rem, allMeds] = await Promise.all([
          getUserReminders(),
          getAllMeds(),
        ]);
        setItems(rem || []);
        setMeds(allMeds || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load reminders");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const startEdit = (lijek_id: number) => {
    const item = items.find((i) => i.lijek_id === lijek_id);
    if (!item) return;
    setEditing({ ...editing, [lijek_id]: { ...item } });
  };

  const cancelEdit = (lijek_id: number) => {
    const n = { ...editing };
    delete n[lijek_id];
    setEditing(n);
  };

  const validate = (p: Partial<KorisnikLijekRead>) => {
    const errors: Record<string, string> = {};
    if (!p.pocetno_vrijeme) errors.pocetno_vrijeme = "Start time is required";
    if (!p.razmak_sati || Number(p.razmak_sati) <= 0)
      errors.razmak_sati = "Interval must be > 0";
    if (!p.kolicina || Number(p.kolicina) <= 0)
      errors.kolicina = "Quantity must be > 0";
    return errors;
  };

  const saveEdit = async (lijek_id: number) => {
    const payload = editing[lijek_id];
    if (!payload) return;
    const errors = validate(payload);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors).join("; "));
      toast({
        title: "Validation error",
        description: Object.values(errors).join("; "),
        status: "error",
      });
      return;
    }
    try {
      let p = { ...payload } as any;
      if (p.pocetno_vrijeme && p.pocetno_vrijeme.length === 16) {
        p.pocetno_vrijeme = p.pocetno_vrijeme + ":00";
      }
      await updateKorisnikLijek(lijek_id, p);
      const rem = await getUserReminders();
      setItems(rem || []);
      cancelEdit(lijek_id);
      setError(null);
      toast({ title: "Saved", status: "success" });
    } catch (e: any) {
      setError(e?.message || "Failed to save");
      toast({
        title: "Save failed",
        description: e?.message || "Failed to save",
        status: "error",
      });
    }
  };

  const remove = async (lijek_id: number) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;
    try {
      await deleteKorisnikLijek(lijek_id);
      setItems(items.filter((i) => i.lijek_id !== lijek_id));
      toast({ title: "Deleted", status: "success" });
    } catch (e: any) {
      setError(e?.message || "Failed to delete");
      toast({
        title: "Delete failed",
        description: e?.message || "Failed to delete",
        status: "error",
      });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Box role="alert">{error}</Box>;

  return (
    <Box aria-label="Your reminders" className="reminders">
      <Heading as="h2" size="lg" className="reminders__title">
        Moji podsjetnici
      </Heading>
      {items.length === 0 && (
        <Text className="reminders__empty">
          Nemate spremljenih podsjetnika.
        </Text>
      )}

      <VStack spacing={3} align="stretch">
        {items.map((item) => {
          const isEditing = !!editing[item.lijek_id];
          const edit = editing[item.lijek_id] || {};
          const med = meds.find((m) => m.id === item.lijek_id);

          return (
            <Box
              key={item.lijek_id}
              className={`reminder ${isEditing ? "is-editing" : ""}`}
            >
              <HStack
                justify="space-between"
                align="center"
                className="reminder__header"
              >
                <Box className="reminder__meta">
                  <Text className="reminder__name">
                    {med ? med.naziv : `Medicine #${item.lijek_id}`}
                  </Text>
                  <div className="reminder__info">
                    <span>
                      Start: {formatDateDDMMYYYY(item.pocetno_vrijeme)}
                    </span>
                    <span>Svakih: {item.razmak_sati} h</span>
                    <span>Količina: {item.kolicina}</span>
                  </div>
                </Box>

                {!isEditing && (
                  <HStack className="reminder__actions">
                    <Button
                      size="sm"
                      onClick={() => startEdit(item.lijek_id)}
                      className="btn-secondary"
                    >
                      Uredi
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => remove(item.lijek_id)}
                      className="btn-danger"
                    >
                      Obriši
                    </Button>
                    <MedicationAction
                      onTaken={async () => {
                        try {
                          await medicationTaken(item.lijek_id);
                          toast({ title: "Označeno kao uzeto", status: "success" });
                        } catch (e: any) {
                          console.error(e);
                          toast({
                            title: "Neuspjeh",
                            description: e?.message || "Failed to mark as taken",
                            status: "error",
                          });
                        }
                      }}
                      onSnooze={async () => {
                        try {
                          await snoozeReminder(item.lijek_id);
                          toast({ title: "Podsjetnik odgođen", status: "success" });
                        } catch (e: any) {
                          toast({
                            title: "Neuspjeh",
                            description: e?.message || "Failed to snooze",
                            status: "error",
                          });
                        }
                      }}
                      onDontRemind={async () => {
                        try {
                          await dontRemindToday(item.lijek_id);
                          toast({ title: "Ne podsjećaj danas", status: "success" });
                        } catch (e: any) {
                          toast({
                            title: "Neuspjeh",
                            description: e?.message || "Failed to set don't remind",
                            status: "error",
                          });
                        }
                      }}
                    />
                  </HStack>
                )}
              </HStack>

              {isEditing && (
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={8}
                  mt={3}
                  className="reminder__edit"
                >
                  <div className="form__row">
                    <label
                      className="form__label"
                      htmlFor={`start-${item.lijek_id}`}
                    >
                      Početno vrijeme
                    </label>
                    <Input
                      id={`start-${item.lijek_id}`}
                      aria-label="start-time"
                      type="datetime-local"
                      className="form__input"
                      value={
                        edit.pocetno_vrijeme
                          ? toLocalDatetimeValue(new Date(edit.pocetno_vrijeme))
                          : ""
                      }
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [item.lijek_id]: {
                            ...edit,
                            pocetno_vrijeme: e.target.value,
                          },
                        })
                      }
                    />
                    {/* <Text className="reminder__datePreview">
    {edit.pocetno_vrijeme
      ? formatDateTimeDDMMYYYY_HHMM(new Date(edit.pocetno_vrijeme))
      : ""}
  </Text> */}
                  </div>

                  <div className="form__row">
                    <label
                      className="form__label"
                      htmlFor={`hours-${item.lijek_id}`}
                    >
                      Razmak (h)
                    </label>
                    <Input
                      id={`hours-${item.lijek_id}`}
                      aria-label="hours"
                      type="number"
                      className="form__input"
                      placeholder="Sati"
                      value={edit.razmak_sati ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [item.lijek_id]: {
                            ...edit,
                            razmak_sati: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>

                  <div className="form__row">
                    <label
                      className="form__label"
                      htmlFor={`qty-${item.lijek_id}`}
                    >
                      Količina
                    </label>
                    <Input
                      id={`qty-${item.lijek_id}`}
                      aria-label="quantity"
                      type="number"
                      className="form__input"
                      placeholder="Količina"
                      value={edit.kolicina ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [item.lijek_id]: {
                            ...edit,
                            kolicina: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>

                  <HStack className="reminder__editActions">
                    <Button
                      onClick={() => saveEdit(item.lijek_id)}
                      className="btn-primary"
                    >
                      Spremi
                    </Button>
                    <Button
                      onClick={() => cancelEdit(item.lijek_id)}
                      className="btn-secondary"
                    >
                      Odustani
                    </Button>
                  </HStack>
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
