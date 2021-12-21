import LoginForm from "../components/LoginForm";
import { Container } from "@mui/material";

const Login = () => {
  return (
    <Container fixed sx={{ mt: 5, height: "100vh" }}>
      <LoginForm />
    </Container>
  );
};

export default Login;
