import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { groupMembersActions, uiActions } from "../../store";
import GroupMember from "./GroupMember";
import { Grid } from "@mui/material";

const GroupMembersList = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const groupMembers = useSelector(
    (state) => state.groupMembers.groupMembersList
  );
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const groupId = props.groupId;
  const deleteGroupMember = async (groupMemberId) => {
    try {
      setIsLoading(true);
      setDeleteId(groupMemberId);
      const response = await fetch(
        `http://localhost:9000/groupmembers/${groupId}/${groupMemberId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("ישנה בעיה עם מחיקת איש הקשר, נסה שוב מאוחר יותר.");
      }
      const data = await response.json();
      dispatch(groupMembersActions.addAllGroupMembers(data.groupmembers));
      setIsLoading(false);
      dispatch(
        uiActions.showNotification({
          status: "success",
          message: "איש הקשר נמחק בהצלחה!",
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
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      justifyContent="space-evenly"
    >
      {groupMembers.length > 0 &&
        groupMembers.map((groupMember, index) => (
          <Grid item key={index}>
            <GroupMember
              key={groupMember._id}
              groupMember={groupMember}
              deleteGroupmemberHandler={deleteGroupMember}
              isLoading={isLoading}
              deleteMemberId={deleteId}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default GroupMembersList;
