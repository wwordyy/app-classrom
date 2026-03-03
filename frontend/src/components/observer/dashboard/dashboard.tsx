import { useEffect, useState } from "react";
import { AsideBlock } from '../aside'
import { DashboardHeader } from '../../header'
import { TeacherStats } from './teacherStats'

import { apiGetOverview, apiGetGroupStats, apiGetSubmissionStats } from "../../../api/observer/dashboard";
import { apiGetMe  } from '../../../api/user'
import { apiDownloadReport } from '../../../api/observer/report'

import { GroupsChart } from './groupsGraphs'

import { type GroupStats} from '../dashboard/types'



export  function Dashboard() {


  const [ totalGroups, setTotalGroups ] = useState(0);
  const [ totalStudents, setTotalStudents ] = useState(0);
  const [ totalTeachers, setTotalTeachers ] = useState(0); 

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

      localStorage.setItem("userFullName", responseUser.fullName)

      setTotalGroups(result.totalGroups);
      setTotalTeachers(result.totalTeachers);
      setTotalStudents(result.totalStudents);
      
    };

    fetchData();
  }, []);


    const handleDownloadReport = async () => {
      

      const blob = await apiDownloadReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'groups_report.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
  };


  return (

    <div className="min-h-screen bg-gray-100 flex">

      <AsideBlock/>

      <main className="flex-1 p-8">

        <DashboardHeader namePage="Главная"/>

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

        <div className="bg-white p-6 rounded-2xl shadow ">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold mb-4">
              Распределение групп по преподавателям
            </h3>

            <button className="text-sm bg-stone-100 rounded-lg px-4 
              hover:cursor-pointer hover:bg-stone-200"
              onClick={handleDownloadReport}>
              Скачать отчет
            </button>
          </div>

          <TeacherStats/>

        </div>

      </main>
    </div>
    
  );
}
