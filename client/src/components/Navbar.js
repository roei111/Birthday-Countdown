import { Typography, Button, AppBar, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions, uiActions, groupsActions, groupMembersActions } from "../store";

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const logoutHandler = () => {
    dispatch(userActions.logout());
    dispatch(groupsActions.removeAllGroups());
    dispatch(groupMembersActions.removeAllGroupMembers([]));
    dispatch(
      uiActions.showNotification({
        status: "success",
        message: "התנתקת בהצלחה, להתראות!",
      })
    );
  };

  return (
    <AppBar position="sticky">
      <Toolbar>

        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          <NavLink to="/" style={{ color: "white" }}>
            מארגן התאריכים
          </NavLink>
        </Typography>


        {!isLoggedIn ? (
          <>
            <Button
              component={NavLink}
              to="/login"
              color="primary"
              variant="contained"
            >
              התחברות
            </Button>
            <Button
              component={NavLink}
              to="/register"
              color="primary"
              variant="contained"
              sx={{ marginLeft: 2 }}
            >
              הרשמה
            </Button>
          </>
        ) : (
          <>
            <Button
              component={NavLink}
              to="/groups"
              color="primary"
              variant="contained"
            >
              כל הרשימות
            </Button>
            <Button
              component={NavLink}
              to="/"
              onClick={logoutHandler}
              color="primary"
              variant="contained"
              sx={{ marginLeft: 2 }}
            >
              התנתקות
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
