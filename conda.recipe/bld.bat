"%PREFIX%\Scripts\npm.cmd" install -g npm@latest && "%PREFIX%\Scripts\npm.cmd" install . && "%PREFIX%\Scripts\npm.cmd" run build:release && "%PYTHON%" setup.py install && rmdir "%PREFIX%\node_modules" /s /q
if errorlevel 1 exit 1
