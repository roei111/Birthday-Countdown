import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupsActions, uiActions } from "../../store";
import { TextField, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";

const FormEditGroup = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      groupName: props.groupName,
    },
  });

  const sumbitHandler = async (data) => {
    const { groupName } = data;
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:9000/groups/${props.groupId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            groupName,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("ישנה בעיה עם הוספת הרשימה, נסה שוב מאוחר יותר.");
      }
      const data = await response.json();
      dispatch(groupsActions.updateGroups(data));
      setIsLoading(false);
      props.closeEditGroupForm();
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
  };

  return (
    <>
      <form onSubmit={handleSubmit(sumbitHandler)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            paddingY: "20px",
          }}
        >
          <Controller
            control={control}
            name="groupName"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                helperText={error ? "סעיף זה הוא חובה" : null}
                size="small"
                error={!!error}
                onChange={onChange}
                value={value}
                fullWidth
                label={"שם הרשימה"}
                variant="outlined"
              />
            )}
          />
          <LoadingButton
            sx={{
              marginTop: { xs: "10px", sm: "0" },
              marginLeft: { sm: "10px" },
            }}
            loading={isLoading}
            variant="contained"
            fullWidth
            type="sumbit"
          >
            החל
          </LoadingButton>
        </Box>
      </form>
    </>
  );
};

export default FormEditGroup;
