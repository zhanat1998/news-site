interface InstagramPostData {
    title?: string;
    text: string;
    link?: string;
    image?: string;
}

interface InstagramDeleteData {
    title: string;
    link: string;
}

export const publishToInstagram = async (noteData: InstagramPostData): Promise<boolean> => {
    const WEBHOOK_URL: string = 'https://hook.eu1.make.com/cb5ib9mhv510joiqgr6u7ze44hm10bc6';

    // Формируем payload с типами по умолчанию
    const payload = {
        title: noteData.title || 'Новая публикация',
        text: noteData.text,
        link: noteData.link || 'https://sokol.media',
        image_url: noteData.image || 'https://picsum.photos/1080/1080',
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

// Instagram'дан жок кылуу — Make.com'го "delete" сигналы жиберет
export const deleteFromInstagram = async (data: InstagramDeleteData): Promise<boolean> => {
    const WEBHOOK_URL: string = 'https://hook.eu1.make.com/cb5ib9mhv510joiqgr6u7ze44hm10bc6';

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete',
                title: data.title,
                link: data.link,
            }),
        });

        if (!response.ok) {
            throw new Error(`Make.com статус: ${response.status}`);
        }

        console.log("Delete сигналы Make.com'го жиберилди");
        return true;
    } catch (error) {
        console.error('Instagram delete катасы:', error instanceof Error ? error.message : error);
        return false;
    }
};