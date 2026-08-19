INSERT INTO admins (name, email, password_hash)
VALUES ('Administrator', 'admin@jasatitip.store', '$2a$10$EyadZ0wXXjbm1K/VXoNF8.qWZticKo3iKBTzmichRkbRybxOP0KtW')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, slug)
VALUES
  ('Anime', 'anime'),
  ('General', 'general'),
  ('Video Games', 'video-games'),
  ('Cartoons', 'cartoons'),
  ('Titipan', 'titipan'),
  ('Enamel Pin', 'enamel-pin'),
  ('Keychains', 'keychains'),
  ('Sale', 'sale')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, category, subcategory, price, original_price, image_url, stock, product_type, badge)
VALUES
('Luffy Gear 5 Figure (Titipan)', 'luffy-gear-5-figure', '15 cm - Import Jepang - Edisi terbatas', 'Anime', 'One Piece', 9000, NULL, 'https://picsum.photos/id/1011/400/400', 134, 'simple', NULL),
('Gojo Satoru Acrylic Stand', 'gojo-satoru-acrylic-stand', 'Acrylic standee 15 cm - Double-sided print', 'Anime', 'Jujutsu Kaisen', 9000, NULL, 'https://picsum.photos/id/1005/400/400', 87, 'simple', NULL),
('Enamel Pin Zoro', 'enamel-pin-zoro', '3.2 cm - Enamel + Nickel - Pin back included', 'Anime', 'One Piece', 28000, 28000, 'https://picsum.photos/id/201/400/400', 42, 'simple', NULL),
('Enamel Pin Gojo', 'enamel-pin-gojo', '3 cm - Enamel Pin - Limited', 'Anime', 'Jujutsu Kaisen', 19600, 28000, 'https://picsum.photos/id/160/400/400', 19, 'simple', 'SALE'),
('Keychain Witch Hat Atelier', 'keychain-witch-hat-atelier', 'Acrylic keychain double sided - 6 karakter', 'Anime', 'Keychain', 25000, NULL, 'https://picsum.photos/id/180/400/400', 31, 'variable', NULL),
('Paket Blind Box Cats', 'paket-blind-box-cats', '5 pcs blind box - Random design', 'General', 'Animals', 35000, NULL, 'https://picsum.photos/id/106/400/400', 65, 'simple', 'PAKET'),
('Enamel Pin Link', 'enamel-pin-link', '2.8 cm - Legend of Zelda series', 'Video Games', 'Zelda', 24000, NULL, 'https://picsum.photos/id/251/400/400', 28, 'variable', NULL),
('Spongebob Meme Plush Keychain', 'spongebob-meme-plush-keychain', '25 cm plush keychain - Soft fabric', 'Cartoons', 'Spongebob', 8500, NULL, 'https://picsum.photos/id/29/400/400', 210, 'simple', NULL),
('Hat Pin Valorant Jett', 'hat-pin-valorant-jett', '2.5 cm - Hard Enamel - Sale', 'Video Games', 'Valorant', 18000, 22000, 'https://picsum.photos/id/160/400/400', 14, 'simple', 'SALE'),
('Paket Frog Blind Box', 'paket-frog-blind-box', '4 pcs blind box - Random frog designs', 'General', 'Animals', 32000, NULL, 'https://picsum.photos/id/201/400/400', 54, 'simple', 'PAKET'),
('Enamel Pin Naruto', 'enamel-pin-naruto', '3.1 cm - Uzumaki Edition', 'Anime', 'Naruto', 27500, NULL, 'https://picsum.photos/id/1009/400/400', 37, 'simple', NULL),
('Coffee Addict Tumbler', 'coffee-addict-tumbler', '6 x 4 cm - Perfect for tumbler', 'General', 'Coffee', 9000, NULL, 'https://picsum.photos/id/312/400/400', 98, 'simple', NULL),
('Keychain Initial D AE86', 'keychain-initial-d-ae86', 'Acrylic - Double side print', 'Anime', 'Initial D', 19500, NULL, 'https://picsum.photos/id/160/400/400', 22, 'simple', NULL),
('Ghibli Totoro Plush Keychain', 'ghibli-totoro-plush-keychain', '20 cm plush - Collectible edition', 'Anime', 'Ghibli', 9500, NULL, 'https://picsum.photos/id/1018/400/400', 76, 'simple', NULL),
('Enamel Pin Pikachu', 'enamel-pin-pikachu', '2.8 cm - Classic', 'Anime', 'Pokemon', 22000, 26000, 'https://picsum.photos/id/251/400/400', 9, 'simple', 'SALE'),
('Programmer Desk Set (Paket)', 'programmer-desk-set', '6 pcs - Laptop ready', 'General', 'Profession', 38000, NULL, 'https://picsum.photos/id/29/400/400', 41, 'simple', 'PAKET'),
('Enamel Pin Demon Slayer', 'enamel-pin-demon-slayer', '3 cm - Kimetsu no Yaiba series', 'Anime', 'Demon Slayer', 26500, NULL, 'https://picsum.photos/id/106/400/400', 33, 'variable', NULL),
('Chainsaw Man Mini Figure', 'chainsaw-man-mini-figure', '12 cm mini figure - Articulated', 'Anime', 'Chainsaw Man', 9000, NULL, 'https://picsum.photos/id/180/400/400', 58, 'simple', NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_variants (product_id, name, price, stock)
SELECT p.id, v.name, v.price, v.stock
FROM products p
JOIN (VALUES
  ('keychain-witch-hat-atelier', 'Coco', 25000, 31),
  ('keychain-witch-hat-atelier', 'Qifrey', 25000, 31),
  ('keychain-witch-hat-atelier', 'Tetia', 25000, 31),
  ('enamel-pin-link', 'Link', 24000, 28),
  ('enamel-pin-link', 'Majora''s Mask', 24000, 28),
  ('enamel-pin-link', 'Master Sword', 24000, 28),
  ('enamel-pin-demon-slayer', 'Tanjiro', 26500, 33),
  ('enamel-pin-demon-slayer', 'Nezuko', 26500, 33),
  ('enamel-pin-demon-slayer', 'Zenitsu', 26500, 33)
) AS v(slug, name, price, stock) ON p.slug = v.slug
WHERE NOT EXISTS (
  SELECT 1 FROM product_variants existing
  WHERE existing.product_id = p.id AND existing.name = v.name
);
