export interface MedicationInput {
  medication: string;
  frequency: string;
}

export interface KorisnikLijekRead {
  korisnik_id: number;
  lijek_id: number;
  pocetno_vrijeme: string; // ISO datetime
  razmak_sati: number;
  kolicina: number;
}
