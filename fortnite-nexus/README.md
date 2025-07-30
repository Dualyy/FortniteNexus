README Description
Here is a complete project description suitable for your README.md file.

FortniteNexus 🎮
FortniteNexus is a dynamic and responsive web application built for the Fortnite community. It allows players to look up their in-game statistics, compare their performance against others, and browse the current item shop in real-time.

!FortniteNexus Screenshot Placeholder

✨ Core Features
Player Stats Lookup: Fetch and display detailed stats for any Fortnite player by their Epic Games username.
Side-by-Side Comparison: Compare your stats directly against another player's in a clear, color-coded interface.
Dynamic Profile Cards: View player Battle Pass level, progress, and a unique, randomly-assigned profile picture from in-game cosmetics.
In-Depth Data Visualization: Interactive bar charts powered by Material-UI display K/D ratios, win rates, and total wins across Solo, Duo, and Squad modes.
Live Item Shop: A dedicated page that shows all the items currently available in the Fortnite store, categorized for easy browsing.
Global Dark/Light Mode: A sleek, user-toggleable theme is managed globally with React Context for a comfortable viewing experience.
🛠️ Technology Stack
Frontend: React, TypeScript
Routing: React Router
Data Fetching: Axios
State Management: React Context API
UI & Charting: Material-UI X Charts
Styling: CSS with CSS Variables for robust theming
Build Tool: Vite
🚀 How It Works
The application is a Single-Page Application (SPA) built with React. It interfaces with the public Fortnite-API.com to fetch all player and cosmetic data.

Client-side routing is handled by React Router, allowing for seamless navigation between the main stats page, the user overview, and the store.

Global state, specifically for the dark/light theme, is managed efficiently using a custom React Context (ThemeContext). This context is provided at the top level of the application in main.tsx, making it accessible to every component without prop drilling. A ThemeManager component listens for changes in this context and dynamically applies a .dark-mode class to the <body>, allowing for simple and powerful theming with CSS variables.
