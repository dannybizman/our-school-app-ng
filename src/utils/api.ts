import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const getAuthHeaders = (token?: string) => ({
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

/* ========================= Admin APIs ========================= */
// Register Admin
export const registerAdmin = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admins/register`, formData);
    return response.data;
  } catch (error: any) {
    console.error("Register Admin Error:", error);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};


// Admin Login
export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admins/login`, { email, password });
    return response.data;
  } catch (error: any) {
    console.error("Login Admin Error:", error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


// Get Logged-in Admin
export const getLoggedInAdmin = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admins/get-logged-in-admin`, getAuthHeaders(token));
    console.log("Admin response data:", response.data); 
    return response.data;
  } catch (error: any) {
    console.error("Get Admin Error:", error);
    throw new Error(error.response?.data?.message || "Fetch failed");
  }
};


// Admin Create Teacher
export const createTeacher = async (formData: FormData, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admins/create-teacher`, formData, getAuthHeaders(token));
    return response.data;
  } catch (error: any) {
    console.error("Create Teacher Error:", error);
    throw new Error(error.response?.data?.message || "Teacher creation failed");
  }
};


// Admin Create Student
export const createStudent = async (formData: FormData, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admins/create-student`, formData, getAuthHeaders(token));
    return response.data;
  } catch (error: any) {
    console.error("Create Student Error:", error);
    throw new Error(error.response?.data?.message || "Student creation failed");
  }
};



// Admin Create Parent
export const createParent = async (formData: FormData, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admins/create-parent`, formData, getAuthHeaders(token));
    return response.data;
  } catch (error: any) {
    console.error("Create Parent Error:", error);
    throw new Error(error.response?.data?.message || "Parent creation failed");
  }
};

/* ========================= TEACHER APIs ========================= */


  export const loginTeacher = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/teachers/login`, { email, password });
      return response.data;
    } catch (error: any) {
      console.error("Login Teacher Error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };


  export const getLoggedInTeacher = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teachers/get-logged-in-teacher`, getAuthHeaders(token));
      console.log("Teacher response data:", response.data); 
      return response.data;
    } catch (error: any) {
      console.error("Get Teacher Error:", error);
      throw new Error(error.response?.data?.message || "Fetch failed");
    }
  };
  


export const getAllTeachers = (token?: string) =>
  axios.get(`${API_BASE_URL}/teachers/all`, getAuthHeaders(token));

export const getTeacherById = (id: string, token?: string) =>
  axios.get(`${API_BASE_URL}/teachers/${id}`, getAuthHeaders(token));

export const deleteTeacher = (id: string, token?: string) =>
  axios.delete(`${API_BASE_URL}/teachers/delete/${id}`, getAuthHeaders(token));

export const updateTeacherProfile = (formData: FormData, token?: string) =>
  axios.put(`${API_BASE_URL}/teachers/update-profile`, formData, {
    ...getAuthHeaders(token),
    headers: {
      ...getAuthHeaders(token).headers,
      'Content-Type': 'multipart/form-data',
    },
  });



  /* ========================= STUDENT APIs ========================= */



export const loginStudent = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/students/login`, { username, password });
    return response.data;
  } catch (error: any) {
    console.error("Login student Error:", error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


export const getLoggedInStudent = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/get-logged-in-student`, getAuthHeaders(token));
    console.log("Student response data:", response.data); 
    return response.data;
  } catch (error: any) {
    console.error("Get Student Error:", error);
    throw new Error(error.response?.data?.message || "Fetch failed");
  }
};

// Get All Students
export const getAllStudents = async (token?: string) => {
  const response = await axios.get(`${API_BASE_URL}/students/all`, getAuthHeaders(token));
  return response.data.students || []; 
};

export const getStudentById = (id: string, token?: string) =>
axios.get(`${API_BASE_URL}/students/${id}`, getAuthHeaders(token));

export const deleteStudent = (id: string, token?: string) =>
axios.delete(`${API_BASE_URL}/students/delete/${id}`, getAuthHeaders(token));

export const updateStudentProfile = (formData: FormData, token?: string) =>
axios.put(`${API_BASE_URL}/students/update-profile`, formData, {
  ...getAuthHeaders(token),
  headers: {
    ...getAuthHeaders(token).headers,
    'Content-Type': 'multipart/form-data',
  },
});


