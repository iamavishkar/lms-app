import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import ParentDashboard from './ParentDashboard';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const roleName = user?.role?.name?.toLowerCase();

  if (roleName === 'admin') return <AdminDashboard />;
  if (roleName === 'teacher') return <TeacherDashboard />;
  if (roleName === 'student') return <StudentDashboard />;
  if (roleName === 'parent') return <ParentDashboard />;

  return <AdminDashboard />;
};

export default Dashboard;
