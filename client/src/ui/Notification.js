import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useDispatch} from "react-redux";
import { uiActions } from "../store";

const Notification = (props) => {
const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    dispatch(uiActions.removeNotification());
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        variant="filled"
        severity={props.status}
        sx={{ width: "100%" }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
