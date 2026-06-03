// Описываем интерфейс для данных публикации
interface InstagramPostData {
    title?: string;
    text: string;      // Текст новости/поста обязателен
    link?: string;
    image?: string;    // Ссылка на картинку
}

/**
 * Сервис для автоматической публикации постов в Instagram через вебхук Make.com
 */
export const publishToInstagram = async (noteData: InstagramPostData): Promise<boolean> => {
    const WEBHOOK_URL: string = 'https://hook.eu1.make.com/cb5ib9mhv510joiqgr6u7ze44hm10bc6';

    // Формируем payload с типами по умолчанию
    const payload = {
        title: noteData.title || 'Новая публикация',
        text: noteData.text,
        link: noteData.link || 'https://sokol.media',
        image: noteData.image || 'https://picsum.photos/1080/1080' // Резервный URL
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сети: Сервер вернул статус ${response.status}`);
        }

        console.log('Пост успешно отправлен в очередь Make.com!');
        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Не удалось отправить публикацию в Instagram:', error.message);
        } else {
            console.error('Неизвестная ошибка при отправке в Instagram:', error);
        }
        return false;
    }
};