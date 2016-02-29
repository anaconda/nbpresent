"%PREFIX%\Scripts\npm.cmd" install -g npm@latest --no-progress
"%PREFIX%\Scripts\npm.cmd" install . --no-progress
"%PREFIX%\Scripts\npm.cmd" run build:release
"%PYTHON%" setup.py install
rmdir "%PREFIX%\node_modules" /s /q
if errorlevel 1 exit 1
