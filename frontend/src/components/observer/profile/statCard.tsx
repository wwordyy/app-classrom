



export function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-1">
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <span className="text-xs text-gray-400 text-center">{label}</span>
        </div>
    );
}