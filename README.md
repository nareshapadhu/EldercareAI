# 🧓 Eldercare WhatsApp AI Chatbot

A fully functional WhatsApp-based AI companion for eldercare — featuring medicine reminders, daily check-ins, emergency alerts to family, and an onboarding assistant — powered by OpenRouter (free AI), Venom Bot, n8n, and Google Sheets.

---

## ✨ Features

- ✅ Free AI-powered conversation via OpenRouter API
- 📋 Easy onboarding of elder name, medicines, time slots, family contacts
- 🕒 Automatic daily check-ins via WhatsApp
- 🚨 Emergency alert system to family
- ⚙️ Integrated with n8n workflows for modular automation

---

## 🔧 Tech Stack

- **JavaScript** with `Node.js`
- **Venom Bot** for WhatsApp automation
- **n8n** for automation workflows
- **OpenRouter API** with a free model (e.g., `mistralai/Mixtral`) for AI chat

---

## 📂 Project Structure

| File / Folder           | Description                                  |
|-------------------------|----------------------------------------------|
| `index.js`              | Main server logic and WhatsApp message handler |
| `n8n-workflows/`        | Exports of all n8n automations                |
| `docs/`                 | Setup, deployment and integration guides     |
| `assets/`               | Images and screenshots                       |

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-username/eldercare-whatsapp-bot.git
cd eldercare-whatsapp-bot
npm install
cp .env.example .env # add your credentials
node index.js