import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/Layout';
import AdminDashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import Students from './components/admin/Students';
import StudentDetails from './components/admin/StudentDetails';
import Teachers from './components/admin/Teachers';
import Library from './components/admin/Library';
import Account from './components/admin/Account';
import Class from './components/admin/Class';
import Subject from './components/admin/Subject';
import Routine from './components/admin/Routine';
import Attendance from './components/admin/Attendance';
import Exam from './components/admin/Exam';
import Notice from './components/admin/Notice';
import Transport from './components/admin/Transport';
import Hostel from './components/admin/Hostel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="students" element={<Students />} />
            <Route path="student-details" element={<StudentDetails />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="library" element={<Library />} />
            <Route path="account" element={<Account />} />
            <Route path="class" element={<Class />} />
            <Route path="subject" element={<Subject />} />
            <Route path="routine" element={<Routine />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="exam" element={<Exam />} />
            <Route path="notice" element={<Notice />} />
            <Route path="transport" element={<Transport />} />
            <Route path="hostel" element={<Hostel />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
