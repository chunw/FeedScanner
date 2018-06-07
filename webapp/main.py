import os
import random
import time
import json
from flask import Flask, render_template, request, redirect, jsonify
import pymongo
from pymongo import MongoClient

client = MongoClient() # local database at default port
db = client['fbfeed']
collection = db.posts

app = Flask(__name__)

current_milli_time = lambda: int(round(time.time() * 1000))

@app.route("/", methods=['GET'])
def index():
    shouts = collection.find()
    return render_template('index.html', shouts=shouts)

@app.route("/ads", methods=['GET'])
def ads():
    shouts = collection.find()
    return render_template('ads.html', shouts=shouts)

@app.route("/post", methods=['POST'])
def post():
    data = json.loads(request.data)
    post = {
        "name" : data["name"],
        "content" : data["content"],
        "tag" : data["tag"]
    }
    collection.insert(post)
    return jsonify("")

@app.route("/get", methods=['GET'])
def get():
    posts = list(collection.find())
    print("chun")
    print(len(posts))
    l = [serial(item) for item in posts]
    data = [dict(t) for t in set([tuple(d.items()) for d in l])]  # de-duplicate
    return jsonify(data)

@app.route("/clear", methods=['POST'])
def clear():
    collection.remove({})
    return jsonify("")

def serial(dct):
    rtn = {}
    rtn["name"] = dct["name"]
    rtn["content"] = dct["content"]
    rtn["tag"] = dct["tag"]
    return rtn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
