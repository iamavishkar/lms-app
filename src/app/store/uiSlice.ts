import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

interface UIState {
  loading: boolean;
  snackbar: SnackbarState;
}

const initialState: UIState = {
  loading: false,
  snackbar: {
    open: false,
    message: "",
    severity: "success",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    showSnackbar(
      state,
      action: PayloadAction<Omit<SnackbarState, "open">>
    ) {
      state.snackbar = { ...action.payload, open: true };
    },
    hideSnackbar(state) {
      state.snackbar.open = false;
    },
  },
});

export const { setLoading, showSnackbar, hideSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
