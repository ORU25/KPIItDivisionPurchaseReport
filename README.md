#KPI IT Purchase Report

project ini menggunakan Laravel 10 sebagai Backend dan ReactJS sebagai Frontend nya

pastikan telah menginstal composer dan node js

Cara Menjalankan: 
1. Bikin database baru, lalu import  /Backend/.DATABASE/kpi_it_division_purchase_report.sql ke database baru
2. masuk ke direcotry /Backend, lalu jalankan:
    composer install
    cp .env.example .env (ubah konfigurasi databasenya sesuai dengan database yang telah dibuat)
    php artisan key:generate
    npm install
    php artisan serve (menjalankan laravel)

3. Masuk ke direcory /Frontend, lalu ubah file .env sesuai dengan url hasil dari menjalankan aplikasi laravel 
4. Buka vite.config.js lalu ubah host: dengan address computer anda jika mau dibuka di device lain. Jika tidak host: bisa dihapus atau di comment
5. Jalankan npm run dev
 
