import ItemCard from './components/shop/ItemCard.vue'
import ShopCard from './components/shop/ShopCard.vue'
import ShopTabs from './components/shop/ShopTabs.vue'

import RichText from './components/ui/RichText.vue'

import Item from './components/base/Item.vue'
import ItemList from './components/base/ItemList.vue'
import ItemGrid from './components/base/ItemGrid.vue'
import Skill from './components/base/Skill.vue'
import SkillList from './components/base/SkillList.vue'
import SkillGrid from './components/base/SkillGrid.vue'
import SkillGridType from './components/school/SkillGridType.vue'
import SkillGridSecretSchoolTabs from './components/school/SkillGridSecretSchoolTabs.vue'

import Taolu from './components/taolu/Taolu.vue'
import TaoluSkillGrid from './components/taolu/TaoluSkillGrid.vue'
import TaoluCard from './components/taolu/TaoluCard.vue'
import TaoluCardList from './components/taolu/TaoluCardList.vue'
import SchoolTaolu from './components/taolu/SchoolTaolu.vue'
import SchoolTaoluTabs from './components/taolu/SchoolTaoluTabs.vue'
import SchoolTaoluTabsTabs from './components/taolu/SchoolTaoluTabsTabs.vue'

import SceneCollect from './components/Scene/SceneCollect.vue'
import SceneCollectTabs from './components/Scene/SceneCollectTabs.vue'
import TeleList from './components/Scene/TeleList.vue'
import SceneTele from './components/Scene/SceneTele.vue'
import SceneTeleType from './components/Scene/SceneTeleType.vue'

import RewardDemo from './components/demo/RewardDemo.vue'
import NpcDemo from './components/demo/NpcDemo.vue'
import SkillDemo from './components/demo/SkillDemo.vue'
import ItemDemo from './components/demo/ItemDemo.vue'
import SoldierDemo from './components/demo/SoldierDemo.vue'
import SceneDemo from './components/demo/SceneDemo.vue'
import TaoluDemo from './components/demo/TaoluDemo.vue'
import TeleCheck from './components/tool/TeleCheck.vue'
import RewardCard from './components/reward/RewardCard.vue'
import SayReward from './components/reward/SayReward.vue'
import MoneyCard from './components/base/MoneyCard.vue'
import Money from './components/base/Money.vue'
import Talent from './components/talent/Talent.vue'
import TalentList from './components/talent/TalentList.vue'

import NpcIcon from './components/base/NpcIcon.vue'
import NpcList from './components/base/NpcList.vue'
import SoldierIcon from './components/soldier/SoldierIcon.vue'
import SoldierList from './components/soldier/SoldierList.vue'
import NpcFriendList from './components/reward/NpcFriendList.vue'
import NpcCard from './components/base/NpcCard.vue'
import NpcCards from './components/base/NpcCards.vue'
import SoldierCard from './components/soldier/SoldierCard.vue'
import SoldierCards from './components/soldier/SoldierCards.vue'
import AllSoldier from './components/soldier/AllSoldier.vue'
import AllTalent from './components/talent/AllTalent.vue'
import SceneNpc from './components/Scene/SceneNpc.vue'

import TaskCard from './components/task/TaskCard.vue'
import TaskItem from './components/task/TaskItem.vue'
import TaskList from './components/task/TaskList.vue'
import TaskTabs from './components/task/TaskTabs.vue'
import TaskMainTabs from './components/task/TaskMainTabs.vue'
import SceneTask from './components/Scene/SceneTask.vue'
import TaskScore from './components/task/TaskScore.vue'

import Scene from './components/Scene/Scene.vue'
import SceneTabs from './components/Scene/SceneTabs.vue'
import SceneArea from './components/Scene/SceneArea.vue'
import SceneAreaTabs from './components/Scene/SceneAreaTabs.vue'
import SceneAreaTabsGrouped from './components/Scene/SceneAreaTabsGrouped.vue'
import SceneAreaTabsXls from './components/Scene/SceneAreaTabsXls.vue'

import Discuss from './components/Discuss.vue'

import WorldMapItem from './components/world/WorldMapItem.vue'
import WorldMap from './components/world/WorldMap.vue'
import WorldMapScenes from './components/world/WorldMapScenes.vue'


import CharImage from './components/ui/CharImage.vue'
import ItemImage from './components/ui/ItemImage.vue'
import Button from './components/ui/Button.vue'

import ObsItemLike from './components/observe/ItemLike.vue'
import ObsLifeSkill from './components/observe/LifeSkill.vue'
import ObsAskItem from './components/observe/AskItem.vue'


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
  app.component('SceneCollectTabs', SceneCollectTabs)
  app.component('TeleList', TeleList)
  app.component('SceneTeleType', SceneTeleType)
  app.component('SceneTele', SceneTele)

   app.component('RewardDemo', RewardDemo)
   app.component('NpcDemo', NpcDemo)
   app.component('SkillDemo', SkillDemo)
   app.component('ItemDemo', ItemDemo)
   app.component('SoldierDemo', SoldierDemo)
   app.component('SceneDemo', SceneDemo)
   app.component('TaoluDemo', TaoluDemo)
   app.component('TeleCheck', TeleCheck)
  app.component('RewardCard', RewardCard)
  app.component('SayReward', SayReward)
  app.component('MoneyCard', MoneyCard)
  app.component('Money', Money)
  app.component('Talent', Talent)
  app.component('TalentList', TalentList)

   app.component('NpcCard', NpcCard)
   app.component('NpcCards', NpcCards)
   app.component('SoldierCard', SoldierCard)
   app.component('SoldierCards', SoldierCards)
   app.component('AllSoldier', AllSoldier)
  app.component('AllTalent', AllTalent)
   app.component('NpcIcon', NpcIcon)
   app.component('NpcList', NpcList)
   app.component('SoldierIcon', SoldierIcon)
   app.component('SoldierList', SoldierList)
  app.component('NpcFriendList', NpcFriendList)
  app.component('SceneNpc', SceneNpc)

  app.component('TaskCard', TaskCard)
  app.component('TaskItem', TaskItem)
  app.component('TaskList', TaskList)
  app.component('TaskTabs', TaskTabs)
  app.component('TaskMainTabs', TaskMainTabs)
  app.component('SceneTask', SceneTask)
  app.component('TaskScore', TaskScore)

  app.component('Scene', Scene)
  app.component('SceneTabs', SceneTabs)
  app.component('SceneArea', SceneArea)
  app.component('SceneAreaTabs', SceneAreaTabs)
  app.component('SceneAreaTabsGrouped', SceneAreaTabsGrouped)
  app.component('SceneAreaTabsXls', SceneAreaTabsXls)
  app.component('Discuss', Discuss)
 
  app.component('WorldMapItem', WorldMapItem)
  app.component('WorldMap', WorldMap)
  app.component('WorldMapScenes', WorldMapScenes)

  app.component('RichText', RichText)
  app.component('CharImage', CharImage)
  app.component('ItemImage', ItemImage)
  app.component('Button', Button)
  
  app.component('ObsItemLike', ObsItemLike)
  app.component('ObsLifeSkill', ObsLifeSkill)
  app.component('ObsAskItem', ObsAskItem)
}
