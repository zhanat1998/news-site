import { NextResponse } from 'next/server';
import { urlForHQ } from '@/sanity/lib/image';
import { publishToInstagram, deleteFromInstagram } from '@/utils/services/instagramServices';

export async function POST(request: Request) {
    try {
        const newsData = await request.json();

        if (!newsData) {
            return NextResponse.json({ success: false, error: 'Маалымат жок' }, { status: 400 });
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sokol.media';
        const fullNewsUrl = `${siteUrl}/news/${newsData.slug?.current || ''}`;

        // Delete операциясы — Instagram'дан жок кылуу
        if (newsData.operation === 'delete') {
            const isDeleted = await deleteFromInstagram({
                title: newsData.title || '',
                link: fullNewsUrl,
            });
            return NextResponse.json(
                { success: isDeleted, operation: 'delete' },
                { status: 200 }
            );
        }

        // Create / Update — Instagram'га жарыялоо
        if (!newsData.title) {
            return NextResponse.json({ success: false, error: 'Title жок' }, { status: 400 });
        }

        let imageUrl: string = '';
        if (newsData.mainImage) {
            try {
                const directUrl = newsData.mainImage?.asset?.url;
                if (directUrl && directUrl.startsWith('http')) {
                    imageUrl = directUrl;
                } else {
                    const built = urlForHQ(newsData.mainImage, 1200, 630);
                    if (built && !built.startsWith('/')) imageUrl = built;
                }
            } catch {
                // сүрөт болбосо Make.com дефолт сүрөт колдонот
            }
        }

        const isSent = await publishToInstagram({
            title: newsData.title,
            text: newsData.excerpt || newsData.title,
            link: fullNewsUrl,
            image: imageUrl || undefined,
        });

        if (!isSent) {
            throw new Error('Make.com webhook катасы');
        }

        return NextResponse.json({ success: true, operation: 'publish' }, { status: 200 });

    } catch (error: any) {
        console.error('Repost handler error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}