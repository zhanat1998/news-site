import { NextResponse } from 'next/server';
import { urlForHQ } from '@/sanity/lib/image';

export async function POST(request: Request) {
    try {
        // 1. Получаем данные новости, которые прислал Sanity Webhook
        const newsData = await request.json();

        // 2. Валидация базовых полей (если нет заголовка, дальше не идем)
        if (!newsData || !newsData.title) {
            return NextResponse.json({ success: false, error: 'Данные новости не получены или пустые' }, { status: 400 });
        }

        // 3. Формируем полноценную ссылку на саму новость на сайте "Сокол медиа"
        // Замени 'https://sokol.media' на реальный рабочий домен сайта, когда он будет на хостинге
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
        const fullNewsUrl = `${siteUrl}/news/${newsData.slug?.current || ''}`;

        // 4. Генерируем прямую ссылку на картинку высокого качества (например, 1200x630 — стандарт для соцсетей)
        let imageUrl = '';
        if (newsData.mainImage) {
            try {
                imageUrl = urlForHQ(newsData.mainImage, 1200, 630).url();
            } catch (imgError) {
                console.error('Не удалось сгенерировать URL картинки:', imgError);
            }
        }

        // 5. Собираем чистый объект, оптимизированный для отправки в Facebook и Instagram
        const payloadForSocials = {
            title: newsData.title,                      // Заголовок (Башкы аталыш)
            text: newsData.excerpt || newsData.title,   // Краткое описание (Кыскача сүрөттөмө)
            link: fullNewsUrl,                         // Ссылка на новость на сайте
            image: imageUrl                            // Прямая ссылка на картинку для поста
        };

        console.log('--- Подготовлен пакет для автопостинга ---', payloadForSocials);

        // 6. Отправляем данные на платформу автоматизации (Make.com)
        const makeWebhookUrl = process.env.MAKE_AUTOPOSTING_WEBHOOK_URL;

        if (makeWebhookUrl) {
            const response = await fetch(makeWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadForSocials),
            });

            if (!response.ok) {
                throw new Error(`Ошибка Make.com API: ${response.statusText}`);
            }
        } else {
            console.warn('Внимание: Переменная MAKE_AUTOPOSTING_WEBHOOK_URL не настроена в .env.local. Запрос не отправлен.');
        }

        return NextResponse.json(
            { success: true, message: 'Данные успешно обработаны и отправлены на репост!' },
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