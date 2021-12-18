import { CircularProgress, Backdrop } from "@mui/material";

const Loader = (props) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={props.isLoading}
    >
      <CircularProgress size={40} thickness={4}/>
    </Backdrop>
  );
};

export default Loader;
