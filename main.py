import urllib.request
from bs4 import BeautifulSoup

url = "https://notalone.nami.org/"

# req = urllib.request.Request(url, None, hdr) #The assembled request
req = urllib.request.Request(url)
resp = urllib.request.urlopen(req)
page = resp.read() # The data u need
soup = BeautifulSoup(page, 'html.parser')

sections = soup.findAll("div", {"class": "article-content"})
for sec in sections:
    print('\n\n')
    print(sec.get_text())
