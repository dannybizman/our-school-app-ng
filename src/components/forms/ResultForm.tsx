"use client";
import { useEffect, useState } from "react";
import { Button, Select, Form, Input } from "antd";
import { createResult, getAllAssignments, getAllExams, getAllTests, getAllStudents, updateResult } from "@/utils/api";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import { Exam } from "@/types/exam";
import { Test } from "@/types/test";
import { Assignment } from "@/types/assignment";

export default function ResultForm({
  type,
  data,
  onSuccess,
}: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}) {
  const [form] = Form.useForm();
  const [exams, setExams] = useState<Exam[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === "update" && data) {
      form.setFieldsValue({
        examId: data.examId,
        testId: data.testId,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
        examScore: data.examScore,
        testScore: data.testScore,
        assignmentScore: data.assignmentScore,
      });
    }
  }, [type, data, form]);




  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const studentsData = await getAllStudents(token);
      setStudents(studentsData);
    };
    fetchData();
  }, []);


  const fetchExams = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await getAllExams(token);
      setExams(response?.data?.exams || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);



  const fetchTests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await getAllTests(token || "");
      setTests(response.data.tests);
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || "Failed to fetch tests", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await getAllAssignments(token || "");
      setAssignments(response.data.assignments);
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || "Failed to fetch assignments", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);


  const onFinish = async (values: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      if (type === "create") {
        const response = await createResult({ ...values }, token);
        if (response?.data?.success) {
          enqueueSnackbar("Results created successfully!", {
            variant: "success",
            content: (key) => (
              <CustomSnackbar id={key} message="Results created successfully!" variant="success" />
            ),
          });
          form.resetFields();
          onSuccess?.();
        }
      } else if (type === "update" && data?._id) {
        const response = await updateResult(data._id, values, token);
        if (response?.data?.success) {
          enqueueSnackbar("Results updated successfully!", {
            variant: "success",
            content: (key) => (
              <CustomSnackbar id={key} message="Results updated successfully!" variant="success" />
            ),
          });
          form.resetFields();
          onSuccess?.();
        }
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      enqueueSnackbar(errorMsg, {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message={errorMsg} variant="error" />
        ),
      });
    }
  };




  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="flex flex-wrap gap-4"
    >
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item label="Exam" name="examId" rules={[{ required: true, message: 'Please select an exam' }]}>
          <Select
            showSearch
            placeholder="Select an Exam"
            optionFilterProp="children"
            allowClear
            className="text-black"
          >
            {exams.map((exam) => (
              <Select.Option key={exam._id} value={exam._id}>
                {exam.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item label="Test" name="testId" rules={[{ required: true, message: 'Please select a test' }]}>
          <Select
            showSearch
            placeholder="Select a Test"
            optionFilterProp="children"
            allowClear
            className="text-black"
          >
            {tests.map((test) => (
              <Select.Option key={test._id} value={test._id}>
                {test.lessonId?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item label="Assignment" name="assignmentId" rules={[{ required: true, message: 'Please select an assignment' }]}>
          <Select
            showSearch
            placeholder="Select an Assignment"
            optionFilterProp="children"
            allowClear
            className="text-black"
          >
            {assignments.map((assignment) => (
              <Select.Option key={assignment._id} value={assignment._id}>
                {assignment.lessonId?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item label="Student" name="studentId" rules={[{ required: true, message: 'Please select a student' }]}>
          <Select
            showSearch
            placeholder="Select a Student"
            optionFilterProp="children"
            allowClear
            className="text-black"
          >
            {students.map((student) => (
              <Select.Option key={student._id} value={student._id}>
                {student.firstName} {student.lastName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item
          label="Exam Score"
          name="examScore"
          rules={[{ required: true, message: 'Please enter the exam score' }]}
        >
          <Input type="number" placeholder="Enter exam score" />
        </Form.Item>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item
          label="Test Score"
          name="testScore"
          rules={[{ required: true, message: 'Please enter the test score' }]}
        >
          <Input type="number" placeholder="Enter test score" />
        </Form.Item>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item
          label="Assignment Score"
          name="assignmentScore"
          rules={[{ required: true, message: 'Please enter the assignment score' }]}
        >
          <Input type="number" placeholder="Enter assignment score" />
        </Form.Item>
      </div>
      {/* Submit Button */}
      <Form.Item className="w-full">
        <Button htmlType="submit" type="primary">
          {type === "create" ? "Create Result" : "Update Result"}
        </Button>

      </Form.Item>
    </Form>
  );
}
