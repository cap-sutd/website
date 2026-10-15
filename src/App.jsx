import { Toaster } from "@/components/ui/toaster";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "@/pages/Home";
import SharedLayout from "@/components/SharedLayout"; // Import the new layout
import Team from "@/pages/Team";
import MemberDossier from "@/pages/MemberDossier";
import PageNotFound from "./lib/PageNotFound";
import Showcase from '@/pages/Showcase';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Pages WITHOUT the sidebar (Landing Page, 404 Error) */}
        <Route path="/" element={<Home />} />
        <Route path="/website/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Pages WITH the universal sidebar */}
        <Route element={<SharedLayout />}>
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:memberId" element={<MemberDossier />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;