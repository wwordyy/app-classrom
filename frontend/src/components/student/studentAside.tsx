

export function StudentAside() {
    return (
        <aside className="w-64 bg-white shadow-lg p-6 flex-shrink-0">
            <h2 className="text-xl font-bold mb-8">Панель студента</h2>

            <nav className="space-y-4">
                <a href="/student/posts" className="block text-gray-700 hover:text-black">
                Главная
                </a>

                <a href="/student/practice" className="block text-gray-700 hover:text-black">
                Практика
                </a>

                <a href="/student/profile" className="block text-gray-700 hover:text-black">
                Профиль
                </a>
                
                <a href="/student/chats" className="block text-gray-700 hover:text-black">
                    Чаты
                </a>
                
                
        </nav>
        </aside>
    );
}