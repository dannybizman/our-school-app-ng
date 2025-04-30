"use client";
import { useEffect, useState } from "react";
import { Button, Select, Form, Input } from "antd";
import { createResult, getAllAssignments, getAllExams, getAllTests, getAllStudents } from "@/utils/api";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import { Exam } from "@/types/exam";
import { Test } from "@/types/test";
import { Assignment } from "@/types/assignment";

export default function ResultForm() {
  const [form] = Form.useForm();
  const [exams, setExams] = useState<Exam[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);

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
      // console.error("Token missing.");
      return;
    }
    // console.log("Submitting result with token: ", token);
    try {
      const response = await createResult({ ...values }, token);
      // console.log("API response:", response);
      if (response?.data?.success) {
        enqueueSnackbar("Results created successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar id={key} message="Results created successfully!" variant="success" />
          ),
        });
        form.resetFields();
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      enqueueSnackbar(errorMsg, {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Failed to submit result." variant="error" />
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
      {/* Exam Select */}
      <Form.Item label="Exam" name="examId" rules={[{ required: true, message: 'Please select an exam' }]}>
        <Select
          showSearch
          placeholder="Select an Exam"
          optionFilterProp="children"
          allowClear
        >
          {exams.map((exam) => (
            <Select.Option key={exam._id} value={exam._id}>
              {exam.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Test Select */}
      <Form.Item label="Test" name="testId" rules={[{ required: true, message: 'Please select a test' }]}>
        <Select
          showSearch
          placeholder="Select a Test"
          optionFilterProp="children"
          allowClear
        >
          {tests.map((test) => (
            <Select.Option key={test._id} value={test._id}>
              {test.lessonId?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Assignment Select */}
      <Form.Item label="Assignment" name="assignmentId" rules={[{ required: true, message: 'Please select an assignment' }]}>
        <Select
          showSearch
          placeholder="Select an Assignment"
          optionFilterProp="children"
          allowClear
        >
          {assignments.map((assignment) => (
            <Select.Option key={assignment._id} value={assignment._id}>
              {assignment.lessonId?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Student Select */}
      <Form.Item label="Student" name="studentId" rules={[{ required: true, message: 'Please select a student' }]}>
        <Select
          showSearch
          placeholder="Select a Student"
          optionFilterProp="children"
          allowClear
        >
          {students.map((student) => (
            <Select.Option key={student._id} value={student._id}>
              {student.firstName} {student.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Exam Score */}
      <Form.Item
        label="Exam Score"
        name="examScore"
        rules={[{ required: true, message: 'Please enter the exam score' }]}
      >
        <Input type="number" placeholder="Enter exam score" />
      </Form.Item>

      {/* Test Score */}
      <Form.Item
        label="Test Score"
        name="testScore"
        rules={[{ required: true, message: 'Please enter the test score' }]}
      >
        <Input type="number" placeholder="Enter test score" />
      </Form.Item>

      {/* Assignment Score */}
      <Form.Item
        label="Assignment Score"
        name="assignmentScore"
        rules={[{ required: true, message: 'Please enter the assignment score' }]}
      >
        <Input type="number" placeholder="Enter assignment score" />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Submit Result
        </Button>
      </Form.Item>
    </Form>
  );
}
