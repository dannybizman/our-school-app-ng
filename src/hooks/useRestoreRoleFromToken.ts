"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRole, resetRole } from "@/redux/slices/roleSlice";
import { jwtDecode } from "jwt-decode";
import { getLoggedInAdmin, getLoggedInTeacher, getLoggedInStudent, getLoggedInParent } from "@/utils/api";
import { UserRole, USER_ROLES } from "@/constants/roles";

type DecodedToken = {
  role: string; 
  exp: number;
}; 

const useRestoreRoleFromToken = () => {
  const dispatch = useDispatch();

  useEffect(() => {  
    const restoreRole = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(resetRole());
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          dispatch(resetRole());
          return;
        }

        const userRole = decoded.role as UserRole;
        if (!USER_ROLES.includes(userRole)) {
          dispatch(resetRole());
          return;
        }

        let avatarUrl = "";
        let firstName = "";
        let lastName = "";
        let schoolName = "";

        if (userRole === "admin") {
          const res = await getLoggedInAdmin(token);
          avatarUrl = res?.admin?.avatar?.url || "";
          firstName = res?.admin?.firstName || "";
          lastName = res?.admin?.lastName || "";
          schoolName = res?.admin?.school?.schoolName || "";
        } else if (userRole === "teacher") {
          const res = await getLoggedInTeacher(token);
          avatarUrl = res?.teacher?.avatar?.url || "";
          firstName = res?.teacher?.firstName || "";
          lastName = res?.teacher?.lastName || "";
          schoolName = res?.teacher?.school?.schoolName || "";
        } else if (userRole === "student") {
          const res = await getLoggedInStudent(token);
          avatarUrl = res?.student?.avatar?.url || "";
          firstName = res?.student?.firstName || "";
          lastName = res?.student?.lastName || "";
          schoolName = res?.student?.school?.schoolName || "";
        } else if (userRole === "parent") {
          const res = await getLoggedInParent(token);
          avatarUrl = res?.parent?.avatar?.url || "";
          firstName = res?.parent?.firstName || "";
          lastName = res?.parent?.lastName || "";
          schoolName = res?.parent?.school?.schoolName || "";
        }

        dispatch(setRole({ role: userRole, avatarUrl, firstName, lastName, schoolName }));

      } catch (error) {
        console.error("Failed to restore role from token", error);
        dispatch(resetRole());
      }
    };

    restoreRole();
  }, [dispatch]);
};

export default useRestoreRoleFromToken;
