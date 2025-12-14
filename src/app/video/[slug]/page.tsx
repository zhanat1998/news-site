type Props = {
  params: Promise<{ slug: string }>;
};

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="container">
      <h1>Видео: {slug}</h1>
    </div>
  );
}