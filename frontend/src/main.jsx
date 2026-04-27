import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App.jsx'

import { HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#FF76B8',
                borderRadius: 24,
                fontFamily: "'Outfit', sans-serif",
                colorBgContainer: '#ffffff',
              },
              components: {
                Button: {
                  fontWeight: 900,
                  controlHeight: 48,
                },
                Input: {
                  controlHeight: 52,
                  borderRadius: 20,
                },
                Card: {
                  borderRadiusLG: 32,
                }
              }
            }}
          >
            <App />
          </ConfigProvider>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)
