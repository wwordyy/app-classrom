
export async function apiDownloadReport() {

     const response = await fetch('/api/reports/groups', {
        method: 'GET',
        credentials: 'include',
    });

     if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка скачивания отчёта");
    }

    return await response.blob();
    
}