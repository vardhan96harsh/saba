import './App.css';
import './index.css';
import { ApiProvider } from './components/contexts/ApiContext';
import AppWrapper from './components/AppWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ParentComponent from "./components/admin/ParentComponent";
 // Adjust the path if necessary

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApiProvider>
      <AppWrapper>
        <ParentComponent /> {/* Use the ParentComponent */}
      </AppWrapper>
    </ApiProvider>
  </QueryClientProvider>
);

export default App;
