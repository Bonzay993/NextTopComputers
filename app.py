import os
import uuid
from datetime import datetime, timedelta
from flask import (Flask, flash, render_template, 
                   redirect, request, session, url_for)
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from send_emails import EmailService



if os.path.exists("env.py"):
    import env

app = Flask(__name__)

app.config["MONGO_DBNAME"] = os.environ.get("MONGO_DBNAME")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.secret_key = os.environ.get("SECRET_KEY")
app.config['SECRET_KEY'] = 'top-secret!'
app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'apikey'
app.config['MAIL_PASSWORD'] = os.environ.get('SENDGRID_API_KEY')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')
app.config['SENDGRID_API_KEY'] = os.environ.get('SENDGRID_API_KEY') 

mongo = PyMongo(app)
email_service = EmailService(app)


@app.route("/forgot_password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form.get("email").lower()
        user = mongo.db.users.find_one({"email": email})
        
        if user:
            # Generate a token for password reset
            token = email_service.generate_token(email)
            reset_url = url_for('reset_password', token=token, _external=True)

            # Send the password reset email
            subject = "Password Reset Request"
            html_content = f"<p>Click the following link to reset your password:</p> <a href='{reset_url}'>{reset_url}</a>"
            response = email_service.send_email(email, subject, html_content)

            if response:
                flash("If this email is valid, you will receive a password reset link shortly.", 'info')
            else:
                flash("An error occurred while sending the reset email. Please try again later.", 'error')

        else:
            flash("No account found with that email address.", 'error')
        
        # Render the same page to display the flash message
        return render_template("forgot-password.html")

    return render_template("forgot-password.html")

@app.route("/reset_password/<token>", methods=["GET", "POST"])
def reset_password(token):
    email = email_service.verify_token(token)
    if not email:
        flash("The password reset link is invalid or has expired.", 'error')
        return redirect(url_for('forgot_password'))

    if request.method == "POST":
        new_password = request.form.get("password")
        hashed_password = generate_password_hash(new_password)
        
        # Update the password in the database
        mongo.db.users.update_one({"email": email}, {"$set": {"password": hashed_password}})
        
        flash("Your password has been updated successfully.", 'success')
        return redirect(url_for('sign_in'))

    return render_template("reset-password.html", token=token)


@app.route("/")
@app.route("/get_base")
def get_base():
      featured_products = get_featured_products()
      return render_template("base.html", featured_products=featured_products)

def get_featured_products():
    featured_products = []
    collection_names = mongo.db.list_collection_names()
    for collection_name in collection_names:
         collection = mongo.db[collection_name]  # Access the collection
        # Query for featured products
         products = collection.find({"featured": "yes"})
        # Add these products to the featured list
         featured_products.extend(products)

    return featured_products
    

@app.route('/search')
def search():
    query = request.args.get('query', '').lower()
    if not query:
        return render_template('search-results.html', results=[], query=query)

    # List of collections to exclude
    excluded_collections = ['users']

    results = []
    seen_ids = set()  # To track unique document IDs
    for collection_name in mongo.db.list_collection_names():
        if collection_name in excluded_collections:
            continue  

        collection = mongo.db[collection_name]

        # Search for string fields using regex
        for key in collection.find_one().keys():
            if isinstance(collection.find_one()[key], str):
                matches = collection.find({key: {"$regex": query, "$options": "i"}})
                for match in matches:
                    if match['_id'] not in seen_ids:
                        match['_collection'] = collection_name 
                        results.append(match)
                        seen_ids.add(match['_id'])

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




@app.route("/computing/desktops")
def get_desktops():
    desktops = mongo.db.desktops.find()
    return render_template("desktops.html", desktops=desktops)

@app.route("/computing/laptops")
def get_laptops():
    laptops = mongo.db.laptops.find()
    return render_template("laptops.html", laptops=laptops)

@app.route("/computing/peripherals")
def get_peripherals():
   peripherals = mongo.db.peripherals.find()
   return render_template("peripherals.html", peripherals=peripherals)


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
        port=int(os.environ.get("PORT")),
        debug=True)

