import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupsActions, uiActions, groupMembersActions } from "../store";
import FormAddGroup from "../components/group/FormAddGroup";
import GroupsList from "../components/group/GroupsList";
import { Container } from "@mui/material";
import Loader from "../ui/Loader";

const AllGroups = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    dispatch(groupMembersActions.removeAllGroupMembers([]));
    dispatch(groupMembersActions.closeEdit());
    const fetchData = async () => {
      window.scrollTo(0, 0);
      try {
        setIsLoading(true);
        const response = await fetch(`/api/groups`,{
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("העלאת המידע מהשרת נכשלה!");
        }
        const data = await response.json();
        dispatch(groupsActions.updateGroups(data));
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        dispatch(
          uiActions.showNotification({ status: "error", message: e.message })
        );
      }
    };
    fetchData();
  }, [dispatch, userData.token]);

  return (
    <>
      <Loader isLoading={isLoading} />
      <Container fixed sx={{ mt: 5, height: "100vh" }}>
        <GroupsList />
        <FormAddGroup />
      </Container>
    </>
  );
};

export default AllGroups;
