# Jasatitip Store Backend

## Menjalankan secara lokal

1. Pastikan PostgreSQL berjalan.
2. Buat database `jasatitip_store`.
3. Salin `.env.example` menjadi `.env`, lalu sesuaikan `DATABASE_URL`.
4. Jalankan `database/schema.sql` pada database tersebut.
5. Jalankan `npm install`.
6. Jalankan `npm run dev`.

Endpoint awal:

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

Akun admin demo:

- Email: `admin@jasatitip.store`
- Password: `admin123`

Endpoint `POST`, `PUT`, dan `DELETE` pada produk membutuhkan header:

```text
Authorization: Bearer <token dari endpoint login>
```