/* ========================= PARENT APIs ========================= */



  export const loginParent = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/parents/login`, { email, password });
      return response.data;
    } catch (error: any) {
      console.error("Login parent Error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };



  export const getLoggedInParent = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parents/get-logged-in-parent`, getAuthHeaders(token));
      console.log("Parent response data:", response.data); 
      return response.data;
    } catch (error: any) {
      console.error("Get Parent Error:", error);
      throw new Error(error.response?.data?.message || "Fetch failed");
    }
  };


export const getAllParents = (token?: string) =>
  axios.get(`${API_BASE_URL}/parents/all`, getAuthHeaders(token));

export const getParentById = (id: string, token?: string) =>
  axios.get(`${API_BASE_URL}/parents/${id}`, getAuthHeaders(token));

export const deleteParent = (id: string, token?: string) =>
  axios.delete(`${API_BASE_URL}/parents/delete/${id}`, getAuthHeaders(token));

export const updateParentProfile = (
  data: {
    name: string;
    surname: string;
    phone: string;
    address: string;
    password?: string;
  },
  token?: string
) => axios.put(`${API_BASE_URL}/parents/update-profile`, data, getAuthHeaders(token));



/* ========================= Class APIs ========================= */
// Create a Class
export const createClass = async (classData: any, token: string) => {
  const response = await axios.post(`${API_BASE_URL}/class/create`, classData, getAuthHeaders(token));
  return response.data;
};

export const getAllClasses = async (token?: string) => {
  const response = await axios.get(`${API_BASE_URL}/class/all`, getAuthHeaders(token));
  return response.data.classes; // ✅ this is the array you need
};


// Get Class by ID
export const getClassById = async (id: string, token: string) => {
  const response = await axios.get(`${API_BASE_URL}/class/${id}`, getAuthHeaders(token));
  return response.data;
};

// Update Class
export const updateClass = async (id: string, updatedData: any, token: string) => {
  const response = await axios.put(`${API_BASE_URL}/class/update/${id}`, updatedData, getAuthHeaders(token));
  return response.data;
};

// Delete Class
export const deleteClass = async (id: string, token: string) => {
  const response = await axios.delete(`${API_BASE_URL}/class/delete/${id}`, getAuthHeaders(token));
  return response.data;
};


/* ========================= RESULT APIs ========================= */
export const createResult = (data: any, token: string) => axios.post(`${API_BASE_URL}/results/create`, data, getAuthHeaders(token));
export const getAllResults = (token?: string) => axios.get(`${API_BASE_URL}/results/all`, getAuthHeaders(token));
export const getResultById = (id: string, token?: string) => axios.get(`${API_BASE_URL}/results/${id}`, getAuthHeaders(token));
export const updateResult = (id: string, data: any, token?: string) => axios.put(`${API_BASE_URL}/results/${id}`, data, getAuthHeaders(token));
export const deleteResult = (id: string, token?: string) => axios.delete(`${API_BASE_URL}/results/delete/${id}`, getAuthHeaders(token));

/* ========================= ANNOUNCEMENT APIs ========================= */
export const createAnnouncement = (data: any, token: string) => axios.post(`${API_BASE_URL}/announcements/create`, data, getAuthHeaders(token));
export const getAllAnnouncements = (token?: string) => axios.get(`${API_BASE_URL}/announcements/all`, getAuthHeaders(token));
export const getAnnouncementById = (id: string, token?: string) => axios.get(`${API_BASE_URL}/announcements/${id}`, getAuthHeaders(token));
export const updateAnnouncement = (id: string, data: any, token?: string) => axios.put(`${API_BASE_URL}/announcements/${id}`, data, getAuthHeaders(token));
export const deleteAnnouncement = (id: string, token?: string) => axios.delete(`${API_BASE_URL}/announcements/delete/${id}`, getAuthHeaders(token));

/* ========================= ASSIGNMENT APIs ========================= */
export const createAssignment = (data: any, token: string) => axios.post(`${API_BASE_URL}/assignments/create`, data, getAuthHeaders(token));
export const getAllAssignments = (token?: string) => axios.get(`${API_BASE_URL}/assignments/all`, getAuthHeaders(token));
export const getAssignmentById = (id: string, token?: string) => axios.get(`${API_BASE_URL}/assignments/${id}`, getAuthHeaders(token));
export const updateAssignment = (id: string, data: any, token?: string) => axios.put(`${API_BASE_URL}/assignments/${id}`, data, getAuthHeaders(token));
export const deleteAssignment = (id: string, token?: string) => axios.delete(`${API_BASE_URL}/assignments/delete/${id}`, getAuthHeaders(token));


