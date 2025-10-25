## item测试

```vue
<Item :id="1206" :count='2' />
```

<Item :id="1206" :count='2' :rand='0.3' />

<Item :id="8005" :count='12' />

<Item :id="2022" :count='1' />

## 商店item测试

```vue
<ItemCard :good="{ ItemId: 100, Price: 10, Count: 100 }" />
```

<ItemCard :good="{ ItemId: 100, Price: 10, Count: 100 }" />

```vue
<ItemList :items="[{id:100, count:10}, {id:2022, count:1}, {id:8005, count:1}, {}]"/>
```

<ItemList :items="[{id:100, count:10}, {id:2022, count:1}, {id:8005, count:1}, {}]"/>

