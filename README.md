# Sistem Informasi Terminal Induk Parepare

Sistem Informasi Web Terpadu Jadwal Keberangkatan, Kedatangan, dan Pelacakan Bus Real-Time untuk Terminal Induk Parepare berbasis **Laravel 11**, **React 19**, **Tailwind CSS v4**, **Laravel Reverb (WebSockets)**, dan **Leaflet.js / OpenStreetMap**.

---

## 🚌 Fitur Utama

- **Public Schedule Board (Penumpang)**: Papan jadwal bus interaktif publik tanpa login, lengkap dengan pencarian rute/bus.
- **Real-Time Live Map Tracking**: Pelacakan posisi bus di peta OpenStreetMap secara live menggunakan WebSocket (Laravel Reverb) tanpa Google Maps API berbayar.
- **Antarmuka Mobile Supir (Driver UI)**:
  - Pelacakan koordinat kontinu via **HTML5 Geolocation API**.
  - **Screen Wake Lock API** agar layar HP supir tidak mati saat bus berjalan.
  - Telemetri live: Kecepatan (km/jam), arah kompas (°), dan akurasi GPS (meter).
  - Tombol raksasa khas DAMRI (*High-Contrast Outdoor Theme*).
- **Admin Management Panel**:
  - Autentikasi berbasis username (Admin / Petugas).
  - Management Master Data: Perusahaan Otobus (PO Bus), Armada Bus (Plat Nomor JetBrains Mono), Rute Trayek, dan Jadwal Operasional.
  - Bento Grid Dashboard statistik operasional harian.
- **Desain Khas DAMRI x Art Zine**:
  - Palette warna resmi DAMRI Navy (`#003B70`), DAMRI Yellow (`#FFC627`), Warm Cream Canvas (`#f9f7f3`), & Ink (`#001A33`).
  - Tipografi: Bricolage Grotesque (Headlines), Inter (UI), & JetBrains Mono (Data/Jam/Plat).
  - Sudut melengkung kapsul (`rounded-full` 9999px) tanpa sudut tajam.

---

## 🛠️ Stack Teknologi

- **Backend**: PHP 8.2+, Laravel 11, MySQL, Laravel Reverb (WebSockets)
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

### 2. Konfigurasi Environment & Database
```bash
# Salin file environment
cp .env.example .env

# Generate Application Key
php artisan key:generate
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
AUTH_MODEL=App\Models\Admin
```

### 3. Migrasi Database & Seeder
```bash
php artisan migrate --seed
```
*Catatan: Akun admin default: `username: admin` / `password: admin123`.*

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
