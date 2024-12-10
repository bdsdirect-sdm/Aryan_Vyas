import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'

import "react-datepicker/dist/react-datepicker.css";
  const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(

    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
 
)
