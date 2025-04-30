"use client"
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { useState } from "react";
import { createParent } from "@/utils/api"; // Updated import
import { Parent } from "@/types/parent"; // Import the Teacher type
import { useNotifications } from 'reapop';


type Inputs = Omit<Parent, "_id" | "createdAt" | "updatedAt" | "role">;



const ParentForm = ({ type }: { type: "create" | "update" }) => {
   const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
   const [loading, setLoading] = useState(false);
   const { notify } = useNotifications();
   const onSubmit = async (data: Inputs) => {
      setLoading(true);

      try {
         const formData = new FormData();
         formData.append("role", "teacher");
         formData.append("username", data.username);
         formData.append("email", data.email);
         formData.append("password", data.password);
         formData.append("name", data.firstName); // Ensure name field is correct
         formData.append("surname", data.lastName); // Ensure surname field is correct
         formData.append("phone", data.phoneNumber);
         formData.append("address", data.address);
         formData.append("bloodType", data.bloodType);
         formData.append("birthday", data.birthday);
         formData.append("sex", data.sex);

         const token = localStorage.getItem("token");
         if (!token) {
            notify({message: "Authentication error: Token missing.", status:'success'});
            return;
         }

         await createParent(formData, token);

        notify({message: "Parent created successfully!", status:'success'});
      } catch (error: any) {
        notify({message: error.message || "Failed to create parent.", status:'error'});
      } finally {
         setLoading(false);
      }
   };

   return ( 
      <>
         <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
            {/* <h1 className="text-xl font-semibold">{type === "create" ? "Create" : "Update"} Parent</h1> */}

            <span className="text-xs font-medium text-gray-400">Authentication Information</span>
            <div className="flex flex-wrap justify-between gap-4">
               <InputField label="Username" name="username" register={register} error={errors.username} />
               <InputField label="Email" name="email" type="email" register={register} error={errors.email} />
               <InputField label="Password" name="password" type="password" register={register} error={errors.password} />
            </div>

            <span className="text-xs font-medium text-gray-400">Personal Information</span>
            <div className="flex justify-between flex-wrap gap-4">
               <InputField label="First Name" name="firstName" register={register} error={errors.firstName} />
               <InputField label="Last Name" name="lastName" register={register} error={errors.lastName} />
               <InputField label="Phone" name="phoneNumber" register={register} error={errors.phoneNumber} />
               <InputField label="Address" name="address" register={register} error={errors.address} />
               <InputField label="Blood Type" name="bloodType" register={register} error={errors.bloodType} />
               <InputField label="Birthday" name="birthday" type="date" register={register} error={errors.birthday} />

               <div className="flex flex-col gap-2 w-full md:w-1/4">
                  <label className="text-xs text-gray-500">Sex</label>
                  <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-black text-sm w-full" {...register("sex")}>
                     <option value="MALE">Male</option>
                     <option value="FEMALE">Female</option>
                  </select>
               </div>

            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md" disabled={loading}>
               {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
            </button>


         </form>
      </>
   );


};

export default ParentForm;