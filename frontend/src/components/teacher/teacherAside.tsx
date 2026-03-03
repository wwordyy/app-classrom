



export function TeacherAside() {
  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex-shrink-0">
        <h2 className="text-xl font-bold mb-8">Панель учителя</h2>

        <nav className="space-y-4">
            <a href="/teacher/main" className="block text-gray-700 hover:text-black">
              Главная
            </a>
            <a href="/teacher/create-post" className="block text-gray-700 hover:text-black">
              Создать пост
            </a>
            <a href="/teacher/journal" className="block text-gray-700 hover:text-black">
              Журнал
            </a>
      </nav>
    </aside>
  );
}