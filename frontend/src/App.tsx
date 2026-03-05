import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Register } from './components/auth/register'
import { Login } from './components/auth/login'
import { RoleRedirect, ProtectedRoute } from './components/auth/roleRedirect'

import { Dashboard } from './components/observer/dashboard/dashboard'
import { GroupsPage } from './components/observer/group/groupsPage'
import { ChatsPage } from './components/observer/chats/chatPage'
import { AssignTeacherPage } from './components/observer/group/assignTeacherPage'
import { ObserverProfilePage } from './components/observer/profile/observerProfile'

import { TeacherMainPage } from './components/teacher/dashboard/dashboard'
import { TeacherCreatePostPage } from './components/teacher/post/createPostPage'
import { PostSubmissionsPage } from './components/teacher/submission/postSubmissionsPage'
import { TeacherJournalPage } from './components/teacher/journal/journalPage'
import { TeacherStudentGradesPage } from './components/teacher/journal/studentGradesPage'
import { TeacherChatsPage } from './components/teacher/chats/teacherChats'
import { TeacherProfilePage } from './components/teacher/profile/teacherProfile'

import { StudentPostsPage } from './components/student/post/studentPostsPage'
import { StudentPostDetailPage } from './components/student/post/studentPostDetailPage'
import { StudentPracticePage } from './components/student/practice/practicePage'
import { StudentProfilePage } from './components/student/profile/studentProfile'
import { StudentChatsPage } from './components/student/chats/studentChats'

import { AdminGroupsPage } from './components/admin/group/groupPage'
import { AdminUsersPage } from './components/admin/user/userPage'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          {/* Публичные */}
          <Route path='/register' element={<Register />} />
          <Route path='/login'    element={<Login />} />

          <Route path='/' element={<RoleRedirect />} />


          {/* Observer */}
          <Route path='/observer/main' element={
            <ProtectedRoute allowedRoles={['observer']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path='/observer/groups' element={
            <ProtectedRoute allowedRoles={['observer']}>
              <GroupsPage />
            </ProtectedRoute>
          } />

          <Route path='/observer/chats' element={
            <ProtectedRoute allowedRoles={['observer']}>
              <ChatsPage />
            </ProtectedRoute>
          } />

          <Route path='/observer/groups/:groupId/assign-teacher' element={
            <ProtectedRoute allowedRoles={['observer']}>
              <AssignTeacherPage />
            </ProtectedRoute>
          } />

        <Route path='/observer/profile' element={
            <ProtectedRoute allowedRoles={['observer']}>
                <ObserverProfilePage />
            </ProtectedRoute>
        } />


          {/* Teacher */}
          <Route path='/teacher/main' element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherMainPage />
            </ProtectedRoute>
          } />
          <Route path='/teacher/chats' element={
              <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherChatsPage />
              </ProtectedRoute>
          } />
          <Route path='/teacher/create-post' element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherCreatePostPage />
            </ProtectedRoute>
          } />
          <Route path='/teacher/posts/:postId/submissions' element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <PostSubmissionsPage />
            </ProtectedRoute>
          } />
          <Route path='/teacher/journal' element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherJournalPage />
            </ProtectedRoute>
          } />
          <Route path='/teacher/journal/:studentId' element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherStudentGradesPage />
            </ProtectedRoute>
          } />
          <Route path='/teacher/profile' element={
              <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherProfilePage />
              </ProtectedRoute>
          } />


          {/* Student */}
          <Route path='/student/posts' element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentPostsPage />
            </ProtectedRoute>
          } />

         <Route path='/student/posts/:postId' element={
              <ProtectedRoute allowedRoles={['student']}>
                  <StudentPostDetailPage />
              </ProtectedRoute>
          } />

          <Route path='/student/practice' element={
              <ProtectedRoute allowedRoles={['student']}>
                  <StudentPracticePage />
              </ProtectedRoute>
          } />

          <Route path='/student/profile' element={
              <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfilePage />
                </ProtectedRoute>
          } />
          <Route path='/student/chats' element={
              <ProtectedRoute allowedRoles={['student']}>
                  <StudentChatsPage />
                </ProtectedRoute>
          } />


          {/* Admin */}
          <Route path='/admin/users' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />
          <Route path='/admin/groups' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminGroupsPage />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App