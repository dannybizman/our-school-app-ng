"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import NotificationProvider from "@/components/NotificationProvider";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

function RestoreRole() {
  useRestoreRoleFromToken();
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <RestoreRole />
        {children}
      </NotificationProvider>
    </Provider>
  );
}
