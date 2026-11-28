import AccessibilityCard from '../components/AccessibilityCard'
import PricesCard from '../components/PricesCard'
import ManageClientsCard from '../components/ManageClientsCard'
import GroupsCard from '../components/GroupsCard'
import BackupCard from '../components/BackupCard'

function ManageScreen({
  prices,
  setPrices,
  buyPrices,
  setBuyPrices,
  clients,
  setClients,
  groups,
  setGroups,
  textSize,
  setTextSize,
  backupData,
  onRestore,
  onBackupExported,
}) {
  return (
    <section className="screen active">
      <h1>Gérer</h1>

      <h2>Accessibilité</h2>
      <AccessibilityCard textSize={textSize} setTextSize={setTextSize} />

      <h2>Produits &amp; Prix</h2>
      <PricesCard
        key={`${prices.milk}-${prices.lben}-${prices.isLocked}`}
        prices={prices}
        setPrices={setPrices}
        buyPrices={buyPrices}
        setBuyPrices={setBuyPrices}
      />

      <hr className="divider" />

      <h2>Gérer les clients</h2>
      <ManageClientsCard clients={clients} setClients={setClients} groups={groups} />

      <GroupsCard
        groups={groups}
        setGroups={setGroups}
        clients={clients}
        setClients={setClients}
      />

      <hr className="divider" />

      <h2>Sauvegarde &amp; Restauration</h2>
      <BackupCard
        data={backupData}
        onRestore={onRestore}
        onBackupExported={onBackupExported}
      />
    </section>
  )
}

export default ManageScreen
