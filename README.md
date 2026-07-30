# 🪑 Furnix Neon — Modern Furniture E-Commerce Website

> Officially participating in
## ECSOC26
## ELUSOC 2026
## SSOC 2026

> A sleek and modern furniture shopping platform with a neon-inspired UI, built for smooth performance and elegant user experience.

🌐 **Live Demo:** https://furnix-neon.vercel.app/

---

## ✨ Overview

**Furnix Neon** is a modern furniture e-commerce website designed to showcase premium furniture collections with a visually appealing neon aesthetic.

It focuses on:
- Clean UI
- Smooth interactions
- Fast performance
- Responsive design across all devices

---

## 🚀 Features

- 🛋️ Modern furniture product showcase  
- 🛒 Add to cart & remove items functionality  
- ❤️ Wishlist / favorites support  
- 🔍 Easy product browsing UI  
- 📱 Fully responsive (mobile + tablet + desktop)  
- ⚡ Fast and optimized frontend performance  
- 🎨 Neon-themed modern UI design  
- 💾 Local storage support for cart persistence  

---

## 📸 Screenshots

### 🔐 Login Page
![Login Page](./images/screenshots/login.png)

---

### 🛍️ Collections Page
![Collections](./images/screenshots/collections.png)
---

### 🛋️ Modern Furniture Showcase 
![Search](./images/screenshots/furniture.png)
---

### 🛒 Shopping Cart
![Cart](./images/screenshots/cart.png)

---

### ❤️ Wishlist

![Wishlist](./images/screenshots/wishlist.png)


---

## 🧰 Tech Stack

- **HTML5** → Structure  
- **CSS3** → Styling & neon UI design  
- **JavaScript (ES6)** → Interactivity & cart logic  
- **Vercel** → Deployment  

---
## 🛠️ Installation

```bash
git clone https://github.com/your-username/Furnix-Neon.git
cd Furnix-Neon
open index.html
```

---

## 🔐 Environment Variables

This project uses environment variables to configure the backend server for local development.

### Create a `.env` File

Create a `.env` file in the project root directory (the same location as `server.js`).

### Example

```env
PORT=5000
```

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `PORT` | Specifies the port on which the Express server runs. If this variable is not set, the server automatically uses port `5000`. | `5000` |

### Security Notes

- Never commit your `.env` file or any sensitive credentials to the repository.
- Keep environment-specific configuration values private.
- The project's `.gitignore` already excludes `.env` and `.env.local` files from version control.
- If additional environment variables are introduced in the future, update this section accordingly.

## 📁 Project Structure

```text
Furnix-Neon/
├── index.html
├── style.css
├── app.js
├── ARCHITECTURE.md
├── docs/
│   └── DEPLOYMENT.md
├── scripts/
├── images/
└── README.md
```

## 📖 Architecture & Developer Documentation
- See [ARCHITECTURE.md](ARCHITECTURE.md) for system architecture overview.
- See [STOREFRONT_ARCHITECTURE.md](docs/STOREFRONT_ARCHITECTURE.md) for deep storefront subsystem specs & data flows.
- See [CLIENT_API_REFERENCE.md](docs/CLIENT_API_REFERENCE.md) for JavaScript client modules API reference.
- See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel & Docker deployment guides.

### 🧪 Environment Diagnostics
Run local workspace file & module check:
```bash
node scripts/dev-environment-check.js
```

## 🤝 Contributing

Contributions are welcome! This project is open source under **SSoC 2026**, **ECSOC26**, **ELUSOC**.

1. Fork the repository
2. Create your branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request
