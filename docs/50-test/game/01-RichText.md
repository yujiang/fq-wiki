```vue
<RichText text="aa#R红色#nbb" />
```
<RichText text="aa#R红色#nbb" />
<!-- 显示：aa [红色(红色)] bb -->
---

```vue
<RichText text="普通##井号 #G绿色#n 结束" />
```
<RichText text="普通##井号 #G绿色#n 结束" />
<!-- “##” 会渲染为字面量 “#” -->

