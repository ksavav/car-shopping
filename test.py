import json

with open("data_data.json", mode="r", encoding="utf-8") as products:
    json_file = json.load(products)

new_list = []

for product in json_file:
    if 'wycof' not in product["Name"].lower():
        new_list.append(product)


print(f"xd: {len(new_list)}")
print(f"total {len(json_file)}")

# with open("data_data.json", mode="w", encoding="utf-8") as final:
#     json.dump(new_list, final)

