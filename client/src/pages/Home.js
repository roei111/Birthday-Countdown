import { Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        backgroundColor="rgba(0, 0, 0, 0.7)"
        padding={3}
        spacing={2}
      >
        <Typography variant="h2" color="white" textAlign="center">
          מארגן התאריכים
        </Typography>

        <Typography variant="h4" color="white" textAlign="center">
          קרה לך פעם ששכחת את היום הולדת של חבר או קרוב משפחה?
        </Typography>

        <Typography variant="h6" color="white" textAlign="center">
          עם האתר החדש שמסדר לך את כל התאריכים ברשימות, סופר לך את כל הימים,
          השעות ואפילו את השניות לתאריך עצמו, כבר לא תשכח שום יום הולדת!
        </Typography>

        <Button
          component={Link}
          to={isLoggedIn ? "/groups" : "/login"}
          color="primary"
          variant="contained"
          size="large"
        >
          התחל עכשיו!
        </Button>
      </Stack>
    </div>
  );
};

export default Home;
