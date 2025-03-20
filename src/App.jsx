import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import UserProfileForm from './components/UserProfile/UserProfileForm';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <UserProfileForm />
      </Container>
    </ThemeProvider>
  );
}

export default App
