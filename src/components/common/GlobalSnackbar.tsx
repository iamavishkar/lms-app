import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import type { RootState } from "../../app/store";
import { hideSnackbar } from "../../app/store/uiSlice";

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state: RootState) => state.ui.snackbar
  );

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
