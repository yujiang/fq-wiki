## item测试

```vue
<Item :id="8889" :count='2' :rand='30' />
```

<Item :id="8889" :count='2' :rand='30' />


```vue
<Item :id="0"  />
```

<Item :id="0"  />


## 商店item测试

```vue
<ItemCard :good="{ ItemId: 8889, Price: 10, Count: 100 }" />
```

<ItemCard :good="{ ItemId: 8889, Price: 10, Count: 100 }" />

```vue
<ItemList :items="[{id:8889, count:10}, {id:2022, count:1}, {id:8005, count:1}, {}]"/>
```

<ItemList :items="[{id:8889, count:10}, {id:2022, count:1}, {id:8005, count:1}, {}]"/>


```vue
<ItemGrid :rows="2" :cols="3" :items="[{id:8889, count:10}, {id:2022, count:1}]"/>
```

<ItemGrid :rows="2" :cols="3" :gap="2" :items="[{id:8889, count:10}, {id:2022, count:1}]"/>