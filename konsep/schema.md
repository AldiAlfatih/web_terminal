# Database Schema

## Tables and Relationships

1. **admin**
   - `id_admin` (PK, auto_increment)
   - `nama_admin` (varchar)
   - `username` (varchar, unique)
   - `password` (varchar, hashed)
   - `level` (enum: superadmin, petugas)

2. **po_bus**
   - `id_po` (PK, auto_increment)
   - `nama_po` (varchar) (e.g., 'DAMRI')
   - `alamat_po` (text)
   - `no_telp_po` (varchar)

3. **bus**

   - `id_bus` (PK, auto_increment)
   - `id_po` (FK -> po_bus.id_po)
   - `nama_bus` (varchar)
   - `nomor_polisi` (varchar)

4. **rute**
   - `id_rute` (PK, auto_increment)
   - `asal` (varchar)
   - `tujuan` (varchar)
   - `keterangan_rute` (text)

5. **jadwal**
   - `id_jadwal` (PK, auto_increment)
   - `id_bus` (FK -> bus.id_bus)
   - `id_rute` (FK -> rute.id_rute)
   - `id_admin` (FK -> admin.id_admin)
   - `tanggal` (date)
   - `jam_keberangkatan` (time)
   - `jam_kedatangan` (time)
   - `status_bus` (enum: 'menunggu', 'berangkat', 'selesai')
   - `keterangan` (text)

6. **laporan**
   - `id_laporan` (PK, auto_increment)
   - `id_admin` (FK -> admin.id_admin)
   - `tanggal_laporan` (date)
   - `periode_awal` (date)
   - `jenis_laporan` (varchar)
   - `file_pdf` (varchar/path)