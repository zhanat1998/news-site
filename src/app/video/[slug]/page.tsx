type Props = {
  params: { slug: string }
}

export default function VideoDetailPage({ params }: Props) {
  return (
    <div className="container">
      <h1>Видео: {params.slug}</h1>
    </div>
  )
}