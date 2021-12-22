import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "./store";
import Navbar from "./components/Navbar";
import Notification from "./ui/Notification";
import DateAdapter from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { ThemeProvider } from "@mui/styles";
import CustomTheme from "./themes/CustomTheme";
import Register from "./pages/Register";
import AllGroupMembers from "./pages/AllGroupMembers";
import Login from "./pages/Login";
import AllGroups from "./pages/AllGroups";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const App = () => {
  const notification = useSelector((state) => state.ui.notification);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      const logoutTime = localStorage.getItem("logoutTime");
      if (logoutTime < new Date().getTime()) {
        dispatch(userActions.logout());
      }
    }
  }, [dispatch, isLoggedIn]);

  return (
    <ThemeProvider theme={CustomTheme}>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <div>
          <Navbar />
          {notification ? (
            <Notification
              status={notification.status}
              message={notification.message}
            />
          ) : null}

          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/groupmembers/:groupId">
              {isLoggedIn ? <AllGroupMembers /> : <Login />}
            </Route>
            <Route path="/groups" exact>
              {isLoggedIn ? <AllGroups /> : <Login />}
            </Route>
            <Route path="/register">
              {!isLoggedIn ? <Register /> : <Home />}
            </Route>
            <Route path="/login">{!isLoggedIn ? <Login /> : <Home />}</Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
