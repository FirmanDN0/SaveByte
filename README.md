# 💚 SaveBite - Save Food, Reduce Waste & Help the Planet

SaveBite adalah platform digital inovatif berbasis web statis yang dirancang khusus untuk kompetisi desain web tingkat nasional. Platform ini menghubungkan pelaku bisnis makanan lokal (kafe, restoran, toko roti) dengan konsumen untuk menyelamatkan produk makanan berlebih (surplus) berkualitas tinggi yang belum terjual pada akhir hari kerja dengan diskon hingga 70%.

Platform ini dibangun menggunakan teknologi **murni (Vanilla HTML, CSS, dan JavaScript)** tanpa menggunakan framework pihak ketiga (seperti React, Vue, Tailwind, atau Bootstrap) guna menjamin kecepatan performa maksimal, struktur kode yang bersih, serta kemudahan hosting langsung di GitHub Pages.

---

## 🖥️ Deskripsi Halaman Utama SaveBite

Berikut adalah panduan dan penjelasan singkat untuk keenam halaman utama yang menyusun ekosistem digital SaveBite:

### 1. 🏠 Beranda / Home (`index.html`)
Pintu gerbang utama platform yang dirancang dengan estetika premium kelas dunia (*Awwwards-style*).
* **Tujuan**: Memikat perhatian juri/pengguna sejak detik pertama, memperkenalkan misi penyelamatan makanan, serta menampilkan metrik keberhasilan komunitas.
* **Fitur Unggulan**:
  * **Hero Area**: Dilengkapi dengan ornamen SVG berputar lambat (*spinning decorations*), background blob organik, dan elemen gambar 3D interaktif yang bergerak mengikuti kursor.
  * **Waste Crisis Board**: Menampilkan data kritis krisis pangan dunia menggunakan motor animasi hitung cepat (*count-up counter*).
  * **Testimonials Slider**: Komponen geser interaktif untuk melihat testimoni dari para *rescuers* dan pemilik bisnis secara mulus.
  * **SDGs Alignment**: Edukasi komitmen platform yang terintegrasi secara harmonis dengan Tujuan Pembangunan Berkelanjutan PBB (SDG 2: Zero Hunger, SDG 12: Responsible Consumption, SDG 13: Climate Action).

### 2. 🌿 Dampak Lingkungan / Eco Impact (`impact.html`)
Pusat analitik ekologis yang mendidik sekaligus interaktif bagi pengguna.
* **Tujuan**: Memberikan pemahaman nyata mengenai kontribusi lingkungan yang telah dicapai melalui aksi penyelamatan makanan.
* **Fitur Unggulan**:
  * **Interactive Carbon Calculator**: Kalkulator simulasi canggih yang menghitung potensi penghematan tahunan pengguna (Karbon CO2, uang belanja, dan jumlah pohon terselamatkan) secara *real-time* disertai visualisasi ikon pohon yang tumbuh dinamis (*sprouting forest*).
  * **HTML5 Canvas Charts**: Grafik batang interaktif dan diagram donat yang di-render secara tajam pada resolusi tinggi (High-DPI) untuk menampilkan statistik bulanan pangan terselamatkan berdasarkan kategori.

### 3. 🛍️ Katalog / Food Marketplace (`marketplace.html`)
Mesin transaksi utama platform yang mengelola katalog makanan surplus aktif.
* **Tujuan**: Mempermudah pengguna dalam mencari, memfilter, dan menyelamatkan produk makanan terdekat secara cepat dan efisien.
* **Fitur Unggulan**:
  * **Filter Panel Stabil**: Panel pencarian dan filter (kategori, *slider* jarak, dan *slider* harga maksimal) yang responsif dan mudah diakses.
  * **Dynamic Food Grid**: Kartu makanan interaktif dengan animasi *fade-in reveal*, label persentase diskon yang menarik, serta detektor waktu kedaluwarsa (*countdown timer*).
  * **High-Fidelity Detail Modal**: Jendela pop-up detail produk yang menampilkan informasi alergen, jendela waktu pengambilan (*pickup window*), serta klaim label diet.
  * **Saved Box Drawer**: Sidebar keranjang belanja yang terintegrasi dengan penyimpanan lokal (*localStorage*) untuk menyimpan pesanan secara permanen di browser pengguna.

