import os
from flask import (Flask, flash, render_template, 
redirect, request, session, url_for)
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

if os.path.exists("env.py"):
    import env

app = Flask(__name__)

app.config["MONGO_DBNAME"] = os.environ.get("MONGO_DBNAME")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.secret_key = os.environ.get("SECRET_KEY")

mongo = PyMongo(app)

@app.route("/")
@app.route("/get_base")
def get_base():
    return render_template("base.html")


@app.route('/search')
def search():
    query = request.args.get('query', '').lower()
    if not query:
        return render_template('search-results.html', results=[], query=query)

    # List of collections to exclude
    excluded_collections = ['users']

    results = []
    for collection_name in mongo.db.list_collection_names():
        if collection_name in excluded_collections:
            continue  

        collection = mongo.db[collection_name]

        # Search for string fields using regex
        for key in collection.find_one().keys():
            if isinstance(collection.find_one()[key], str):
                matches = collection.find({key: {"$regex": query, "$options": "i"}})
                for match in matches:
                    match['_collection'] = collection_name  # Add collection name for reference
                    results.append(match)

    return render_template('search-results.html', results=results, query=query)

@app.route("/sign_in", methods=["GET", "POST"])
def sign_in():
    if request.method == "POST":
        #check if username already exists in db
        existing_user = existing_user = mongo.db.users.find_one(
            {"email": request.form.get("email").lower()})

        if existing_user:
            #ensure hashed password matches user input
            if check_password_hash(
                existing_user["password"], request.form.get("password")):
                    session["user"] = request.form.get("email").lower()
                    flash("Welcome, {}".format(request.form.get("email")),'success')
            else:
                #invalid password
                flash("Incorrect Email and/or Password",'error')
                return redirect(url_for("sign_in"))
    
        else:
            #username doesn't exist
            flash("Incorrect Email and/or Password", 'error')
            return redirect(url_for("sign_in"))

    return render_template("sign-in.html")


@app.route("/register", methods=["GET","POST"])
def register():
    if request.method == "POST":
        #check if username already exists in db
        existing_user = mongo.db.users.find_one(
            {"email": request.form.get("email").lower()})
        
        if existing_user:
            flash("Email already exists. Please choose a different email or click on Forgot Password", 'error')
            return redirect(url_for("register"))

        register = {
            "first_name": request.form.get("first_name").lower(),
            "last_name": request.form.get("last_name").lower(),
            "email": request.form.get("email").lower(),
            "phone_number":request.form.get("phone_number"),
            "password": generate_password_hash(request.form.get("password")),
        }

        mongo.db.users.insert_one(register)

        # put the new user into 'session' cookie
        session["user"] = request.form.get("email").lower()
        flash('Registration Successful. Please sign in below', 'success')
        return redirect(url_for("sign_in"))
    return render_template("register.html")


@app.route("/forgot_password")
def forgot_password():
    return render_template("forgot-password.html")

@app.route("/get_desktops")
def get_desktops():
    desktops = mongo.db.desktops.find()
    return render_template("desktops.html", desktops=desktops)


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
        port=int(os.environ.get("PORT")),
        debug=True)


