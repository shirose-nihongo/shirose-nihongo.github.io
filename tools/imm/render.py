import sys,subprocess,os,glob
from PIL import Image
U="/mnt/user-data/uploads/Downloads/SHIROSE NIHONGO/"
R='/home/claude/shirose-nihongo.github.io/assets/ssw/'
jobs=[('jaim-machine-metal','01'),('jaim-elec-electronic','02'),('jaim-metal-surface','03')]
slug,n=jobs[int(sys.argv[1])]
for lang,fn in (('jp',f'jaim_studyguide1_{n}.pdf'),('id',f'jaim_studyguide1_{n}_id.pdf')):
    out=R+f'{slug}/{lang}/'; os.makedirs(out,exist_ok=True); tmp=f'/tmp/rend_{slug}_{lang}'; os.makedirs(tmp,exist_ok=True)
    subprocess.run(['pdftoppm','-r','96','-png',U+fn,tmp+'/p'],check=True)
    for f in sorted(glob.glob(tmp+'/p-*.png')):
        k=int(f.split('-')[-1].split('.')[0]); Image.open(f).convert('RGB').save(out+f'p{k:02d}.webp','WEBP',quality=52,method=4); os.remove(f)
print(slug,'done')
