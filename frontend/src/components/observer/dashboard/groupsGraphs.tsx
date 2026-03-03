import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";



export  function GroupsChart({ data }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow w-full">
        <h3 className="text-lg font-semibold mb-4">
            Процент сдачи по группам
        </h3>

        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="groupName" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="percent" />
            </BarChart>
        </ResponsiveContainer>
        </div>
    );
}