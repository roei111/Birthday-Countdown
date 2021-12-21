import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import { uiActions, userActions } from "../store";
import { useDispatch } from "react-redux";
import { Paper, TextField, Box, Typography, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  let history = useHistory();

  const sumbitHandler = async (data) => {
    const { username, email, password } = data;
    try {
      setIsLoading(true);
      const response = await fetch("/api/users/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const serverResponse = await response;
      if (!serverResponse.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      const Data = await serverResponse.json();
      dispatch(userActions.login({userData: Data}));
      setIsLoading(false);
      dispatch(
        uiActions.showNotification({
          status: "success",
          message: " נרשמת בהצלחה! ברוך/ה הבא/ה",
        })
      );
      history.push("/groups");
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(e.message);
    }
  };

  return (
    <Paper elevation={3}>
      <form onSubmit={handleSubmit(sumbitHandler)}>
        <Box
          sx={{ display: "grid", gridRowGap: "20px", padding: "20px" }}
          margin={{ sm: "10px 100px", md: "10px 200px", lg: "10px 300px" }}
        >
          <Typography variant="h5" textAlign="center">
            הרשמה לאתר
          </Typography>
          {isError ? (
            <Alert variant="filled" severity="error">
              {errorMessage}
            </Alert>
          ) : null}
          <Controller
            control={control}
            name="username"
            rules={{ required: "סעיף זה הוא חובה" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                helperText={error ? error.message : null}
                size="small"
                error={!!error}
                onChange={onChange}
                value={value}
                fullWidth
                label={"שם משתמש"}
                variant="outlined"
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            rules={{
              required: "סעיף זה הוא חובה",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "נא להזין כתובת אימייל תקנית",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                helperText={error ? error.message : null}
                size="small"
                error={!!error}
                onChange={onChange}
                value={value}
                fullWidth
                label={"אימייל"}
                variant="outlined"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{
              required: "סעיף זה הוא חובה",
              minLength: {
                value: 6,
                message: "סיסמה צריכה להכיל לפחות 6 תווים",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                type="password"
                helperText={error ? error.message : null}
                size="small"
                error={!!error}
                onChange={onChange}
                value={value}
                fullWidth
                label={"סיסמה"}
                variant="outlined"
              />
            )}
          />

          <LoadingButton
            loading={isLoading}
            variant="contained"
            color="success"
            type="sumbit"
          >
            הרשם
          </LoadingButton>
          <Typography variant="subtitle1" textAlign="center">
            כבר יש לך משתמש?
            <Link to="/login"> התחבר</Link>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
};

export default RegisterForm;
