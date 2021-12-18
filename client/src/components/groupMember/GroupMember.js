import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { groupMembersActions } from "../../store";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Stack,
  ButtonGroup,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LoadingButton from "@mui/lab/LoadingButton";
import ConfirmDialog from "../../ui/ConfirmDialog";
import avatarMale from "../../images/avatarMale.png"
import avatarFemale from "../../images/avatarFemale.png"

const GroupMember = (props) => {
  const dispatch = useDispatch();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const editGroupmemberHandler = () => {
    dispatch(groupMembersActions.openEdit(props.groupMember));
  };

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTime]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  const { firstName, lastName, birthday, gender, age, _id, image } = props.groupMember;

  const enteredDate = new Date(birthday);
  let willBeAge = age;

  if (enteredDate.getMonth() < currentMonth) {
    enteredDate.setFullYear(currentYear + 1);
    willBeAge += 1;
  } else if (
    enteredDate.getMonth() === currentMonth &&
    enteredDate.getDate() < currentDate
  ) {
    enteredDate.setFullYear(currentYear + 1);
    willBeAge += 1;
  } else {
    enteredDate.setFullYear(currentYear);
  }

  enteredDate.setHours(0, 0, 0);

  const isBirthday =
    currentYear === enteredDate.getFullYear() &&
    enteredDate.getMonth() === currentMonth &&
    enteredDate.getDate() === currentDate;

  const countTime = enteredDate - currentTime;
  const remainingDays = Math.floor(countTime / day);
  const remainingHours = Math.floor((countTime % day) / hour);
  const remainingMinutes = Math.floor((countTime % hour) / minute);
  const remainingSeconds = Math.floor((countTime % minute) / second);

  return (
    <>
      <Card sx={{ padding: 0, width: { xs: 300, sm: 350 }, height: 400 }}>
        <CardMedia
          component="img"
          height="140"
          image={image ? image.url.replace('/upload','/upload/c_fill,g_face,h_140,w_350') :
            gender === "male"
              ? avatarMale
              : avatarFemale
          }
          alt="group member"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h4"
            component="div"
            textAlign="center"
            m={0}
          >
            {firstName + " " + lastName}
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center">
            {dayjs(birthday).format("DD/MM/YYYY")}
          </Typography>
          <Divider />

          {!isBirthday ? (
            <div>
              <Typography variant="h5" textAlign="center">
                {gender === "male"
                  ? `יהיה בן ${willBeAge} בעוד`
                  : `תהיה בת ${willBeAge} בעוד`}
              </Typography>

              <Stack
                direction="row"
                sx={{
                  justifyContent: { xs: "space-between", md: "space-evenly" },
                }}
              >
                <div>
                  <Typography variant="h2">{remainingSeconds}</Typography>
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    textAlign="center"
                  >
                    שניות
                  </Typography>
                </div>
                <div>
                  <Typography variant="h2">{remainingMinutes}</Typography>
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    textAlign="center"
                  >
                    דקות
                  </Typography>
                </div>
                <div>
                  <Typography variant="h2">{remainingHours}</Typography>
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    textAlign="center"
                  >
                    שעות
                  </Typography>
                </div>
                <div>
                  <Typography variant="h2">{remainingDays}</Typography>
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    textAlign="center"
                  >
                    ימים
                  </Typography>
                </div>
              </Stack>
            </div>
          ) : (
            <Typography variant="h5" fontWeight="600" textAlign="center" mt={3}>
              {gender === "male"
                ? `היום ${firstName} חוגג את יום הולדתו ה-${willBeAge} אחל לו מזל טוב!`
                : `היום ${firstName} חוגגת את יום הולדתה ה-${willBeAge} אחל לה מזל טוב!`}
            </Typography>
          )}

          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            fullWidth
            sx={{ mt: 2 }}
          >
            <Button onClick={editGroupmemberHandler} endIcon={<EditIcon />}>
              ערוך
            </Button>
            <LoadingButton
              color="error"
              loading={
                props.isLoading && props.deleteMemberId === _id ? true : false
              }
              onClick={() => {
                setConfirmDialogOpen(true);
              }}
              endIcon={<DeleteIcon />}
            >
              מחק
            </LoadingButton>
          </ButtonGroup>
        </CardContent>
      </Card>
      <ConfirmDialog
        title="מחיקת איש קשר"
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={() => {
          props.deleteGroupmemberHandler(_id);
        }}
      >
        אתה בטוח שאתה רוצה למחוק את איש הקשר?
      </ConfirmDialog>
    </>
  );
};

export default GroupMember;
