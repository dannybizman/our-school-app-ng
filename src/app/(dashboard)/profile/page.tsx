"use client";

import { useEffect } from "react";
import { Button, Tooltip, Card, Avatar, Descriptions, Spin, Empty } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";
import { RootState } from "@/redux/store";

const ProfilePage = () => {
   const dispatch = useDispatch();
   const { value: role, avatarUrl, firstName, lastName, schoolName, birthday, loaded } = useSelector(
      (state: RootState) => state.role
   );

   useRestoreRoleFromToken();

   const handleEditProfile = () => {
      console.log(`Edit profile clicked for ${role}`);
   };

   if (!loaded) {
      return (
         <div className="flex justify-center items-center h-64">
            <Spin size="large" />
         </div>
      );
   }

   if (role === "guest") {
      return (
         <div className="flex justify-center items-center h-64">
            <Empty description="No profile found. Please login." />
         </div>
      );
   }

   return (
      <div className="max-w-6xl mx-auto px-6 py-8">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold capitalize text-gray-800 dark:text-white tracking-wide">
               {role} Profile
            </h1>
            <Tooltip title="Edit Profile">
               <Button
                  type="primary"
                  shape="round"
                  icon={<EditOutlined />}
                  className="bg-syncOrange border-none"
                  onClick={handleEditProfile}
               >
                  Edit
               </Button>
            </Tooltip>
         </div>

         <div className="flex flex-col md:flex-row md:gap-12 gap-8">
            {/* Left Card */}
            <Card
               className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl border-none shadow-xl w-full md:w-1/3"
               bordered={false}
            >
               <div className="flex flex-col items-center gap-8 py-8">
                  <Avatar
                     size={140}
                     src={avatarUrl}
                     icon={<UserOutlined />}
                     className="border-4 border-white shadow-lg dark:border-gray-700"
                  />
                  <div className="text-center space-y-3">
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {firstName} {lastName}
                     </h2>
                     <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">Role</p>
                     <p className="text-xl font-semibold capitalize text-gray-800 dark:text-white">{role}</p>
                  </div>
               </div>
            </Card>

            {/* Right Card */}
            <Card
               className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl border-none shadow-xl w-full md:w-2/3"
               bordered={false}
               bodyStyle={{ padding: '32px' }}
            >
               <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mt-12 mb-12">User Information</h3>
               <Descriptions
                  column={{ xs: 1, sm: 1, md: 2 }} // 1 col on xs/sm screens, 2 cols on md+
                  labelStyle={{
                     color: '#6b7280',
                     fontSize: '14px',
                  }}
                  contentStyle={{
                     color: '#111827',
                     fontWeight: 500,
                  }}
                  className="dark:text-white mt-12"
               >
                  <Descriptions.Item label="First Name">{firstName}</Descriptions.Item>
                  <Descriptions.Item label="Last Name">{lastName}</Descriptions.Item>
                  <Descriptions.Item label="School">{schoolName}</Descriptions.Item>
                  <Descriptions.Item label="Birthday">{birthday}</Descriptions.Item>
               </Descriptions>
            </Card>

         </div>
      </div>
   );
};

export default ProfilePage;
