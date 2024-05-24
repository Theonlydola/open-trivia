import { Routes, Route, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Home, Categories, Quiz, Results } from "./components";
import { ThemeProvider } from "styled-components";
import { SessionProvider, ScoreProvider } from "./contexts";

const queryClient = new QueryClient();

const theme = {
  base: "#f2f2f2",
  base100: "#b6b6b6",
  base200: "#9cadce",
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={`/${import.meta.env.BASE_URL}`}>
          <SessionProvider>
            <ScoreProvider>
              <Routes>
                <Route path="/*" element={<Home />} />
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
              </Routes>
            </ScoreProvider>
          </SessionProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
