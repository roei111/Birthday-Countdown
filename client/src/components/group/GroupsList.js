import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupsActions, uiActions } from "../../store";
import { Link } from "react-router-dom";
import {
  Stack,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  ButtonGroup,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import LaunchIcon from "@mui/icons-material/Launch";
import LoadingButton from "@mui/lab/LoadingButton";
import FormEditGroup from "./FormEditGroup";
import ConfirmDialog from "../../ui/ConfirmDialog";

const GroupsList = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.groupsList);
  const userData = useSelector((state) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const deleteGroup = async (groupId) => {
    try {
      setIsLoading(true);
      setDeleteId(groupId);
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("ישנה בעיה עם מחיקת הרשימה, נסה שוב מאוחר יותר.");
      }
      const data = await response.json();
      dispatch(groupsActions.updateGroups(data));
      setIsLoading(false);
      dispatch(
        uiActions.showNotification({
          status: "success",
          message: "הרשימה נמחקה בהצלחה!",
        })
      );
    } catch (e) {
      setIsLoading(false);
      dispatch(
        uiActions.showNotification({ status: "error", message: e.message })
      );
    }
  };

  const openEditGroup = (groupId) => {
    setEditId(groupId);
  };
  const closeEditGroup = () => {
    setEditId(null);
  };

  return (
    <>
      <Stack spacing={3} mb={3}>
        {groups.length > 0 &&
          groups.map((group, index) => (
            <Card
              sx={{ display: "flex", justifyContent: "space-between" }}
              key={index}
            >
              {editId !== group._id ? (
                <CardActionArea
                  component={Link}
                  to={`/groupmembers/${group._id}`}
                >
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {group.groupName}
                      <LaunchIcon
                        color="primary"
                        sx={{
                          marginLeft: 1,
                        }}
                      />
                    </Typography>
                  </CardContent>
                </CardActionArea>
              ) : null}
              {editId === group._id ? (
                <CardActions>
                  <FormEditGroup
                    groupName={group.groupName}
                    groupId={group._id}
                    closeEditGroupForm={closeEditGroup}
                  />
                </CardActions>
              ) : null}
              <CardActions>
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                >
                  {editId === group._id ? (
                    <Button
                      endIcon={<CancelIcon />}
                      onClick={() => {
                        closeEditGroup();
                      }}
                    >
                      ביטול
                    </Button>
                  ) : (
                    <Button
                      endIcon={<EditIcon />}
                      onClick={() => {
                        openEditGroup(group._id);
                      }}
                    >
                      ערוך
                    </Button>
                  )}
                  <LoadingButton
                    color="error"
                    loading={isLoading && deleteId === group._id ? true : false}
                    endIcon={<DeleteIcon />}
                    onClick={() => {
                      setConfirmDialogOpen(true);
                      setDeleteId(group._id);
                    }}
                  >
                    מחק
                  </LoadingButton>
                </ButtonGroup>
              </CardActions>
            </Card>
          ))}
      </Stack>
      <ConfirmDialog
        title="מחיקת רשימה"
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={() => {
          deleteGroup(deleteId);
        }}
      >
        אתה בטוח שאתה רוצה למחוק את הרשימה?
      </ConfirmDialog>
    </>
  );
};

export default GroupsList;
