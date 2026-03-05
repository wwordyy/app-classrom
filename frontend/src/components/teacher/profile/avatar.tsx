import { useRef, useState } from "react";





export function AvatarUpload({ url, name, onUploaded }: {
    url: string | null;
    name: string;
    onUploaded: (newUrl: string) => void;
}) {


    
    const inputRef              = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(url);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const res = await fetch('/api/me/avatar', {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');
            setPreview(data.avatarUrl);
            onUploaded(data.avatarUrl);
        } catch (e: any) {
            setPreview(url);
            setError(e.message);
        } finally {
            setLoading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="relative group cursor-pointer"
                onClick={() => inputRef.current?.click()}
            >
                {preview ? (
                    <img src={preview} alt={name} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-stone-300 flex items-center justify-center text-3xl font-bold text-white">
                        {name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleChange}
                />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <p className="text-xs text-gray-300">Нажмите чтобы изменить</p>
        </div>
    );
}




export function Avatar({ url, name }: { url: string | null; name: string }) {
    if (url) return <img src={url} alt={name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />;
    return (
        <div className="w-9 h-9 rounded-full bg-stone-300 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {name?.[0]?.toUpperCase() ?? '?'}
        </div>
    );
}