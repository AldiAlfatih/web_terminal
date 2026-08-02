# Sistem Informasi Terminal Induk Parepare

Sistem Informasi Web Terpadu Jadwal Keberangkatan, Kedatangan, dan Pelacakan Bus Real-Time untuk Terminal Induk Parepare berbasis **Laravel 12**, **React 19**, **Tailwind CSS v4**, **Laravel Reverb (WebSockets)**, dan **Leaflet.js / OpenStreetMap**.

---

## 🚌 Fitur Utama

- **Public Schedule Board (Penumpang)**: Papan jadwal bus interaktif publik tanpa login, lengkap dengan fitur pencarian rute & nama bus.
- **Real-Time Live Map Tracking**: Pelacakan posisi bus di peta OpenStreetMap secara live menggunakan WebSocket (Laravel Reverb) tanpa API berbayar.
- **Portal Akses Terpadu (Unified Single Login)**:
  - Satu halaman login terpadu (`/login`) untuk **Admin**, **Petugas**, dan **Supir**.
  - Pengecekan peran pengguna secara otomatis: Admin dialihkan ke `/dashboard`, Supir dialihkan ke `/supir`.
- **Portal & Antarmuka Mobile Supir**:
  - Supir terautentikasi dapat melihat jadwal bus yang ditugaskan kepada mereka.
  - Pelacakan koordinat GPS kontinu via **HTML5 Geolocation API**.
  - **Screen Wake Lock API** agar layar HP supir tidak mati saat mengemudi.
  - Telemetri live: Kecepatan (km/jam), arah kompas (°), dan akurasi GPS (meter).
- **Admin Management Panel**:
  - **Manajemen Master Data**: Perusahaan Otobus (PO Bus), Armada Bus (Plat Nomor JetBrains Mono), Data Supir, Rute Trayek, dan Jadwal Operasional.
  - **Manajemen Laporan PDF**: Pembuatan, pengunggahan berkas PDF, dan cetak dokumen laporan resmi ber-Kop Surat Dinas Perhubungan Kota Parepare.
  - **Bento Grid Dashboard**: Visualisasi statistik operasional harian dan master data.
- **Desain Khas DAMRI x Art Zine**:
  - Palette warna resmi DAMRI Navy (`#003B70`), DAMRI Yellow (`#FFC627`), Warm Cream Canvas (`#f9f7f3`), & Ink (`#001A33`).
  - Tipografi: Bricolage Grotesque (Headlines), Inter (UI), & JetBrains Mono (Data/Jam/Plat).
  - Sudut melengkung kapsul (`rounded-full`) dan kartu warna terpisah tanpa drop shadow generik.

---

## 🛠️ Stack Teknologi

- **Backend**: PHP 8.2+, Laravel 12, MySQL, Laravel Reverb (WebSockets)
- **Frontend**: React 19, Inertia.js v2, Tailwind CSS v4, Lucide Icons
- **Peta & Pelacakan**: Leaflet.js, React-Leaflet, OpenStreetMap, HTML5 Geolocation, Screen Wake Lock API

---

## 🚀 Panduan Instalasi Lokal

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/AldiAlfatih/web_terminal.git
cd web_terminal

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Konfigurasi Environment & Storage Link
```bash
# Salin file environment
cp .env.example .env

# Generate Application Key
php artisan key:generate

# Hubungkan direktori storage publik untuk file PDF
php artisan storage:link
```

Sesuaikan `.env` dengan kredensial MySQL Anda:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=terminal_parepare
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_CONNECTION=reverb
```

### 3. Migrasi Database & Seeder
```bash
php artisan migrate:fresh --seed
```

#### 🔑 Akun Default Seeder (`/login`):
| Peran | Username | Password |
|---|---|---|
| Super Admin | `admin` | `admin123` |
| Petugas Terminal | `petugas1` | `petugas123` |
| Supir 1 | `supir1` | `supir123` |
| Supir 2 | `supir2` | `supir123` |

### 4. Jalankan Server Development
Buka 3 terminal terpisah:

```bash
# Terminal 1: Laravel Web Server
php artisan serve

# Terminal 2: Vite Dev Server / Asset Build
npm run dev   # atau npm run build untuk produksi

# Terminal 3: WebSocket Server Reverb
php artisan reverb:start
```

---

## 📜 Lisensi
Dikembangkan untuk Sistem Informasi Terminal Induk Parepare. MIT License.
