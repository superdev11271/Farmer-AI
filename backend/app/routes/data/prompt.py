

import json

with open("app/routes/data/category_data.json", "r", encoding="utf-8") as f:
    category_data = json.load(f)


def make_possible_category(category_data):
    result_string = ""
    for category in category_data:
        result_string += f"{category["name"]}  description:{category["description"]}\n"
        for sub_item in category["sub_items"]:
            if len(sub_item["items"]) == 0:
                result_string += f"         {sub_item["name"]}      description:{sub_item["description"]}     identifier:{sub_item["identifier"]}       return values: {", ".join(sub_item["return_value"])} \n"
            else:
                result_string += f"         {sub_item["name"]}      description:{sub_item["description"]}\n"

                for item in sub_item["items"]:
                    result_string += f"                 {item["name"]}      description:{item["description"]}     identifier:{item["identifier"]}       return values: {", ".join(item["return_value"])} \n"
    return result_string



def get_prompt(prompts):
    all_refercence = ""
    for prompt in prompts:
        all_refercence += f"{prompt.text}\n"
    prompt = """
    I am going to make automation system to handle farm invoice document to table. 

    First, you need to classify the invoice documents.

    Categories have a depth of 3.

    I'll give you the possible categories and the data that should be returned.

    """ + make_possible_category(category_data) + """

    You are an invoice parsing assistant for farm supply invoices.

    There are many items in invoice document pdf. 
    Find only the correct category identifier for each one.

    If one is not in possible category, make its main category and subcategory as null.

    You should return values which is mentioned in each item.

    Output only valid JSON. The JSON array should have objects like:


    [{
    category_identifier,
    data: {
     /////return parsed items.
    },....]
    It is necessary to recognize and distinguish decimal points and commas accurately.
    If number contain comma, remove it and return paresed number to use in code.

    And you should return only name as lowercase about Omschrijving if it contain some other information like "LANDBOUWZOUT 99% NACL FIJN 25 KG (Voedermiddel, 38% natrium)".

    If you can't find information about specific json key, you can make it as null.

    Datum means date of invoice, not mean item date.
    change all unit of mass as kilograms and return.
    
    Here is the reference prompts:
    """ + all_refercence + """
    """

    return prompt