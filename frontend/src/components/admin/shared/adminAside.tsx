import { NavLink, useNavigate } from 'react-router-dom';
import { apiLogout } from '../../../api/auth/login'

export function AdminAside() {

    const navigate = useNavigate();

      async function handleLogout () {
          
            const ok =  await apiLogout()
          
              if (ok) {
                navigate('/login')
            }  
        }

    return (
        <aside className="w-64 bg-black shadow-lg p-6 h-screen sticky top-0 flex flex-col">
            <div className="mb-8">
                <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">system</p>
                <h2 className="text-xl font-bold text-white">
                    <span className="text-indigo-400">/</span>admin
                </h2>
            </div>

            <nav className="space-y-1 flex-1">
                <p className="text-gray-700 text-xs uppercase tracking-widest mb-3 px-2">управление</p>

                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                        }`
                    }
                >
                    Пользователи
                </NavLink>

                <NavLink
                    to="/admin/groups"
                    className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                        }`
                    }
                >
                    Группы
                </NavLink>
            </nav>

            <div className="flex items-center gap-4">
                <button className="bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={handleLogout}>
                Выйти
                </button>
            </div>
        </aside>
    );
}