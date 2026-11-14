-- Otomasi alur pesanan Techpora.
-- STATUS: sudah diterapkan ke project Supabase techpora (2026-11-14) sebagai migrasi "otomasi_pesanan".
--
-- Satu pesanan baru otomatis menghasilkan:
--   1. tugas serah terima (tanggal mulai) dan tugas pengembalian (tanggal selesai)
--   2. status tugas ikut berubah saat status pesanan berubah
--   3. status bayar (lunas / sebagian / belum) yang dihitung dari pembayaran
-- Kalender, perjanjian (token /ttd), piutang, keuangan, dan ROI sudah membaca
-- langsung dari tabel pesanan + pembayaran, jadi otomatis ikut.

-- ---------------------------------------------------------------
-- 1. Kolom tambahan (aditif, tidak mengubah data yang ada)
-- ---------------------------------------------------------------
alter table public.pesanan add column if not exists pic_id uuid references public.pic(id) on delete set null;
alter table public.pic add column if not exists utama boolean not null default false;
alter table public.tugas add column if not exists wa_pelanggan_terkirim boolean not null default false;
alter table public.tugas add column if not exists wa_pic_terkirim boolean not null default false;

-- ---------------------------------------------------------------
-- 2. Tugas otomatis saat pesanan dibuat
-- ---------------------------------------------------------------
create or replace function public.buat_tugas_pesanan()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_pic uuid;
  v_nama text;
  v_unit text;
begin
  select coalesce(
    new.pic_id,
    (select id from public.pic where aktif and utama order by dibuat_pada limit 1),
    (select id from public.pic where aktif order by dibuat_pada limit 1)
  ) into v_pic;

  select nama into v_nama from public.pelanggan where id = new.pelanggan_id;
  select nama into v_unit from public.unit where id = new.unit_id;

  if new.status in ('dipesan', 'berjalan') then
    insert into public.tugas (judul, jenis, pic_id, pesanan_id, pelanggan_id, unit_id, jatuh_tempo, jam, status, prioritas)
    values
      ('Serah terima ' || coalesce(v_unit, new.unit_id) || ' — ' || coalesce(v_nama, 'pelanggan'),
       'serah_terima', v_pic, new.id, new.pelanggan_id, new.unit_id, new.mulai, new.jam, 'menunggu', 'normal'),
      ('Pengembalian ' || coalesce(v_unit, new.unit_id) || ' — ' || coalesce(v_nama, 'pelanggan'),
       'pengembalian', v_pic, new.id, new.pelanggan_id, new.unit_id, new.selesai, new.jam, 'menunggu', 'normal');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_pesanan_buat_tugas on public.pesanan;
create trigger trg_pesanan_buat_tugas
  after insert on public.pesanan
  for each row execute function public.buat_tugas_pesanan();

-- ---------------------------------------------------------------
-- 3. Tugas ikut berubah saat pesanan diubah
-- ---------------------------------------------------------------
create or replace function public.sinkron_tugas_pesanan()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- jadwal berubah -> tanggal tugas ikut
  if new.mulai is distinct from old.mulai or new.jam is distinct from old.jam then
    update public.tugas set jatuh_tempo = new.mulai, jam = new.jam
      where pesanan_id = new.id and jenis = 'serah_terima' and status in ('menunggu', 'dikerjakan');
  end if;
  if new.selesai is distinct from old.selesai or new.jam is distinct from old.jam then
    update public.tugas set jatuh_tempo = new.selesai, jam = new.jam
      where pesanan_id = new.id and jenis = 'pengembalian' and status in ('menunggu', 'dikerjakan');
  end if;
  if new.pic_id is distinct from old.pic_id and new.pic_id is not null then
    update public.tugas set pic_id = new.pic_id
      where pesanan_id = new.id and status in ('menunggu', 'dikerjakan');
  end if;

  -- status berubah -> tugas terkait ikut
  if new.status is distinct from old.status then
    if new.status = 'berjalan' then
      update public.tugas set status = 'selesai'
        where pesanan_id = new.id and jenis = 'serah_terima' and status in ('menunggu', 'dikerjakan');
    elsif new.status = 'selesai' then
      update public.tugas set status = 'selesai'
        where pesanan_id = new.id and jenis in ('serah_terima', 'pengembalian') and status in ('menunggu', 'dikerjakan');
    elsif new.status = 'batal' then
      update public.tugas set status = 'batal'
        where pesanan_id = new.id and status in ('menunggu', 'dikerjakan');
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_pesanan_sinkron_tugas on public.pesanan;
create trigger trg_pesanan_sinkron_tugas
  after update on public.pesanan
  for each row execute function public.sinkron_tugas_pesanan();

-- ---------------------------------------------------------------
-- 4. Status bayar dihitung, bukan disimpan (satu sumber kebenaran)
-- ---------------------------------------------------------------
create or replace view public.v_pesanan_bayar
with (security_invoker = true) as
select
  p.id as pesanan_id,
  p.total,
  coalesce(sum(b.jumlah), 0)::int as dibayar,
  greatest(p.total - coalesce(sum(b.jumlah), 0), 0)::int as sisa,
  case
    when p.status = 'batal' then 'batal'
    when coalesce(sum(b.jumlah), 0) >= p.total and p.total > 0 then 'lunas'
    when coalesce(sum(b.jumlah), 0) > 0 then 'sebagian'
    else 'belum'
  end as status_bayar
from public.pesanan p
left join public.pembayaran b on b.pesanan_id = p.id
group by p.id;

-- ---------------------------------------------------------------
-- 5. Voucher terpakai bertambah otomatis (lihat catatan di bawah)
-- ---------------------------------------------------------------
-- Catatan: tabel pesanan belum punya kolom kode voucher. Diskon sekarang
-- dicatat sebagai baris di kolom item (jumlah negatif). Integrasi voucher
-- otomatis ditunda sampai alur pesanan baru selesai dirancang.
