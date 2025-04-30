"use client";

import { SnackbarProvider } from "notistack";
import { PropsWithChildren } from "react";
import { Slide } from "@mui/material";

const NotificationProvider = ({ children }: PropsWithChildren) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={3000}
      TransitionComponent={Slide}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;
