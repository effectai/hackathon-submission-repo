import os
from flask import Flask, render_template


template_dir = os.path.dirname(os.path.abspath(__file__))
template_dir = os.path.join(template_dir, "pages")
print(template_dir)
app = Flask(__name__, template_folder=template_dir)


@app.route("/")
def entry_point():
    return render_template("helloworld.html")
    # return "Hello World!"


if __name__ == "__main__":
    app.run(debug=False)
