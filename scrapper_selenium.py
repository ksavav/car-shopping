import random
import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def go_even_deeper(driver: webdriver.Chrome, category: str) -> list:
    related_products = []
    rows = driver.find_elements(By.CSS_SELECTOR, "tr[tidx]")
    
    for row in rows:
        name = row.find_element(By.CSS_SELECTOR, "td.name").text.strip()
        if name == "": continue
        prodcut_id = row.find_element(By.CSS_SELECTOR, "td.code").text.strip().replace(' ', '')
        product_code = row.find_element(By.CSS_SELECTOR, "td.code").text.strip()
        if ' ' in product_code:
            product_code, manufacturer = product_code.split(' ')
        else:
            manufacturer = ""
        price = row.find_element(By.CSS_SELECTOR, "td.pricegross").text.strip()
        try:
            photo = driver.find_element(By.TAG_NAME, "img").get_attribute("src")
            if "loader2.gif" in photo:
                photo = ""
        except:
            photo = ""

        product = {
            "Name": name,
            "ProductId": prodcut_id,
            "ProductCode": product_code,
            "Producer": manufacturer,
            "RegularPrice": price,
            "ActualPrice": price,
            "Category": category,
            "Quantity": random.randint(0, 10),
            "Substitutes": [],
            "Photo": photo
        }
        related_products.append(product)
    return related_products
        

def go_deeper(link: str, driver: webdriver.Chrome, category: str):
    driver.get(link)
    prod_list = []

    prodcut_id = driver.find_element(By.CSS_SELECTOR, '[itemprop="productID"]').text.strip().replace(' ', '')
    product_code = driver.find_element(By.CSS_SELECTOR, '[itemprop="productID"]').text.strip()
    if ' ' in product_code:
            product_code, manufacturer = product_code.split(' ')
    else:
        manufacturer = ""
    name = driver.find_elements(By.CSS_SELECTOR, '[itemprop="name"]')[-1].text.strip()
    price = float(driver.find_element(By.CSS_SELECTOR, '[itemprop="price"]').text.strip().replace(',', '.').replace(' ', ''))
    try:
        photo = driver.find_element(By.CSS_SELECTOR, '[itemprop="image"]').get_attribute("src")
    except:
        photo = ""

    product = {
        "Name": name,
        "ProductId": prodcut_id,
        "ProductCode": product_code,
        "Producer": manufacturer,
        "RegularPrice": price,
        "ActualPrice": price,
        "Category": category,
        "Quantity": random.randint(0, 10),
        "Substitutes": [],
        "Photo": photo
    }
    
    prod_list.append(product)
    subs = go_even_deeper(driver, category)
    prod_list += subs

    substitutes = [x["ProductId"] for x in prod_list]

    for p in prod_list:
        for s in substitutes:
            if p["ProductId"] != s:
                p["Substitutes"].append(s)

    print(prod_list)
    return prod_list

if __name__ == '__main__':
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(5)

    urls = [
        ("http://194.181.108.250/clientcatalogue/qap-qap04--wtryskiwacze,25-4-20-1-0000000487.aspx", "Wtryskiwacze"),
        ("http://194.181.108.250/clientcatalogue/qap-qap03--szczeki-hamulcowe,25-4-20-1-0000000486.aspx", "Szczęki Hamulcowe"),
        ("http://194.181.108.250/clientcatalogue/qap-qap05--tarcze-hamulcowe,25-4-20-1-0000000488.aspx", "Tarcze Hamulcowe"),
        ("http://194.181.108.250/clientcatalogue/qap-qap06--klocki-hamulcowe,25-4-20-1-0000000489.aspx", "Klocki Hamulcowe"),
        ("http://194.181.108.250/clientcatalogue/qap-qap06a--klocki-hamulcowe--ciezarowe,25-4-20-1-0000001295.aspx", "Klocki Hamulcowe Ciężarowe"),
        ("http://194.181.108.250/clientcatalogue/qap-qap07--pompy-wody-pompy-wody--qap-07-001--qap-07-200,25-4-20-2-0000000490-0000000543.aspx", "Pompy Wody"),
        ("http://194.181.108.250/clientcatalogue/qap-qap07--pompy-wody-pompy-wody--qap-07-201--qap-07-400,25-4-20-2-0000000490-0000000544.aspx", "Pompy Wody"),
        ("http://194.181.108.250/clientcatalogue/qap-qap07--pompy-wody-pompy-wody--qap-07-401--,25-4-20-2-0000000490-0000000545.aspx", "Pompy Wody"),
        ("http://194.181.108.250/clientcatalogue/qap-qap11--chlodnice,25-4-20-1-0000000494.aspx", "Chłodnice"),
        ("http://194.181.108.250/clientcatalogue/qap-qap30--filtry,25-4-20-1-0000000505.aspx", "Filtry"),
        ("http://194.181.108.250/clientcatalogue/qap-qap12--amortyzatory,25-4-20-1-0000000495.aspx", "Amortyzatory"),
    ]

    products = []

    for url, category in urls:
        driver.get(url)

        link_elements = driver.find_elements(By.XPATH, "//a[@href]")
        links = []

        for link in link_elements:
            l = link.get_attribute("href")
            if 'partscatalogue/0' in l:
                links.append(l)

        for link in links:
            try:
                xd = go_deeper(link, driver, category)
                products += xd
            except:
                print("Something went wrong... Continuing...")

    with open("data.json", mode="w", encoding="utf-8") as final:
        json.dump(products, final)

    driver.quit()