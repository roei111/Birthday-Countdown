import RegisterForm from "../components/RegisterForm";
import { Container } from "@mui/material";

const Register = () => {
  return (
    <Container fixed sx={{ mt: 5 }}>
      <RegisterForm />
    </Container>
  );
};

export default Register;
