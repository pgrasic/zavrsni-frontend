import { rest } from 'msw';
import { setupServer } from 'msw/node';

const API_BASE = 'http://localhost:8080';

const handlers = [
  rest.get(`${API_BASE}/korisnik-lijek`, (req, res, ctx) => {
    return res(ctx.json([{
      korisnik_id: 1,
      lijek_id: 2,
      pocetno_vrijeme: new Date().toISOString(),
      razmak_sati: 8,
      kolicina: 1
    }]));
  }),
  rest.post(`${API_BASE}/korisnik-lijek`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ success: true }));
  })
];

export const server = setupServer(...handlers);
