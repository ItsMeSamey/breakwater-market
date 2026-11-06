"""Write a simple paginated, searchable PDF using standard built-in fonts."""
import argparse,textwrap
from pathlib import Path

def pdf_escape(text):
    return text.replace('\\','\\\\').replace('(','\\(').replace(')','\\)')

def make_pdf(source, destination):
    lines=[]
    for raw in Path(source).read_text().splitlines():
        if any(ord(c)>127 for c in raw):
            raise ValueError('This minimal document writer requires ASCII text.')
        bold=raw.startswith('#')
        raw=raw.lstrip('# ').replace('**','').replace('`','') if bold else raw.replace('**','').replace('`','')
        for line in textwrap.wrap(raw, width=88, break_long_words=True, break_on_hyphens=False) or ['']:
            lines.append((line,bold))
    pages=[lines[i:i+48]for i in range(0,len(lines),48)]or[[]]
    objects=[None,None,b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>']
    kids=[]
    for number,page in enumerate(pages,1):
        page_id=len(objects)+1;stream_id=page_id+1;kids.append(page_id)
        commands=['BT','14 TL','54 780 Td']
        for line,bold in page:
            commands.append('/F2 11 Tf'if bold else'/F1 10 Tf')
            commands.extend(['('+pdf_escape(line)+') Tj','T*'])
        commands.extend(['ET','BT /F1 9 Tf 54 38 Td (Breakwater Market | Page '+str(number)+' of '+str(len(pages))+') Tj ET'])
        stream='\n'.join(commands).encode('ascii')
        objects.append(('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+str(stream_id)+' 0 R >>').encode())
        objects.append(b'<< /Length '+str(len(stream)).encode()+b' >>\nstream\n'+stream+b'\nendstream')
    objects[0]=b'<< /Type /Catalog /Pages 2 0 R >>'
    objects[1]=('<< /Type /Pages /Count '+str(len(pages))+' /Kids ['+' '.join(str(k)+' 0 R'for k in kids)+'] >>').encode()
    data=bytearray(b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');offsets=[0]
    for i,obj in enumerate(objects,1):
        offsets.append(len(data));data.extend(str(i).encode()+b' 0 obj\n'+obj+b'\nendobj\n')
    xref=len(data);data.extend(('xref\n0 '+str(len(objects)+1)+'\n0000000000 65535 f \n').encode())
    for offset in offsets[1:]:data.extend(('%010d 00000 n \n'%offset).encode())
    data.extend(('trailer\n<< /Size '+str(len(objects)+1)+' /Root 1 0 R >>\nstartxref\n'+str(xref)+'\n%%EOF\n').encode())
    Path(destination).parent.mkdir(parents=True,exist_ok=True);Path(destination).write_bytes(data)
    print(str(destination)+': '+str(len(pages))+' pages, '+str(len(data))+' bytes')
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('source');parser.add_argument('destination');args=parser.parse_args();make_pdf(args.source,args.destination)
