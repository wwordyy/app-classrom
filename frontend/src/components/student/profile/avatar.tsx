import { useRef, useState } from "react";
import { apiUploadAvatar } from '../../../api/student/profile'


interface AvatarProps {
    url: string | null;
    name: string;
    size?: 'sm' | 'lg';
    editable?: boolean;
    onUploaded?: (newUrl: string) => void;
}

export function Avatar({ url, name, size = 'sm', editable = false, onUploaded }: AvatarProps) {
    const [preview, setPreview] = useState<string | null>(url);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);
    const inputRef              = useRef<HTMLInputElement>(null);

    const dim = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-10 h-10 text-sm';

    const handleClick = () => {
        if (editable) inputRef.current?.click();
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Показываем превью сразу
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setLoading(true);
        setError(null);

        try {
            const newUrl = await apiUploadAvatar(file);
            setPreview(newUrl);
            onUploaded?.(newUrl);
        } catch (e: any) {
            setPreview(url); // откат к старой
            setError(e.message);
        } finally {
            setLoading(false);
            // Сбрасываем input чтобы можно было выбрать тот же файл повторно
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className={`relative flex-shrink-0 ${editable ? 'cursor-pointer group' : ''}`}
                onClick={handleClick}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt={name}
                        className={`${dim} rounded-full object-cover`}
                    />
                ) : (
                    <div className={`${dim} rounded-full bg-stone-300 flex items-center justify-center font-bold text-white`}>
                        {name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                )}

                {editable && (
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleChange}
                />
            </div>

            {error && <p className="text-xs text-red-500 text-center max-w-24">{error}</p>}
        </div>
    );
}