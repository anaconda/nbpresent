"%PREFIX%\Scripts\npm.cmd" install . --no-progress --no-spin
"%PREFIX%\Scripts\npm.cmd" run build:release
rmdir "node_modules" /s /q
del "%PREFIX%\npm.cmd" "%PREFIX%\npm"
"%PYTHON%" setup.py install
if errorlevel 1 exit 1
