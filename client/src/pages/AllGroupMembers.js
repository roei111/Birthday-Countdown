import GroupMembersList from "../components/groupMember/GroupMembersList";
import FormGroupMember from "../components/groupMember/FormGroupMember";
import { groupMembersActions, uiActions } from "../store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import Loader from "../ui/Loader";

const AllGroupMembers = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const params = useParams();
  const { groupId } = params;
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/groupmembers/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("העלאת המידע מהשרת נכשלה!");
        }
        const data = await response.json();
        dispatch(groupMembersActions.addAllGroupMembers(data.groupmembers));
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        dispatch(
          uiActions.showNotification({ status: "error", message: e.message })
        );
      }
    };
    fetchData();
  }, [dispatch, groupId, userData.token]);

  return (
    <>
      <Loader isLoading={isLoading} />
      <Container fixed sx={{ mt: 5, height: "100vh" }}>
        <GroupMembersList groupId={groupId} />
        <FormGroupMember groupId={groupId} />
      </Container>
    </>
  );
};

export default AllGroupMembers;
