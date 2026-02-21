import { useEffect, useState } from "react";

import { type StreamGroupDto, type CreateStreamDto } from '../../observer/types/observerTypes'
import { type Group, type User } from '../../../types/types'

import { apiAddStream } from '../../../api/stream'
import { apiGetGroups } from '../../../api/group'
import { apiGetUsersByRole } from '../../../api/user'
import { AsideBlock } from "../aside";
import { DashboardHeader } from "../header";

export function PracticeForm() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groups, setGroups] = useState<StreamGroupDto[]>([]);

  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [allTeachers, setAllTeachers] = useState<User[]>([]);

  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const groupsRes = await apiGetGroups();
        const teachersRes = await apiGetUsersByRole('teacher');

        setAllGroups(groupsRes);
        setAllTeachers(teachersRes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleAddGroup = () => {
    setGroups([...groups, { groupId: 0, teacherId: 0 }]);
  };

  const handleGroupChange = (index: number, field: keyof StreamGroupDto, value: number) => {
    const updated = [...groups];
    updated[index][field] = value;
    setGroups(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startDate || !endDate || groups.length === 0) {
      setMessage("Заполните все обязательные поля и добавьте хотя бы одну группу");
      return;
    }

    const payload: CreateStreamDto = {
      title,
      description,
      startDate,
      endDate,
      groups
    };

    if (new Date(endDate) <= new Date(startDate)) {
      setMessage("Дата окончания должна быть позже даты начала");
      return;
    }

    try {

      console.log("Отправляем:", JSON.stringify(payload));
      const response = await apiAddStream(payload);
      if (response.ok) {
      setMessage(`Поток успешно создан!`);
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setGroups([]);
      }

    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || "Ошибка при создании потока");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AsideBlock />
      <main className="flex-1 p-8">
        <DashboardHeader namePage="Создать поток" />

        <div className="bg-white p-6 rounded-2xl shadow w-full max-w-3xl">
          {message && (
            <p className="mb-4 text-red-600 font-semibold">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Название потока</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Описание</label>
              <textarea
                className="w-full border p-2 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Дата начала</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Дата окончания</label>
                <input
                  type="date"
                  min={today}
                  className="w-full border p-2 rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Группы и преподаватели</h3>
              {groups.map((g, i) => (
                <div key={i} className="flex gap-4 mb-2">
                  <select
                    className="border p-2 rounded flex-1"
                    value={g.groupId}
                    onChange={(e) =>
                      handleGroupChange(i, "groupId", Number(e.target.value))
                    }
                  >
                    <option value={0}>Выберите группу</option>
                    {allGroups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        {grp.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="border p-2 rounded flex-1"
                    value={g.teacherId}
                    onChange={(e) =>
                      handleGroupChange(i, "teacherId", Number(e.target.value))
                    }
                  >
                    <option value={0}>Выберите преподавателя</option>
                    {allTeachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button
                type="button"
                className="mt-2 text-blue-600 font-semibold"
                onClick={handleAddGroup}
              >
                + Добавить группу
              </button>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-4"
            >
              Создать поток
            </button>
          </form>
        </div>
      </main>
    </div>
    
            );
}


