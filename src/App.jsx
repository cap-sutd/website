import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "@/pages/Home";
import TeamLayout from "@/components/TeamLayout";
import Team from "@/pages/Team";
import MemberDossier from "@/pages/MemberDossier";
import PageNotFound from "./lib/PageNotFound";

function App() {
  return (
    <Router basename="/Capstone">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Capstone/" element={<Home />} />
        <Route path="/team" element={<TeamLayout />}>
          <Route index element={<Team />} />
          <Route path=":memberId" element={<MemberDossier />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
