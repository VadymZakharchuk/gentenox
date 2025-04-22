# Gentenox—Vue 3 Chat Application

## Project Overview

Gentenox – це клієнтський додаток для чату, розроблений з використанням Vue 3, TypeScript та Tailwind CSS. Він забезпечує обмін текстовими повідомленнями, зображеннями та відео в режимі реального часу через WebSocket.

## Setup Instructions

1. **Prerequisites:** Node.js та npm повинні бути встановлені.
2. **Clone the repository:** `git clone https://github.com/VadymZakharchuk/gentenox.git`
3. **Install dependencies:** `npm install`
4. **Set environment variables:** Створіть файл `.env` в кореневому каталозі проєкту та встановіть змінну `VITE_CHAT_URL` на URL вашого WebSocket сервера (приклад у файлі `.env`).
5. **Clone the repository:** `git clone https://github.com/VadymZakharchuk/chat-server.git`
6. **Install dependencies:** `npm install`
7. **Run the development server:** `npm run dev`
8. **Build for production:** `npm run build`

## Architecture Overview

Проєкт використовує наступні технології:

* **Vue 3:** Фреймворк JavaScript для побудови інтерфейсу користувача.
* **TypeScript:** Мова програмування, що додає статичну типізацію до JavaScript.
* **Tailwind CSS:** Утилітарний фреймворк CSS для швидкої стилізації.
* **Vite:** Інструмент збірки для швидкої розробки.
* **Pinia:** Бібліотека для управління станом додатка.
* **Vue Router:** Бібліотека для маршрутизації в додатку.
* **WebSocket:** Протокол для двостороннього зв'язку в реальному часі.
* **Axios:** Бібліотека HTTP-клієнта для виконання API-запитів.

## Components Structure

* **App.vue:** Кореневий компонент додатку.
* **Home.vue:** Основний компонент, що містить Sidebar та ChatWindow.
* **Sidebar.vue:** Бічна панель зі списком діалогів.
* **ChatWindow.vue:** Вікно чату для відображення повідомлень та надсилання нових.
* **ChatArea.vue:** Компонент відображення історії повідомлень в ChatWindow.vue
* **ChatMessage.vue:** Компонент відображення повідомлення в ChatArea.vue
* **ChatInputArea.vue:** Компонент уводу тексту / додавання файлу в поточному діалозі
* **DefaultLayout.vue:** Компонент макета за замовчуванням.

## API Service

API-запити обробляються за допомогою `apiService.ts`, який надає наступні функції:

* `getProfile(id: string)`: Отримує профіль користувача за ID.
* `getDialogs(offset: number, limit: number, participantId: string | null)`: Отримує список діалогів.
* `getMessages(dialogId: string, offset: number, limit: number)`: Отримує повідомлення для вказаного діалогу.

## Assumptions Made

* **Backend API:** Передбачається наявність backend API, що відповідає на запити, визначені в `apiService.ts`.
* **WebSocket Server:** Передбачається наявність WebSocket сервера за адресою, вказаною в `.env` файлі.
* **Authentication:** Наразі автентифікація не реалізована. Передбачається, що ідентифікатор користувача (`userId`) жорстко закодований.
* **Data Persistence:** Повідомлення та діалоги не зберігаються локально, тому вони будуть утрачені після перезавантаження сторінки.
