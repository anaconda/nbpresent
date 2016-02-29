"%PREFIX%\Scripts\npm.cmd" install -g npm@latest && "%PREFIX%\Scripts\npm.cmd" install . && "%PREFIX%\Scripts\npm.cmd" run test && if errorlevel 1 exit 1
