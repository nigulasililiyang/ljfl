@echo off

cd ..

del "version.txt"

svn info | findstr "Revision" >> version.txt

xcopy /y /c /h /r "version.txt" "public/version.txt"

npm run build:prod



pause