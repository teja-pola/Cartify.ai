# CartifyAI

---

## 🛒 What is CartifyAI?

CartifyAI is a universal AI shopping agent that can be integrated into any e-commerce platform. It acts as a smart, conversational shopping companion, helping users find products, optimize their budget, and enjoy a personalized shopping experience—all through natural conversation and advanced AI.
<!-- If the image is not showing, try using a relative path from the README location, or use Markdown syntax: -->
![CartifyAI Logo](CartifyAI-logo.png)
<!-- If the image still does not appear, ensure CartifyAI-logo.png exists in the same directory as this README. -->
---

## ✨ Key Features

- **Direct Search**: Instantly find products using natural language queries—no more clunky filters or endless scrolling.
- **Emotion Intelligence**: Understands user sentiment and adapts recommendations to match your mood and intent.
- **Budget Optimization**: Smartly suggests the best products within your budget, maximizing value for every purchase.
- **Voice-Enabled**: Shop hands-free with high-quality voice interactions powered by ElevenLabs.
- **Real-Time Product Data**: Fetches up-to-date Walmart product info using SerpAPI.
- **Persistent Cart**: Keeps your cart and shopping context across sessions.
- **Universal Widget**: Easily embeddable on any e-commerce site.

---

## ⚙️ How It Works

1. **Conversational AI**: Users interact with CartifyAI via chat or voice. The agent understands intent, mood, and preferences.
2. **Product Discovery**: CartifyAI fetches real-time product data from Walmart (via SerpAPI) and recommends the best matches.
3. **Personalized Experience**: The agent adapts to user emotions and budget, optimizing recommendations and cart suggestions.
4. **Seamless Checkout**: Users can add items to their cart and proceed to checkout—all within the CartifyAI widget.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CartifyAI-Walmart.git
cd CartifyAI-Walmart
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory and add your API keys and configuration:
```
# Example .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SERPAPI_KEY=your_serpapi_key
GROQ_API_KEY=your_groq_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Start the backend
```bash
npx ts-node src/server/serpapi-proxy.ts
```

---

## 🛠️ Technologies Used
- **TypeScript & React**
- **Vite**
- **Tailwind CSS**
- **Supabase (PostgreSQL, Auth, Edge Functions)**
- **Groq API (Llama Model)**
- **SerpAPI**
- **ElevenLabs API**
- **Node.js / Deno**
- **Zustand**

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙌 Contributing

Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

---

## Netlify Deployment Notes

- The backend SerpAPI proxy is now a Netlify Function at `/.netlify/functions/serpapi-proxy`.
- The frontend fetches products using this function.
- The `preinstall` script in `package.json` ensures `npm install --legacy-peer-deps` is used for Netlify compatibility.
- Set your environment variables (e.g., `SERPAPI_KEY`) in the Netlify dashboard.

---

> **CartifyAI – Your Smartest Shopping Companion!** 