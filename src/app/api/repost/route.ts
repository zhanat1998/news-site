import { NextResponse } from 'next/server';
import { urlForHQ } from '@/sanity/lib/image';
import { publishToInstagram } from '@/utils/services/instagramServices';

export async function POST(request: Request) {
    try {
        // 1. Получаем данные новости, которые прислал Sanity Webhook
        const newsData = await request.json();

        // 2. Валидация базовых полей
        if (!newsData || !newsData.title) {
            return NextResponse.json(
                { success: false, error: 'Данные новости не получены или пустые' },
                { status: 400 }
            );
        }

        // 3. Формируем полноценную ссылку на саму новость на сайте "Сокол медиа"
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
        const fullNewsUrl = `${siteUrl}/news/${newsData.slug?.current || ''}`;

        // 4. Генерируем прямую ссылку на картинку высокого качества
        let imageUrl: string = '';
        if (newsData.mainImage) {
            try {
                imageUrl = urlForHQ(newsData.mainImage, 1200, 630);
            } catch (imgError) {
                console.error('Не удалось сгенерировать URL картинки:', imgError);
            }
        }

        console.log('--- Пакет подготовлен, вызываем сервис интеграции ---');

        // 5. Передаем структурированные данные в наш независимый сервис интеграции
        const isSent = await publishToInstagram({
            title: newsData.title,
            text: newsData.excerpt || newsData.title,
            link: fullNewsUrl,
            image: imageUrl || undefined // Если картинки нет, сервис подставит дефолтную
        });

        if (!isSent) {
            throw new Error('Сервис интеграции вернул ошибку при отправке в Make.com');
        }

        return NextResponse.json(
            { success: true, message: 'Данные успешно обработаны и отправлены на репост через сервис!' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Ошибка в обработчике автопостинга:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}