### 4. 🏢 Dasbor Bisnis / For Business (`restaurant.html`)
Simulasi portal manajemen mitra restoran untuk mendaftarkan makanan berlebih mereka secara mandiri.
* **Tujuan**: Menunjukkan alur bisnis dari sisi mitra kafe/restoran (B2B) secara realistis dan interaktif.
* **Fitur Unggulan**:
  * **Live Stats Panel**: Dasbor finansial dan ekologis yang secara otomatis memperbarui nilai total pendapatan penyelamatan, berat makanan terselamatkan, listing aktif, dan emisi CO2 tercegah.
  * **Live Inventory Manager**: Grid manajemen produk di mana mitra dapat mensimulasikan penjualan barang (*Mark Sold*) atau menghapus listing secara instan.
  * **Upload Surplus Wizard**: Formulir pengunggahan produk makanan surplus dengan penyesuaian gambar kategori otomatis dan validasi harga diskon yang aman.

### 5. 👥 Tentang Kami / About Us (`about.html`)
Halaman narasi yang menceritakan visi, sejarah, dan nilai-nilai inti di balik SaveBite.
* **Tujuan**: Membangun kepercayaan pengguna serta memperkenalkan tim pengembang di balik pembuatan platform.
* **Fitur Unggulan**:
  * **Milestone Timeline**: Garis waktu sejarah pembentukan dan pencapaian strategis SaveBite dengan efek transisi gulir halaman yang lembut.
  * **Founders Card**: Kartu profil tim pengembang dengan efek *3D Parallax Tilt* yang memberikan sentuhan interaktif berkelas saat didekati kursor mouse.

### 6. 📞 Kontak & FAQ / Contact Us (`contact.html`)
Pusat bantuan dan saluran komunikasi yang interaktif untuk pelanggan dan calon mitra.
* **Tujuan**: Memfasilitasi pendaftaran mitra resmi, menangani keluhan pengguna, serta menjawab pertanyaan umum.
* **Fitur Unggulan**:
  * **FAQ Accordion**: Panel tanya-jawab interaktif dengan transisi pembukaan super halus memanfaatkan kalkulasi tinggi elemen dinamis (`scrollHeight`).
  * **Regional Coverage Map**: Representasi peta cakupan aktif dengan animasi gelombang denyut (*pulsing hot zones*) yang menunjukkan kota-kota jangkauan SaveBite.

### 7. 🔑 Masuk & Daftar / Auth Pages (`login.html` & `register.html`)
Halaman gerbang masuk dan pendaftaran dengan layout split-screen modern khas startup.
* **Tujuan**: Memfasilitasi otentikasi akun bagi konsumen penyelamat maupun mitra restoran.
* **Fitur Unggulan**:
  * **Split-Screen Layout**: Panel visual informatif di sisi kiri yang menampilkan statistik dampak ekologi, dan panel form glassmorphic di sisi kanan.
  * **Interactive Credentials Fields**: Input dengan visual status interaktif, tombol toggle kata sandi (lihat/sembunyikan), dan tombol login sosial (Google & Apple).
  * **Toast Feedback loop**: Notifikasi toast interaktif yang mengalir mulus dengan Javascript untuk simulasi validasi pendaftaran dan login.

---

## 🎨 Keunggulan Desain & Interaksi (Aesthetic Tokens)
* **Warna Alam & Kertas Hangat**: Paduan hijau kelestarian murni (`#165A42`), latar belakang krim kertas lembut (`#FAF7F2`), serta aksen oranye-peach segar (`#FF6F43`).
* **Morphing Trailing Cursor**: Kursor khusus dengan fisik pegas (*spring physics*) yang mengikuti pergerakan pointer secara organik dan dapat berubah mode teks konteks secara cerdas (misalnya: menunjukkan kata "OPEN" saat meluncur di atas foto produk, atau "LOVE" di atas tombol favorit).
* **Parallax 3D Tilt**: Perhitungan posisi koordinat kursor presisi pada kartu untuk menghasilkan kemiringan visual 3D yang dinamis.
* **GPU-Accelerated Smooth Transitions**: Transisi perpindahan halaman *Awwwards-style* menggunakan overlay layar penuh dengan akselerasi hardware grafik (`translateX`) yang meluncur bebas hambatan (tanpa lag render).

---
*Dibuat dengan penuh dedikasi 💚 untuk Kompetisi Desain Web Nasional.*
