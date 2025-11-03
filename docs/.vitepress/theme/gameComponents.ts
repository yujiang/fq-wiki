import ItemCard from './components/ItemCard.vue'
import ShopCard from './components/ShopCard.vue'
import ShopTabs from './components/Scene/ShopTabs.vue'

import Item from './components/Item.vue'
import ItemList from './components/ItemList.vue'
import ItemGrid from './components/ItemGrid.vue'
import Skill from './components/Skill.vue'
import SkillList from './components/SkillList.vue'
import SkillGrid from './components/SkillGrid.vue'
import SkillGridType from './components/SkillGridType.vue'
import SkillGridSecretSchoolTabs from './components/school/SkillGridSecretSchoolTabs.vue'

import Taolu from './components/taolu/Taolu.vue'
import TaoluSkillGrid from './components/taolu/TaoluSkillGrid.vue'
import TaoluCard from './components/taolu/TaoluCard.vue'
import TaoluCardList from './components/taolu/TaoluCardList.vue'
import SchoolTaolu from './components/taolu/SchoolTaolu.vue'
import SchoolTaoluTabs from './components/taolu/SchoolTaoluTabs.vue'
import SchoolTaoluTabsTabs from './components/taolu/SchoolTaoluTabsTabs.vue'

import SceneCollect from './components/Scene/SceneCollect.vue'
import CollectTabs from './components/Scene/CollectTabs.vue'
import TeleList from './components/Scene/TeleList.vue'
import SceneTele from './components/Scene/SceneTele.vue'
import RewardCard from './components/RewardCard.vue'
import MoneyCard from './components/MoneyCard.vue'
import Money from './components/Money.vue'

import NpcIcon from './components/NpcIcon.vue'
import NpcList from './components/NpcList.vue'
import NpcFriendList from './components/NpcFriendList.vue'
import NpcCard from './components/NpcCard.vue'
import NpcCards from './components/NpcCards.vue'
import SceneNpc from './components/Scene/SceneNpc.vue'

import TaskCard from './components/TaskCard.vue'
import TaskTabs from './components/TaskTabs.vue'
import SceneTask from './components/Scene/SceneTask.vue'

import Scene from './components/Scene/Scene.vue'
import SceneTabs from './components/Scene/SceneTabs.vue'
import SceneArea from './components/Scene/SceneArea.vue'
import SceneAreaTabs from './components/Scene/SceneAreaTabs.vue'
import SceneAreaTabsGrouped from './components/Scene/SceneAreaTabsGrouped.vue'

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
  app.component('SkillGridType', SkillGridType)
  app.component('SkillGridSecretSchoolTabs', SkillGridSecretSchoolTabs)

  app.component('Taolu', Taolu)
  app.component('TaoluSkillGrid', TaoluSkillGrid)
  app.component('TaoluCard', TaoluCard)
  app.component('TaoluCardList', TaoluCardList)
  app.component('SchoolTaolu', SchoolTaolu)
  app.component('SchoolTaoluTabs', SchoolTaoluTabs)
  app.component('SchoolTaoluTabsTabs', SchoolTaoluTabsTabs)

  app.component('SceneCollect', SceneCollect)
  app.component('CollectTabs', CollectTabs)
  app.component('TeleList', TeleList)
  app.component('SceneTele', SceneTele)

  app.component('RewardCard', RewardCard)
  app.component('MoneyCard', MoneyCard)
  app.component('Money', Money)

  app.component('NpcCard', NpcCard)
  app.component('NpcCards', NpcCards)
  app.component('NpcIcon', NpcIcon)
  app.component('NpcList', NpcList)
  app.component('NpcFriendList', NpcFriendList)
  app.component('SceneNpc', SceneNpc)

  app.component('TaskCard', TaskCard)
  app.component('TaskTabs', TaskTabs)
  app.component('SceneTask', SceneTask)

  app.component('Scene', Scene)
  app.component('SceneTabs', SceneTabs)
  app.component('SceneArea', SceneArea)
  app.component('SceneAreaTabs', SceneAreaTabs)
  app.component('SceneAreaTabsGrouped', SceneAreaTabsGrouped)
 
  
  app.component('testTooltip', testTooltip)
}
