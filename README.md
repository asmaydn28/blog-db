# Blog DB

Bu proje, blog gönderileri, kategoriler ve yorumlar için bir veritabanı ve API altyapısıdır.

**GitHub Deposu:** [https://github.com/asmaydn28/blog-db](https://github.com/asmaydn28/blog-db)

## Proje Hakkında

Bu proje bir ödev olarak geliştirilmiştir. Node.js, Express, Knex.js ve TypeScript kullanılarak oluşturulmuştur.

## Kurulum ve Başlatma

1.  Gerekli paketleri yükleyin:
    ```bash
    npm install
    ```
2.  Veritabanı migration'larını çalıştırın:
    ```bash
    npx knex migrate:latest
    ```
3.  Uygulamayı başlatın:
    ```bash
    npm start
    ```

## API Endpointleri

Proje, Postman koleksiyonu olarak `Blog Db.postman_collection.json` dosyasını içermektedir. Bu koleksiyonu Postman'e aktararak tüm API endpoint'lerini test edebilirsiniz.
