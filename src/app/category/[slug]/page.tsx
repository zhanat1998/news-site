type Props = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="container">
      <h1>Категория: {slug}</h1>
    </div>
  )
}