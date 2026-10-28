function Header({ title }) {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <h1>
      {title}
      <span className="today-date">{today}</span>
    </h1>
  )
}

export default Header
