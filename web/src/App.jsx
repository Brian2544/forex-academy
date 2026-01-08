import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import WhatsAppButton from './components/common/WhatsAppButton';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0D1324',
                color: '#F5F7FF',
                border: '1px solid rgba(255,255,255,0.12)'
              },
              success: {
                iconTheme: {
                  primary: '#D8B547',
                  secondary: '#0D1324'
                }
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#0D1324'
                }
              }
            }}
          />
          <AppRoutes />
          <WhatsAppButton />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

