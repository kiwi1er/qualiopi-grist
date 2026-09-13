"""Run from the repository root after editing JS/CSS, before packaging."""
from pathlib import Path
import hashlib,re
p=Path('index.html')
def version(match):
    name=match.group(2)
    digest=hashlib.sha256(Path(name).read_bytes()).hexdigest()[:12]
    return match.group(1)+'"'+name+'?v='+digest+'"'
p.write_text(re.sub(r'(src=|href=)"([^"?]+\.(?:js|css))(?:\?[^" ]*)?"',version,p.read_text()))
