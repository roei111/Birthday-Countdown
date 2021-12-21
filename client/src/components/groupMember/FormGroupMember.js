import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupMembersActions, uiActions } from "../../store";
import DatePicker from "@mui/lab/DatePicker";
import {
  Paper,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormHelperText,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@mui/icons-material/Cancel";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import ConfirmDialog from "../../ui/ConfirmDialog";

const FormGroupMember = (props) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const isEditing = useSelector((state) => state.groupMembers.isEditing);
  const userData = useSelector((state) => state.user.userData);
  const groupMemberOnEdit = useSelector(
    (state) => state.groupMembers.groupMemberOnEdit
  );
  const removeOldImage = useSelector(
    (state) => state.groupMembers.removeOldImage
  );

  const {
    firstName: editFirstName,
    lastName: editLastName,
    gender: editGender,
    birthday: editBirthday,
    _id: editGroupMemberId,
    image: editImage,
  } = groupMemberOnEdit;
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      birthday: null,
      image: null,
    },
  });
  useEffect(() => {
    setValue("firstName", editFirstName || "");
    setValue("lastName", editLastName || "");
    setValue("gender", editGender || "");
    setValue("birthday", editBirthday || null);
    setValue("editImage", editImage || null);
    setValue("removeOldImage", removeOldImage);
  }, [
    setValue,
    editFirstName,
    editLastName,
    editGender,
    editBirthday,
    editImage,
    removeOldImage,
  ]);

  const sumbitHandler = async (data) => {
    const formData = new FormData();
    for (const fieldName in data) {
      if (fieldName === "birthday") {
        formData.append(
          fieldName,
          dayjs(new Date(data[fieldName])).format("YYYY-MM-DD")
        );
      } else {
        if (fieldName === "editImage") {
          formData.append(fieldName, JSON.stringify(data[fieldName]));
        }
        formData.append(fieldName, data[fieldName]);
      }
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        isEditing
          ? `/api/groupmembers/${props.groupId}/${editGroupMemberId}`
          : `/api/groupmembers/${props.groupId}`,
        {
          method: isEditing ? "PUT" : "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("ישנה בעיה עם הוספת איש הקשר, נסה שוב מאוחר יותר.");
      }
      const data = await response.json();
      dispatch(groupMembersActions.addAllGroupMembers(data.groupmembers));
      setIsLoading(false);
      dispatch(
        uiActions.showNotification({
          status: "success",
          message: isEditing
            ? "איש הקשר נערך בהצלחה!"
            : "איש הקשר נוסף בהצלחה!",
        })
      );
      dispatch(groupMembersActions.closeEdit());
      reset();
      setIsUploadFile(false);
    } catch (e) {
      setIsLoading(false);
      dispatch(
        uiActions.showNotification({ status: "error", message: e.message })
      );
    }
  };

  useEffect(() => {
    formRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [isEditing, groupMemberOnEdit]);
  return (
    <>
      <Paper elevation={3} sx={{ marginTop: "25px" }} ref={formRef}>
        <form
          onSubmit={handleSubmit(sumbitHandler)}
          encType="multipart/form-data"
        >
          <Box
            sx={{ display: "grid", gridRowGap: "20px", padding: "20px" }}
            margin={{ sm: "10px 100px", md: "10px 200px", lg: "10px 300px" }}
          >
            {isEditing ? (
              <Button
                variant="contained"
                color="error"
                endIcon={<CancelIcon fontSize="large" />}
                onClick={() => {
                  dispatch(groupMembersActions.closeEdit());
                }}
              >
                ביטול עריכה
              </Button>
            ) : null}
            <Typography variant="h5" textAlign="center">
              {isEditing
                ? "ערוך את איש הקשר"
                : "הוסף אדם חדש לרשימת ימי ההולדת"}
            </Typography>

            <Controller
              control={control}
              name="firstName"
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
                  label={"שם פרטי"}
                  variant="outlined"
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
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
                  label={"שם משפחה"}
                  variant="outlined"
                />
              )}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">מין</FormLabel>
              <Controller
                name="gender"
                control={control}
                rules={{ required: true }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <RadioGroup value={value} onChange={onChange}>
                    <FormControlLabel
                      value="male"
                      label="זכר"
                      control={<Radio />}
                    />
                    <FormControlLabel
                      value="female"
                      label="נקבה"
                      control={<Radio />}
                    />
                    {error ? (
                      <FormHelperText error={!!error}>
                        סעיף זה הוא חובה
                      </FormHelperText>
                    ) : null}
                  </RadioGroup>
                )}
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">תמונה</FormLabel>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => (
                  <Button
                    variant="contained"
                    component="label"
                    color={isUploadFile ? "success" : "primary"}
                    sx={{ width: { sm: "60%", md: "40%", lg: "30%" } }}
                    endIcon={
                      isUploadFile ? <CheckIcon /> : <AddPhotoAlternateIcon />
                    }
                  >
                    {isUploadFile ? "התמונה הועלתה" : "בחר תמונה"}
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        onChange(e.target.files[0]);
                        setIsUploadFile(true);
                      }}
                    />
                  </Button>
                )}
              />
            </FormControl>
            {editImage && !removeOldImage && !isUploadFile ? (
              <Button
                variant="contained"
                color="error"
                sx={{ width: { sm: "60%", md: "40%", lg: "30%" } }}
                endIcon={<DeleteIcon />}
                onClick={() => {
                  setConfirmDialogOpen(true);
                }}
              >
                מחק תמונה נוכחית
              </Button>
            ) : null}
            <Controller
              control={control}
              name="birthday"
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DatePicker
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="תאריך לידה"
                  variant="outlined"
                  openTo="year"
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="תאריך לידה"
                      error={!!error}
                      helperText={error ? "סעיף זה הוא חובה" : null}
                    />
                  )}
                />
              )}
            />

            <LoadingButton
              loading={isLoading}
              variant="contained"
              type="sumbit"
            >
              {isEditing ? "אישור עריכה" : "הוסף"}
            </LoadingButton>
          </Box>
        </form>
      </Paper>
      <ConfirmDialog
        title="מחיקת תמונה"
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={() => {
          dispatch(groupMembersActions.removeImage());
        }}
      >
        אתה בטוח שאתה רוצה למחוק את התמונה?
      </ConfirmDialog>
    </>
  );
};

export default FormGroupMember;
