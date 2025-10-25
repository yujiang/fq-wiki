## 基于md的skill测试

```vue
<Skill :id="50001" :level='99' />
```

<Skill :id="50001" :level='99' />


```vue
<Skill :id="0" :level='2' />
```

<Skill :id="0" :level='2' />


```vue
<SkillList :skills="[{id:50001,level:99},{id:6005020,level:2},{}]" />
```
<SkillList :skills="[{id:50001,level:99},{id:6005020,level:2},{}]" />

```vue
<SkillGrid :skills="[{id:50001,level:99},{id:6005020,level:2},{}]" />
```
<SkillGrid :skills="[{id:50001,level:99},{id:6005020,level:2},{}]" />

```vue
<SkillGrid :rows="2" :cols="3" :skills="[{id:50001,level:99},{id:6005020,level:2},{}]" />
```
<SkillGrid :rows="2" :cols="3" :skills="[{id:50001,level:99},{id:6005020,level:2},{}]" />