import os
import json
from flask import Flask, render_template, request, make_response, jsonify

# from ./ipynb_modifiers import

template_dir = os.path.dirname(os.path.abspath(__file__))
template_dir = os.path.join(template_dir, "pages")
print(template_dir)
app = Flask(__name__, template_folder=template_dir)


@app.route("/")
def entry_point():

    # TODO, plain html/js SPA
    # will have fields to enter the data and all js handers in the file
    # will interact with the other api methods here

    return render_template("index.html", account_key="keyyyy", campaign_id=44)


# BATCH ROUTES
@app.route("/batch", methods=["POST"])
def create_new_batch():

    uploaded_csv = request.form.get("ogContents")
    desired_csv = request.form.get("editedContents")

    print(uploaded_csv)
    f = open("virtualFileSystem/original_data.csv", "a")
    f.write(uploaded_csv)
    f.close()
    print(desired_csv)
    f = open("virtualFileSystem/desired_data.csv", "a")
    f.write(desired_csv)
    f.close()

    # Save 2 csvs
    # og
    # sample end

    # create ipynb
    # fill in the fields
    # give the client the name of the file

    return make_response(
        jsonify({"notebook": "virtualFileSystem/task_notebook.ipynb"}), 200
    )


@app.route("/validate")
def validate_task_submission():

    # exec the method on sample start
    # confirm output is equal to sample end

    return "TODO: run a submitted method on the sample data"


@app.route("/use")
def use_task_submission():

    # exec the method on og
    # provide link to download the file (just an href to the literal filepath)

    return "TODO: run a submitted method on the original data"


# TEMPLATE ROUTES


@app.route("/method")
def get_method_def():

    # given filename use the method to get the definition, return a big string
    return getMethodDef("virtualFileSystem/task_notebook.ipynb")


def getMethodDef(fname):
    with open(fname, "r") as notebook:
        notebook_json = json.loads(notebook.read())
        print(type(notebook_json))
        cells = notebook_json["cells"]

        for cell in cells:
            for line in cell["source"]:
                if "cleanData" in line:
                    response = jsonify({"method": "".join(cell["source"])})
                    response.headers.add("Access-Control-Allow-Origin", "*")
                    return response
                    # return "".join(cell["source"])

        return jsonify({"method": "error"})


if __name__ == "__main__":
    app.run(debug=False)
