import { useEffect, useState } from "react";
import { DashboardHeader } from "../../header";
import { TeacherAside } from "../teacherAside";
import { type TeacherGroupDashboard } from './types'
import { apiGetTeacherDashboard } from '../../../api/teacher/teacher'
import { useNavigate } from "react-router-dom";

export function TeacherMainPage() {

  const [groups, setGroups] = useState<TeacherGroupDashboard[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      
      const res = await apiGetTeacherDashboard();

      setGroups(res);
    }

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherAside />

      <main className="flex-1 p-8">
        <DashboardHeader namePage="Главная" />

        {groups.map((group) => (
          <div key={group.id} className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-2">{group.name}</h2>
            <p className="text-gray-600 mb-4">
              {group.specialty} — {group.courseYear} курс
            </p>

            <p className="mb-4">
              👥 Студентов: {group.students.length}
            </p>

            <h3 className="font-semibold mb-2">Посты:</h3>

            {group.posts.length === 0 ? (
              <p className="text-gray-500">Постов пока нет</p>
            ) : (
              group.posts.map((post: any) => (
                <div
                  key={post.id}
                  className="bg-neutral-100 p-4 rounded-xl mb-3 animation-card"
                onClick={() => navigate(`/teacher/posts/${post.id}/submissions`)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{post.title}</h4>
                    <span className="text-sm text-gray-500">
                      до {new Date(post.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    Максимальный балл: {post.maxScore}
                  </p>

                
                  <p className="text-sm mt-1">
                    Назначено работ: {post.totalSubmissions}
                  </p>

                  <p className="text-sm mt-1">
                    Сдано работ: {post.submittedCount}
                  </p>
                </div>
              ))
            )}
          </div>
        ))}
      </main>
    </div>
  );
}