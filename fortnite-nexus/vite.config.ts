import { defineConfig, searchForWorkspaceRoot  } from 'vite'
import process from 'process'

// https://vite.dev/config/
  
export default defineConfig({
  server: {
    fs: {
      allow: [
        // search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
        // your custom rules
        'C:/Users/fukug/Documents/Fortnite-API/fortnite-nexus/.env',
      ],
    },
  },
})
