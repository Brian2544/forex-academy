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
                background: '#1f2937',
                color: '#f3f4f6',
                border: '1px solid #374151'
              },
              success: {
                iconTheme: {
                  primary: '#D4AF37',
                  secondary: '#1f2937'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#1f2937'
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

