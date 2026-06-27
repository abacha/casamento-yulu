import zipfile, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
files = ['index.html', 'style.css', 'app.js', 'config.js', 'src/pix.js',
         'assets/hero.png', 'assets/divider.png', 'assets/favicon.png',
         'APPS_SCRIPT.md', 'COMO_RODAR_LOCAL.md']
z = zipfile.ZipFile('/tmp/casamento-yulu.zip', 'w', zipfile.ZIP_DEFLATED)
for f in files:
    z.write(f, 'casamento-yulu/' + f)
z.close()
print('zip OK', len(files), 'arquivos')
