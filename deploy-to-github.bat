@echo off
echo Building React app for GitHub Pages...
npm run build

echo Copying GitHub Pages configuration files...
copy .nojekyll build\ >nul
copy 404.html build\ >nul

echo Build completed! Files ready for GitHub Pages deployment.
echo.
echo Next steps:
echo 1. Push your changes to GitHub
echo 2. Go to repository Settings ^> Pages
echo 3. Set Source to "GitHub Actions"
echo 4. Your site will be available at: https://zinzinw11w.github.io/UBSS/
echo.
pause

