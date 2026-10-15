import { Toaster } from "@/components/ui/toaster";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "@/pages/Home";
import SharedLayout from "@/components/SharedLayout";
import Team from "@/pages/Team";
import MemberDossier from "@/pages/MemberDossier";
import PageNotFound from "./lib/PageNotFound";
import Showcase from '@/pages/Showcase';
import Faq from "@/pages/Faq";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/website/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Universal Layout */}
        <Route element={<SharedLayout />}>
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:memberId" element={<MemberDossier />} />
          <Route path="/faq" element={<Faq />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;