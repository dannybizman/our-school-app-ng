"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";
import { useRouter, useSearchParams } from "next/navigation";
import { getLoggedInAdmin, getLoggedInParent, getLoggedInStudent, getLoggedInTeacher, loginAdmin, loginParent, loginStudent, loginTeacher } from "@/utils/api";
import { Input, Button, Form } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '@/redux/slices/roleSlice';
import { startLoading, stopLoading } from '@/redux/slices/loadingSlice';
import { RootState } from '@/redux/store';


const LoginPage = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role = roleParam && ['admin', 'teacher', 'parent', 'student'].includes(roleParam) ? roleParam : 'admin';
  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };

  const title = `Sign in as ${role}`;

  const onSubmit = async (data: any) => {
    dispatch(startLoading());
    try {
      let token = "";
      let firstName = "";

      if (role === "admin") {
        const res = await loginAdmin(data.email, data.password);
        token = res.token;
        const loggedIn = await getLoggedInAdmin(token);
        firstName = loggedIn.admin.firstName;
        dispatch(setRole({
          role: loggedIn.admin.role,
          avatarUrl: loggedIn.admin.avatar?.url || "",
          firstName,
          lastName: loggedIn.admin.lastName || ""
        }));
      } else if (role === "teacher") {
        const res = await loginTeacher(data.email, data.password);
        token = res.token;
        const loggedIn = await getLoggedInTeacher(token);
        firstName = loggedIn.teacher.firstName;
        dispatch(setRole({
          role: loggedIn.teacher.role,
          avatarUrl: loggedIn.teacher.avatar?.url || "",
          firstName,
          lastName: loggedIn.teacher.lastName || ""
        }));
      } else if (role === "parent") {
        const res = await loginParent(data.email, data.password);
        token = res.token;
        const loggedIn = await getLoggedInParent(token);
        firstName = loggedIn.parent.firstName;
        dispatch(setRole({
          role: loggedIn.parent.role,
          avatarUrl: loggedIn.parent.avatar?.url || "",
          firstName,
          lastName: loggedIn.parent.lastName || ""
        }));
      } else if (role === "student") {
        const res = await loginStudent(data.username, data.password);
        token = res.token;
        const loggedIn = await getLoggedInStudent(token);
        firstName = loggedIn.student.firstName;
        dispatch(setRole({
          role: loggedIn.student.role,
          avatarUrl: loggedIn.student.avatar?.url || "",
          firstName,
          lastName: loggedIn.student.lastName || ""
        }));
      }

      localStorage.setItem("token", token);

      enqueueSnackbar(`Welcome ${firstName}! Login successful`, {
        variant: "success",
        content: (key) => (
          <CustomSnackbar id={key} message={`Welcome ${firstName}! Login successful`} variant="success" />
        ),
      });

      reset();
      router.push(`/${role}`);
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed!";

      enqueueSnackbar(errorMessage, {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message={errorMessage} variant="error" />
        ),
      });

    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="App Logo"
            width={40}
            height={40}
            className="rounded-full mx-auto h-10 w-auto"
          />
        </Link>
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-6">

          {role === "student" && (
            <Form.Item
              label={<span className="text-sm text-gray-700 dark:text-white">Username</span>}
              validateStatus={errors.username ? "error" : ""}
              help={errors.username?.message?.toString()}
            >
              <Controller
                name="username"
                control={control}
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <Input {...field} className="!rounded-md" />
                )}
              />
            </Form.Item>
          )}


          {role !== "student" && (
            <Form.Item
              label={<span className="text-sm text-gray-700 dark:text-white">Email Address</span>}
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message?.toString()}
            >
              <Controller
                name="email"
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <Input {...field} type="email" className="!rounded-md" />
                )}
              />
            </Form.Item>
          )}


          <Form.Item
            label={<span className="text-sm text-gray-700 dark:text-white">Password</span>}
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message?.toString()}
          >
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <Input.Password {...field} className="!rounded-md" />
              )}
            />
            <div className="text-sm mt-1">
              <Link href="/password/reset" className="font-semibold text-black hover:text-syncSkyLight">
                Forgot password?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={loading} // ✨ use redux loading here
              className="w-full bg-syncSky hover:bg-syncPurpleLight text-white font-semibold transition-all duration-300 ease-in-out rounded-md py-2"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>

        {hasPermission(["admin"], role) ? (
          <>
            <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
              Not a member?{" "}
              <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Register your school
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
              Not a member?{" "}
              <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Contact your school admin..
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
