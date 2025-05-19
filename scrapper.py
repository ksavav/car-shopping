import requests
import random
from bs4 import BeautifulSoup

url = "http://194.181.108.250/clientcatalogue/qap-qap04--wtryskiwacze,25-4-20-1-0000000487.aspx"

# manufacturer
# product ID
# name
# price
# replacements

def go_even_deeper(n_soup: BeautifulSoup):
    xd = n_soup.select('tr[tidx]')
    print(xd)
    print(type(xd))

def go_deeper(link):

    url = 'http://194.181.108.250' + link
    r = requests.get(url)
    n_soup = BeautifulSoup(r.content, 'html.parser')
    print(n_soup.prettify())
    prodcut_id = n_soup.find(itemprop="productID").string.replace(' ', '')
    product_code, manufacturer = n_soup.find(itemprop="productID").string.split(' ')
    name = n_soup.find_all(itemprop="name")[-1].string
    price = float(n_soup.find(itemprop="price").string.replace(',', '.').replace(' ', ''))
    go_even_deeper(n_soup)

    return {
        "Name": name,
        "ProductId": prodcut_id,
        "ProductCode": product_code,
        "Manufacturer": manufacturer,
        "RegularPrice": price,
        "ActualPrice": price,
        "Quantity": random.randint(0, 10),
    }
    # replacements = 

if __name__ == '__main__':
    r = requests.get(url)

    soup = BeautifulSoup(r.content, 'html.parser')    
    products = []

    for link in soup.find_all('a'):
        l = link.get('href')
        if 'partscatalogue/0' in l:
            products.append(l)
    
    print(go_deeper(products[0]))

    # itemprop="productID"
    # itemprop="name"
    # itemprop="offers"

    # class="code"
    # href
