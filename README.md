# Blog API

<details>
<summary><strong>English</strong></summary>

This project is a robust REST API for a blog platform, built with Node.js, Express, TypeScript, and Prisma. It features a comprehensive user and content management system with role-based access control.

</details>

<details open>
<summary><strong>Türkçe</strong></summary>

Bu proje, Node.js, Express, TypeScript ve Prisma ile geliştirilmiş bir blog platformu için güçlü bir REST API'sidir. Rol tabanlı erişim kontrolü ile kapsamlı bir kullanıcı ve içerik yönetim sistemine sahiptir.

</details>

---

## Features | Özellikler

- **JWT Authentication**: Secure authentication using JSON Web Tokens (`accessToken` and `refreshToken`).
- **Role-Based Access Control**: Differentiated permissions for `member`, `moderator`, and `admin` roles.
- **Full CRUD Operations**: Complete management for Posts, Categories, Tags, Comments, and Users.
- **Soft Delete**: Most data is not permanently deleted, allowing for recovery.
- **Postman Collection**: Includes a pre-configured Postman collection for easy testing.

---

## Tech Stack | Teknoloji Yığını

- **Backend**: Node.js, Express.js, TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JSON Web Token (jsonwebtoken)
- **Password Hashing**: Argon2 (@node-rs/argon2)

---

## Getting Started | Kurulum ve Başlatma

<details open>
<summary><strong>Türkçe Kurulum</strong></summary>

### Gereksinimler
- Node.js (v18+)
- npm
- PostgreSQL

### Adımlar

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/asmaydn28/blog-db.git
    cd blog-db
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Ortam Değişkenlerini Ayarlayın:**
    Proje ana dizininde `.env` adında bir dosya oluşturun ve aşağıdaki gibi doldurun:
    ```env
    # PostgreSQL veritabanı bağlantı adresiniz
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"

    # JWT için kullanılacak gizli anahtarlar
    ACCESS_TOKEN_SECRET="YOUR_SUPER_SECRET_ACCESS_KEY"
    REFRESH_TOKEN_SECRET="YOUR_EVEN_MORE_SECRET_REFRESH_KEY"
    ```

4.  **Veritabanı Senkronizasyonu:**
    Veritabanı şemasını oluşturmak ve Prisma Client'ı hazırlamak için:
    ```bash
    npx prisma migrate dev
    ```

5.  **Uygulamayı Başlatın:**
    Geliştirme sunucusunu başlatmak için:
    ```bash
    npm run dev
    ```
    Sunucu `http://localhost:3000` adresinde çalışmaya başlayacaktır.

</details>

<details>
<summary><strong>English Setup</strong></summary>

### Prerequisites
- Node.js (v18+)
- npm
- PostgreSQL

### Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/asmaydn28/blog-db.git
    cd blog-db
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**
    Create a file named `.env` in the project root and fill it with the following:
    ```env
    # Your PostgreSQL database connection URL
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"

    # Secret keys for JWT
    ACCESS_TOKEN_SECRET="YOUR_SUPER_SECRET_ACCESS_KEY"
    REFRESH_TOKEN_SECRET="YOUR_EVEN_MORE_SECRET_REFRESH_KEY"
    ```

4.  **Database Synchronization:**
    To create the database schema and generate the Prisma Client:
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the Application:**
    To start the development server:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

</details>

---

## API Endpoints & Authorization | API Endpointleri & Yetkilendirme

Access to protected endpoints is controlled by roles. A `Bearer Token` must be provided in the `Authorization` header for authenticated routes.

| Resource | Endpoint | Method | Permissions | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/auth/register` | `POST` | Public | Registers a new user (as `member`). |
| | `/auth/login` | `POST` | Public | Logs in a user, returns tokens. |
| | `/auth/refresh` | `POST` | Public | Refreshes an access token. |
| **Users** | `/users` | `GET` | Public | Lists all non-deleted users. |
| | `/users/:id` | `GET` | Public | Gets a single user by ID. |
| | `/users` | `POST` | **Admin** | Creates a new user with a specific role. |
| | `/users/:id` | `PATCH` | **Admin** or **Owner** | Updates a user. Only Admins can change the `role`. |
| | `/users/:id` | `DELETE`| **Admin** or **Owner** | Soft-deletes a user. |
| **Categories**| `/categories` | `POST` | **Admin** | Creates a new category. |
| | `/categories/:id`| `PATCH` | **Admin** | Updates a category. |
| | `/categories/:id`| `DELETE`| **Admin** | Soft-deletes a category. |
| **Tags** | `/tags` | `POST` | **Admin** | Creates a new tag. |
| | `/tags/:id` | `PATCH` | **Admin** | Updates a tag. |
| | `/tags/:id` | `DELETE`| **Admin** | Deletes a tag. |
| **Posts** | `/posts` | `POST` | Authenticated | Creates a new post. |
| | `/posts/:id` | `PATCH` | **Admin**, **Moderator**, or **Owner** | Updates a post. |
| | `/posts/:id` | `DELETE`| **Admin** or **Owner** | Soft-deletes a post. |
| **Comments** | `/comments` | `POST` | Authenticated | Adds a comment to a post. |
| | `/comments/:id` | `PATCH` | **Owner** | Updates a comment's content. |
| | `/comments/:id` | `DELETE`| **Admin**, **Moderator**, **Post Owner**, or **Comment Owner** | Soft-deletes a comment. |

---

## Testing | Test Etme

This project includes a Postman collection file: `Blog Db Prisma.postman_collection.json`.

Import this file into your Postman application to easily test all available endpoints. The collection is pre-configured to use variables like `{{base_url}}`.

**Tip:** In the `Login` request's "Tests" tab, you can add a script to automatically save the `accessToken` to a collection variable, streamlining the testing of protected routes.

---
