# Custom Printing Website

A modern, responsive e-commerce website for custom printing services. This platform allows users to customize and order various products including clothing, accessories, and home decor items with their own designs.

## 🌟 Features

- **Product Customization**: Interactive design tool for personalizing products
- **Responsive Design**: Fully responsive website that works on all devices
- **Shopping Cart**: User-friendly shopping cart system with persistent storage
- **User Accounts**: Personal account management and order tracking
- **Community Section**: Space for users to share and showcase their designs
- **Theme Toggle**: Persistent dark/light mode toggle with system preference detection
- **Secure Payments**: Integrated Stripe payment processing with card validation
- **Smart Shopping**: AI-assisted product recommendations
- **AR Preview**: Augmented reality product preview capability
- **3D Viewer**: Interactive 3D product visualization
- **Social Features**: Community interaction and design sharing
- **Lazy Loading**: Optimized image loading for better performance

## 🛠️ Technologies Used

- HTML5 & CSS3
- JavaScript (ES6+)
- Node.js & Express (Backend)
- SQLite Database
- Stripe Payment API
- Font Awesome Icons
- AOS (Animate On Scroll) library
- Intersection Observer API
- Local Storage API

## 📂 Project Structure

```
printing/
├── backend/
│   ├── server.js (main server file)
│   ├── db.js (database configuration)
│   ├── imprimini.db (SQLite database)
│   ├── routes/ (API endpoints)
│   └── migrations/ (database migrations)
├── css/
│   ├── styles.css (core styles)
│   ├── admin.css
│   ├── cart.css
│   └── products.css
├── js/
│   ├── script.js (core functionality)
│   ├── card-payment.js (Stripe integration)
│   ├── account.js (user management)
│   ├── products.js (product handling)
│   ├── cart.js (shopping cart)
│   ├── customizer.js (product customization)
│   ├── 3d-viewer.js (3D product visualization)
│   ├── ar-preview.js (AR functionality)
│   ├── ai-assistant.js (smart shopping)
│   └── social-features.js (community features)
├── img/
│   ├── product/ (product images)
│   └── hero/ (hero section images)
├── data/
│   └── products.json (product catalog)
├── includes/
│   └── header.html (reusable components)
└── HTML files
    ├── index.html (home)
    ├── products.html (product catalog)
    ├── customize.html (product customization)
    ├── cart.html (shopping cart)
    ├── checkout.html (payment process)
    ├── order-confirmation.html
    ├── orders.html (order history)
    ├── account.html (user profile)
    ├── account-settings.html
    ├── admin.html (admin dashboard)
    ├── contact.html
    ├── about.html
    └── community.html (social features)
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Iyed2410/Imprimini.git
```

2. Install dependencies:
```bash
cd Imprimini
npm install
```

3. Set up environment variables:
- Create a `.env` file in the backend directory
- Add your Stripe API keys and other configuration

4. Initialize the database:
```bash
cd backend
node migrate.js
```

5. Start the server:
```bash
node server.js
```

6. Open `index.html` in your web browser to view the website locally.

## 🔒 Security Features

- Secure payment processing with Stripe
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure password hashing
- Session management

## 🎨 Customization Options

- Multiple size options
- Various color choices
- Different printing methods:
  - Digital Printing
  - Embroidery
  - Heat Transfer
  - Screen Printing
  - DTG (Direct to Garment)
- Material options
- Frame selections (for decor items)
- Custom design upload
- Text customization
- Design templates

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Iyed2410/Imprimini/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Website: https://iyed2410.github.io/Imprimini/
- Email: [e-mail-me](mailto:iyedkolsi123@gmail.com)
- Phone: +216-21-457-407

## 🙏 Acknowledgments

- Font Awesome for icons
- AOS library for scroll animations
- Stripe for payment processing
- All contributors who have helped with the project

---
Made with ❤️ by [Iyed Kolsi](https://iyed2410.github.io/Imprimini/)
