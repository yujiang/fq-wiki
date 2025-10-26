import ItemCard from './components/ItemCard.vue'
import ShopCard from './components/ShopCard.vue'
import ShopTabs from './components/ShopTabs.vue'

import Item from './components/Item.vue'
import ItemList from './components/ItemList.vue'
import ItemGrid from './components/ItemGrid.vue'
import Skill from './components/Skill.vue'
import SkillList from './components/SkillList.vue'
import SkillGrid from './components/SkillGrid.vue'
import Taolu from './components/Taolu.vue'
import TaoluSkillGrid from './components/TaoluSkillGrid.vue'
import TaoluCard from './components/TaoluCard.vue'

import SceneCollect from './components/SceneCollect.vue'
import CollectTabs from './components/CollectTabs.vue'
import SceneTele from './components/SceneTele.vue'
import TeleTabs from './components/TeleTabs.vue'
import RewardCard from './components/RewardCard.vue'
import MoneyCard from './components/MoneyCard.vue'
import Money from './components/Money.vue'

import NpcIcon from './components/NpcIcon.vue'
import NpcList from './components/NpcList.vue'
import NpcCard from './components/NpcCard.vue'
import NpcCards from './components/NpcCards.vue'
import SceneNpc from './components/SceneNpc.vue'

import TaskCard from './components/TaskCard.vue'
import TaskTabs from './components/TaskTabs.vue'
import SceneTask from './components/SceneTask.vue'

import testTooltip from './components/naive/Tooltip.vue'  

export function registerGameComponents(app: any) {
  app.component('ItemCard', ItemCard)
  app.component('ShopCard', ShopCard)
  app.component('ShopTabs', ShopTabs)
  
  app.component('Item', Item)
  app.component('ItemList', ItemList)
  app.component('ItemGrid', ItemGrid)
  app.component('Skill', Skill)
  app.component('SkillList', SkillList)
  app.component('SkillGrid', SkillGrid)
  app.component('Taolu', Taolu)
  app.component('TaoluSkillGrid', TaoluSkillGrid)
  app.component('TaoluCard', TaoluCard)

  app.component('SceneCollect', SceneCollect)
  app.component('CollectTabs', CollectTabs)
  app.component('SceneTele', SceneTele)
  app.component('TeleTabs', TeleTabs)

  app.component('RewardCard', RewardCard)
  app.component('MoneyCard', MoneyCard)
  app.component('Money', Money)

  app.component('NpcCard', NpcCard)
  app.component('NpcCards', NpcCards)
  app.component('NpcIcon', NpcIcon)
  app.component('NpcList', NpcList)
  app.component('SceneNpc', SceneNpc)

  app.component('TaskCard', TaskCard)
  app.component('TaskTabs', TaskTabs)
  app.component('SceneTask', SceneTask)

  app.component('testTooltip', testTooltip)
}
