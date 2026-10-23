"""Check reader navigation, complete directories and source/runtime agreement."""
from html.parser import HTMLParser
from pathlib import Path
import ast
import json
import re
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

source = (ROOT / 'script.js').read_text()
data = json.loads(re.search(r'const fallback=(.*?);\n', source).group(1))
slugs = {f'articles/{item["slug"]}.html' for item in data['articles']}
for file in ROOT.glob('articles*.html'):
    text = file.read_text()
    directories = re.findall(r'<section\b(?=[^>]*\bclass="[^"]*\barticle-topic-directory\b)[^>]*>[\s\S]*?</section>', text)
    assert len(directories) == 1, f'{file.name}: duplicate directory'
    links = [a['href'] for tag, a in Page(directories[0]).tags if tag == 'a']
    assert len(links) == len(set(links)) and set(links) == slugs, f'{file.name}: incomplete directory'
for name in ['index', 'articles', 'beginners', 'courts', 'gear']:
    page = Page((ROOT / f'{name}.html').read_text())
    ids = [a['id'] for _, a in page.tags if 'id' in a]
    assert len(ids) == len(set(ids)), f'{name}: duplicate IDs'
    assert sum(tag == 'h1' for tag, _ in page.tags) == 1, name
    for tag, attrs in page.tags:
        if tag != 'a' or not attrs.get('href'):
            continue
        url = urlsplit(attrs['href'])
        if url.scheme or url.netloc:
            continue
        if not url.path and url.fragment:
            assert unquote(url.fragment) in ids, (name, url.fragment)
        if url.path:
            assert (ROOT / unquote(url.path.lstrip('/'))).exists(), (name, url.path)
# The cleanup must work regardless of HTML attribute order.
tree = ast.parse((ROOT / 'tools/seo-discovery.py').read_text())
patterns = [n.value for n in ast.walk(tree) if isinstance(n, ast.Constant) and isinstance(n.value, str) and n.value.startswith('<section') and 'article-topic-directory' in n.value and '[\\s\\S]' in n.value]
assert len(patterns) == 1
for opening in ['<section class="article-topic-directory" aria-labelledby="x">', '<section aria-labelledby="x" class="article-topic-directory">']:
    assert re.sub(patterns[0], '', opening + '<div>content</div></section>') == ''
print('PASS: complete unique directories; all local links and anchors; unique H1/IDs; generator handles either attribute order.')
