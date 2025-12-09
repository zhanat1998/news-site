type Props = {
  params: { slug: string }
}

export default function NewsDetailPage({ params }: Props) {
  return (
    <div className="container">
      <h1>Жаңылык: {params.slug}</h1>
    </div>
  )
}