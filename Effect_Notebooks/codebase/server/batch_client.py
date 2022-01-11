import os
from flask import Flask, render_template

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

    return render_template("index.html")


# BATCH ROUTES
@app.route("/batch")
def create_new_batch():

    # Save 3 csvs
    # og
    # sample start
    # sample end

    # create ipynb
    # fill in the fields
    # give the client the name of the file

    return "TODO: supply the data needed to create batch tasks"


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

    return "TODO: get the method out of a given file"


if __name__ == "__main__":
    app.run(debug=False)
