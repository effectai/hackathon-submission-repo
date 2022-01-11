import json
from notebook.services.contents.filemanager import FileContentsManager as FCM
import os


def getMethodDef(fname):
    with open(fname, "r") as notebook:
        notebook_json = json.loads(notebook.read())
        print(type(notebook_json))
        cells = notebook_json["cells"]

        for cell in cells:
            for line in cell["source"]:
                if "cleanData" in line:
                    return "".join(cell["source"])

        return None


def createBlankNotebook():
    FCM().new(path="/test.ipynb")
    return


# f = "basic.ipynb"
# print(getMethodDef(f))
createBlankNotebook()