/* ========================= TEST APIs ========================= */
export const createTest = (data: any, token: string) => axios.post(`${API_BASE_URL}/tests/create`, data, getAuthHeaders(token));
export const getAllTests = (token?: string) => axios.get(`${API_BASE_URL}/tests/all`, getAuthHeaders(token));
export const getTestById = (id: string, token?: string) => axios.get(`${API_BASE_URL}/tests/${id}`, getAuthHeaders(token));
export const updateTest = (id: string, data: any, token?: string) => axios.put(`${API_BASE_URL}/tests/${id}`, data, getAuthHeaders(token));
export const deleteTest= (id: string, token?: string) => axios.delete(`${API_BASE_URL}/tests/delete/${id}`, getAuthHeaders(token));




/* ========================= ATTENDANCE APIs ========================= */
export const createAttendance = (data: any, token: string) => axios.post(`${API_BASE_URL}/attendances/create`, data, getAuthHeaders(token));
export const getAllAttendances = (token?: string) => axios.get(`${API_BASE_URL}/attendances/all`, getAuthHeaders(token));
export const getAttendanceById = (id: string, token?: string) => axios.get(`${API_BASE_URL}/attendances/${id}`, getAuthHeaders(token));
export const updateAttendance = (id: string, data: any, token?: string) => axios.put(`${API_BASE_URL}/attendances/${id}`, data, getAuthHeaders(token));
export const deleteAttendance = (id: string, token?: string) => axios.delete(`${API_BASE_URL}/attendances/delete/${id}`, getAuthHeaders(token));

/* ========================= EVENT APIs ========================= */
export const createEvent = (data: any, token: string) => axios.post(`${API_BASE_URL}/events/create`, data, getAuthHeaders(token));
export const getAllEvents = (token?: string) => axios.get(`${API_BASE_URL}/events/all`, getAuthHeaders(token));
export const getEventById = (id: string, token?: string) => axios.get(`${API_BASE_URL}/events/${id}`, getAuthHeaders(token));
export const updateEvent = (id: string, data: any, token?: string) => axios.put(`${API_BASE_URL}/events/${id}`, data, getAuthHeaders(token));
export const deleteEvent = (id: string, token?: string) => axios.delete(`${API_BASE_URL}/events/delete/${id}`, getAuthHeaders(token));

/* ========================= EXAM APIs ========================= */
export const createExam = (data: any, token: string) => axios.post(`${API_BASE_URL}/exams/create`, data, getAuthHeaders(token));
export const getAllExams = (token?: string) => axios.get(`${API_BASE_URL}/exams/all`, getAuthHeaders(token));
export const getExamById = (id: string, token?: string) => axios.get(`${API_BASE_URL}/exams/${id}`, getAuthHeaders(token));
export const updateExam = (id: string, data: any, token?: string) => axios.put(`${API_BASE_URL}/exams/${id}`, data, getAuthHeaders(token));
export const deleteExam = (id: string, token?: string) => axios.delete(`${API_BASE_URL}/exams/delete/${id}`, getAuthHeaders(token));

/* ========================= SUBJECT APIs ========================= */
export const createSubject = (data: any, token: string) => axios.post(`${API_BASE_URL}/subjects/create`, data, getAuthHeaders(token));
export const getAllSubjects = (token?: string) => axios.get(`${API_BASE_URL}/subjects/all`, getAuthHeaders(token));
export const getSubjectById = (id: string, token?: string) => axios.get(`${API_BASE_URL}/subjects/${id}`, getAuthHeaders(token));
export const updateSubject = (id: string, data: any, token?: string) => axios.put(`${API_BASE_URL}/subjects/${id}`, data, getAuthHeaders(token));
export const deleteSubject = (id: string, token?: string) => axios.delete(`${API_BASE_URL}/subjects/delete/${id}`, getAuthHeaders(token));

/* ========================= LESSON APIs ========================= */
export const createLesson = (data: any, token: string) => axios.post(`${API_BASE_URL}/lessons/create`, data, getAuthHeaders(token));
export const getAllLessons = (token?: string) =>
  axios.get(`${API_BASE_URL}/lessons/all`, getAuthHeaders(token)).then(res => res.data);
export const getLessonById = (id: string, token?: string) => axios.get(`${API_BASE_URL}/lessons/${id}`, getAuthHeaders(token));
export const updateLesson = (id: string, data: any, token?: string) => axios.put(`${API_BASE_URL}/lessons/${id}`, data, getAuthHeaders(token));
export const deleteLesson = (id: string, token?: string) =>
  axios.delete(`${API_BASE_URL}/lessons/delete/${id}`, getAuthHeaders(token));

