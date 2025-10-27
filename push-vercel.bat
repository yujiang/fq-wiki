@echo off
chcp 65001 >nul
echo =========================================
echo 🚀  Vercel Wiki 一键推送脚本
echo =========================================
REM cd /d D:\coding\dao\web\fq-wiki

:: 1. 拉取最新（防止冲突）
git pull origin main

:: 2. 添加所有修改
git add .

:: 3. 提交（带时间戳）
set TIMESTAMP=%date% %time%
git commit -m "Auto push to Vercel at %TIMESTAMP%"

:: 4. 推送到远程（触发 Vercel 构建）
git push origin main

echo.
echo ✅ 推送完成！等待 Vercel 自动构建...
echo =========================================
pause
