import json

# used for Swagger documentation

# data types supported: string, number, integer, boolean, array, object
"""
type -> data type, description -> key in JSON, example -> value in JSON
string: type, description, example
number: type, description, example
integer: type, description, example
boolean: type, description, example
array: type, items, description
object: type, properties, description
"""

j = """
    {
        "name": "Alexander W Thornton",
        "ucinetid": "thornton",
        "phone": "",
        "title": "Continuing Lecturer",
        "department": "Computer Science",
        "schools": [
            "Donald Bren School of Information and Computer Sciences"
        ],
        "relatedDepartments": [
            "COMPSCI",
            "IN4MATX",
            "I&C SCI",
            "SWE",
            "STATS"
        ],
        "courseHistory": [
            "I&C SCI 45C",
            "I&C SCI 46",
            "I&C SCI 32A",
            "I&C SCI 32"
        ]
    }
"""
descriptions = {
}
d = json.loads(j)

res = ""
tab = "  "

def schemify(key, value, indent):
    global res
    if type(value) is str:
        res += f"{indent}type: string\n"
        if key in descriptions: res += f"{indent}description: {descriptions[key]}\n"
        res += f"{indent}example: \"{value}\"\n"
    elif type(value) is float:
        res += f"{indent}type: number\n"
        if key in descriptions: res += f"{indent}description: {descriptions[key]}\n"
        res += f"{indent}example: {value}\n"
    elif type(value) is int:
        res += f"{indent}type: integer\n"
        if key in descriptions: res += f"{indent}description: {descriptions[key]}\n"
        res += f"{indent}example: {value}\n"
    elif type(value) is bool:
        res += f"{indent}type: boolean\n"
        if key in descriptions: res += f"{indent}description: {descriptions[key]}\n"
        res += f"{indent}example: {value}\n"
    elif type(value) is list:
        res += f"{indent}type: array\n"
        if key in descriptions: res += f"{indent}description: {descriptions[key]}\n"
        res += f"{indent}items:\n"
        schemify(None, value[0], indent + tab)
    elif type(value) is dict:
        res += f"{indent}type: object\n"
        if key in descriptions: res += f"{indent}description: {descriptions[key]}\n"
        res += f"{indent}properties:\n"
        for k, v in sorted(value.items()):
            res += f"{indent + tab}{k}:\n"
            schemify(k, v, indent + tab * 2)

# schemify the json with no indents
schemify(None, d, "")

print(res)