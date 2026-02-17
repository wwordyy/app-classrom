import { useEffect, useState } from "react";
import { apiGetOverview, apiGetGroupStats, apiGetSubmissionStats } from "../../api/dashboard";
import { apiGetMe  } from '../../api/user'
import { apiLogout } from '../../api/auth/login'

import { GroupsChart } from '../observer/graphs/groupsChat'


import { type User } from '../../types/types'
import { type GroupStats} from '../observer/types/observerTypes'
import { useNavigate } from "react-router-dom";



export  function Dashboard() {

  const navigate = useNavigate();

  const [ totalGroups, setTotalGroups ] = useState(0);
  const [ totalStudents, setTotalStudents ] = useState(0);
  const [ totalTeachers, setTotalTeachers ] = useState(0); 

  const [ user, setUser ] = useState< User | null> (null);
  const [ groupsStats, setGroupsStats ] =  useState <GroupStats[]>([]);

  const [percentLate, setPercentLate] = useState(0);
  const [percentSubmitted, setPercentSubmitted] = useState(0);


  useEffect(() => {
    const fetchData = async () => {

      const result = await apiGetOverview();

      const responseUser = await apiGetMe();

      const responseGroupsStats = await apiGetGroupStats();

      const responseSubmittedStats = await apiGetSubmissionStats();

      setPercentLate(responseSubmittedStats.percentLate);
      setPercentSubmitted(responseSubmittedStats.percentSubmitted);

      setGroupsStats(responseGroupsStats);

      setUser(responseUser.user)
      setTotalGroups(result.totalGroups);
      setTotalTeachers(result.totalTeachers);
      setTotalStudents(result.totalTeachers);
      
    };

    fetchData();
  }, []);

  async function handleLogout () {

    const ok =  await apiLogout()

    if (ok) {
      navigate('/login')
    }
    
  }

  return (

    <div className="min-h-screen bg-gray-100 flex">


      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-8">Панель наблюдателя</h2>

        <nav className="space-y-4">
          <a href="#" className="block text-gray-700 hover:text-blue-600">Главная</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Группы</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Преподаватели</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Аналитика</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Чаты</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Отчёты</a>
        </nav>
      </aside>


      <main className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.fullName}</span>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Всего групп</p>
            <h2 className="text-3xl font-bold">{totalGroups}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Преподавателей</p>
            <h2 className="text-3xl font-bold">{totalTeachers}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Cтудентов</p>
            <h2 className="text-3xl font-bold">{totalStudents}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">% сдавших</p>
            <h2 className="text-3xl font-bold text-green-600">{percentSubmitted}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">% просроченных</p>
            <h2 className="text-3xl font-bold text-red-600">{percentLate}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">

          <GroupsChart data={groupsStats} />

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            Распределение групп по преподавателям
          </h3>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3">Преподаватель</th>
                <th className="py-3">Количество групп</th>
                <th className="py-3">% сдачи</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">Иванов И.И.</td>
                <td>3</td>
                <td className="text-green-600 font-semibold">82%</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">Петров П.П.</td>
                <td>2</td>
                <td className="text-yellow-600 font-semibold">64%</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3">Сидоров С.С.</td>
                <td>4</td>
                <td className="text-red-600 font-semibold">40%</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
    
  );
}
