import PricesCard from '../components/PricesCard'
import ManageClientsCard from '../components/ManageClientsCard'
import GroupsCard from '../components/GroupsCard'

function ManageScreen({ prices, setPrices, clients, setClients, groups, setGroups }) {
  return (
    <section className="screen active">
      <h1>Gérer</h1>

      <h2>Produits &amp; Prix</h2>
      <PricesCard prices={prices} setPrices={setPrices} />

      <hr className="divider" />

      <h2>Gérer les clients</h2>
      <ManageClientsCard clients={clients} setClients={setClients} groups={groups} />

      <GroupsCard
        groups={groups}
        setGroups={setGroups}
        clients={clients}
        setClients={setClients}
      />
    </section>
  )
}

export default ManageScreen
