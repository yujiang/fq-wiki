## 风气江湖wiki

1. 目录  
dao/web/fq-wiki
2. 安装  
>cd dao/web/fq-wiki  
>pnpm i
3. 调试  
执行a开发.bat
浏览器打开 http://localhost:5173/
4. 修改  
文件放在 docs
5. 编辑md文件  
上网学习: md文件格式非常简单 
可以让ai帮你生成

## 编译

1. 编译  
>pnpm run bulid
2. 预览  
>pnpm run preview 
浏览器打开 http://localhost:5173/

## 发布

git add .
git commit -m 'push vercel'
git push

也可以运行 push-vercel.bat

