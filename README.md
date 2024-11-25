# KPI IT Purchase Report

project ini menggunakan Laravel 10 sebagai Backend dan ReactJS sebagai Frontend nya

pastikan telah menginstal composer dan node js

Cara Menjalankan:

1.  Bikin database baru, lalu import /Backend/.DATABASE/kpi_it_division_purchase_report.sql ke database baru
2.  masuk ke direcotry /Backend, lalu jalankan:

    - composer install
    - cp .env.example .env
      (
         ubah konfigurasi databasenya sesuai dengan database yang telah dibuat,
         tambahkan API key di bagian untuk exhchange rate yang dapat di bikin di

          https://apilayer.com/marketplace/exchangerates_data-api

          setelah mendapatkan API key, masukkan ke EXCHANGE_RATES_API_KEY pada file env

      )

    - php artisan key:generate
    - php artisan jwt:secret
    - npm install
    - php artisan serve (menjalankan laravel)

3.  Masuk ke direcory /Frontend KPI, lalu ubah file .env sesuai dengan url hasil dari menjalankan aplikasi laravel
4.  Buka vite.config.js lalu ubah host: dengan address computer anda jika mau dibuka di device lain. Jika tidak, host: bisa dihapus atau di comment
5.  Jalankan npm install lalu npm run dev

untuk login gunakan

- email: admin@gmail.com
- password: 12345678
