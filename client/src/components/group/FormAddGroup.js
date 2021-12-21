import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupsActions, uiActions } from "../../store";
import { Paper, TextField, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";

const FormAddGroup = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      groupName: "",
    },
  });

  const sumbitHandler = async (data) => {
    const { groupName } = data;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups`, {
        method: "POST",
        body: JSON.stringify({
          groupName,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("ישנה בעיה עם הוספת הרשימה, נסה שוב מאוחר יותר.");
      }
      const data = await response.json();
      dispatch(groupsActions.updateGroups(data));
      setIsLoading(false);
      dispatch(
        uiActions.showNotification({
          status: "success",
          message: "הרשימה נוספה בהצלחה!",
        })
      );
    } catch (e) {
      setIsLoading(false);
      dispatch(
        uiActions.showNotification({ status: "error", message: e.message })
      );
    }
    reset();
  };

  return (
    <>
      <Paper elevation={3}>
        <form onSubmit={handleSubmit(sumbitHandler)}>
          <Box
            sx={{ display: "grid", gridRowGap: "20px", padding: "20px" }}
            margin={{ sm: "10px 100px", md: "10px 200px", lg: "10px 300px" }}
          >
            <Typography variant="h5">הוסף רשימת ימי הולדת חדשה</Typography>
            <Controller
              control={control}
              name="groupName"
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  helperText={error ? "סעיף זה הוא חובה" : null}
                  size="small"
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label={"שם הרשימה (לדוגמה: משפחה, חברים, עבודה)"}
                  variant="outlined"
                />
              )}
            />
            <LoadingButton
              loading={isLoading}
              variant="contained"
              type="sumbit"
            >
              הוסף
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </>
  );
};

export default FormAddGroup;
