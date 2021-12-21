import RegisterForm from "../components/RegisterForm";
import { Container } from "@mui/material";

const Register = () => {
  return (
    <Container fixed sx={{ mt: 5, height: "100vh" }}>
      <RegisterForm />
    </Container>
  );
};

export default Register;
