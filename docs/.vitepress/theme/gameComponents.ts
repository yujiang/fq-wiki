import ItemCard from './components/ItemCard.vue'
import ShopCard from './components/ShopCard.vue'
import ShopTabs from './components/ShopTabs.vue'

import Item from './components/Item.vue'
import ItemList from './components/ItemList.vue'
import ItemGrid from './components/ItemGrid.vue'
import Skill from './components/Skill.vue'
import TaoluCard from './components/TaoluCard.vue'

import SceneCollect from './components/SceneCollect.vue'
import CollectTabs from './components/CollectTabs.vue'
import SceneTele from './components/SceneTele.vue'
import TeleTabs from './components/TeleTabs.vue'
import RewardCard from './components/RewardCard.vue'
import MoneyCard from './components/MoneyCard.vue'
import Money from './components/Money.vue'


import testTooltip from './components/naive/Tooltip.vue'  

export function registerGameComponents(app: any) {
  app.component('ItemCard', ItemCard)
  app.component('ShopCard', ShopCard)
  app.component('ShopTabs', ShopTabs)
  
  app.component('Item', Item)
  app.component('ItemList', ItemList)
  app.component('ItemGrid', ItemGrid)
  app.component('Skill', Skill)
  app.component('TaoluCard', TaoluCard)

  app.component('SceneCollect', SceneCollect)
  app.component('CollectTabs', CollectTabs)
  app.component('SceneTele', SceneTele)
  app.component('TeleTabs', TeleTabs)

  app.component('RewardCard', RewardCard)
  app.component('MoneyCard', MoneyCard)
  app.component('Money', Money)

  app.component('testTooltip', testTooltip)
}