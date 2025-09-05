import { getUserReminders, createKorisnikLijek } from '../utils/api';

test('getUserReminders returns an array of reminders', async () => {
  const res = await getUserReminders();
  expect(Array.isArray(res)).toBe(true);
  expect(res.length).toBeGreaterThanOrEqual(0);
  if (res.length > 0) {
    expect(res[0]).toHaveProperty('lijek_id');
    expect(res[0]).toHaveProperty('pocetno_vrijeme');
  }
});

test('createKorisnikLijek posts and returns success', async () => {
  const payload = { korisnik_id: 1, lijek_id: 2, pocetno_vrijeme: new Date().toISOString(), razmak_sati: 8, kolicina: 1 };
  const res = await createKorisnikLijek(payload);
  // msw handler returns { success: true }
  expect(res).toBeTruthy();
});
