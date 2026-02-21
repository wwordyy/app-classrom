import { useNavigate } from "react-router-dom";
import { apiLogout } from '../../api/auth/login'

interface DashboardHeaderProps {
    namePage: string;
}

export function DashboardHeader ({ namePage }: DashboardHeaderProps) {

      const navigate = useNavigate();

       async function handleLogout () {
      
        const ok =  await apiLogout()
      
          if (ok) {
            navigate('/login')
        }  
        }


    return (
        <div>

        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{namePage}</h1>

            <div className="flex items-center gap-4">
                <span className="text-gray-600">{localStorage.getItem("userFullName")}</span>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={handleLogout}>
                Выйти
                </button>
            </div>
        </div>

        </div>
    ); 

}
