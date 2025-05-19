import json
import random
import math
with open("SeedProducts.json", mode="r", encoding="utf-8") as products:
    json_file = json.load(products)

new_list = []

for product in json_file:
    if type(product["RegularPrice"]) == str:
        product["RegularPrice"] = round(random.random() * 1000, 2)
        product["ActualPrice"] = round(random.random() * 1000, 2)
        print(product["RegularPrice"])
        print(product["ActualPrice"])


with open("data_data.json", mode="w", encoding="utf-8") as final:
    json.dump(json_file, final)

