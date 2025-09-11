# Blog DB

Bu proje, blog gönderileri, kategoriler, etiketler ve yorumlar için bir veritabanı ve API altyapısıdır.

**GitHub Deposu:** [https://github.com/asmaydn28/blog-db](https://github.com/asmaydn28/blog-db)

## Proje Hakkında

Bu proje bir ödev olarak geliştirilmiştir. Node.js, Express, Prisma ve TypeScript kullanılarak oluşturulmuştur.

## Kurulum ve Başlatma

### 1. Gerekli Bağımlılıkları Yükleyin

Projeyi klonladıktan sonra, gerekli paketleri yükleyin:
```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

Projenin veritabanı bağlantısı için bir `.env` dosyasına ihtiyacı vardır. Ana dizinde `.env` adında bir dosya oluşturun ve içine veritabanı bağlantı URL'nizi ekleyin.

**Örnek `.env` dosyası:**
```
# Veritabanı sağlayıcınıza (PostgreSQL, MySQL, SQLite vb.) göre URL'yi güncelleyin.
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/blogdb"
```

### 3. Veritabanı Migration'larını Çalıştırın

Prisma, veritabanı şemanızı `prisma/schema.prisma` dosyasına göre günceller. Aşağıdaki komut, migration'ları çalıştırır ve Prisma Client'ı oluşturur:
```bash
npx prisma migrate dev
```
Bu komut, `prisma/migrations` klasöründeki değişiklikleri veritabanına uygulayacaktır.

### 4. Uygulamayı Başlatın

Uygulamayı geliştirme modunda başlatmak için aşağıdaki komutu çalıştırın. Bu komut, dosya değişikliklerini izler ve sunucuyu otomatik olarak yeniden başlatır.
```bash
npm run dev
```
Sunucu varsayılan olarak `http://localhost:3000` adresinde (veya kodda belirtilen portta) çalışmaya başlayacaktır.

## API Endpointleri

Proje, Postman koleksiyonu olarak `Blog Db.postman_collection.json` dosyasını içermektedir. Bu koleksiyonu Postman'e aktararak tüm API endpoint'lerini test edebilirsiniz.