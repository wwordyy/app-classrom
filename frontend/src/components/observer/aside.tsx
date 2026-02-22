

export function AsideBlock() {

    return (
        <> 
        <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-8">Панель наблюдателя</h2>

        <nav className="space-y-4">
          <a href="/observer/main" className="block text-gray-700 hover:text-blue-600">Главная</a>
          <a href="/observer/groups" className="block text-gray-700 hover:text-blue-600">Группы</a>
          <a href="/observer/chats" className="block text-gray-700 hover:text-blue-600">Чаты</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Отчёты</a>
        </nav>
      </aside>
        </>

    );

}