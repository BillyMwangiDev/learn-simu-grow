import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound";
import { AppProvider } from "@/state/AppContext";
import { Onboarding, Home as HomePage, Category, Course, Player as PlayerPage, VoiceLesson, Assessment, TeacherUpload, Jobs } from "./pages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/category" element={<Category />} />
            <Route path="/course/:id" element={<Course />} />
            <Route path="/player/:id" element={<PlayerPage />} />
            <Route path="/voice" element={<VoiceLesson />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/upload" element={<TeacherUpload />} />
            <Route path="/jobs" element={<Jobs />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);



export default App;
