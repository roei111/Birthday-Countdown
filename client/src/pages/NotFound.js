import { Link } from "react-router-dom";
import { Typography, Container, Paper } from "@mui/material";

const NotFound = () => {
  return (
    <Container fixed sx={{ mt: 5, height: "100vh" }}>
      <Paper elevation={3}>
        <Typography variant="h1" textAlign="center">
          אופס!
        </Typography>
        <Typography variant="h2" textAlign="center">
          שגיאה 404
        </Typography>
        <Typography variant="h5" textAlign="center">
          נראה שהגעת לעמוד לא קיים
        </Typography>
        <Typography variant="h5" textAlign="center">
          <Link to="/"> חזרה לדף הבית</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default NotFound;
