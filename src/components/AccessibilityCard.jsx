const SIZES = [
  { id: 'normal', label: 'Normal' },
  { id: 'large', label: 'Grand' },
  { id: 'xlarge', label: 'Très grand' },
]

function AccessibilityCard({ textSize, setTextSize }) {
  return (
    <div className="card">
      <p className="hint-text">
        Agrandit les noms, montants et chiffres importants sans changer la taille des cartes.
      </p>
      <div className="button-row">
        {SIZES.map((size) => (
          <button
            key={size.id}
            type="button"
            className={`secondary-btn text-size-btn ${textSize === size.id ? 'active-size' : ''}`}
            onClick={() => setTextSize(size.id)}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AccessibilityCard
