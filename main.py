from fastapi import FastAPI
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

config = {
    "host": "127.0.0.1",
    "port": "3306",
    "user": "root",
    "database": "socialtest"
}

class User(BaseModel):
    username: str
    password: str
    name: str
    surname: str

class Login(BaseModel):
    username: str
    password: str

class Post(BaseModel):
    text: str
    username: str

import hashlib
# turns a normal string password into a string 256 bit SHA-3 encoded in hexadecimal
def toHash(password: str):
    return hashlib.sha3_256(password.encode(encoding='utf-8')).hexdigest()



@app.post("/register")
def register(user: User):
    user.password = toHash(user.password)

    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)
    cursor.execute(f"INSERT INTO users(username, password, name, surname) VALUES ('{user.username}', '{user.password}', '{user.name}', '{user.surname}');")
    connect.commit()
    connect.close()
    return {"success": True}

@app.post("/login")
def login(login: Login):
    login.password = toHash(login.password)
    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)
    cursor.execute(f"SELECT username, name, surname FROM users WHERE username = '{login.username}' AND password = '{login.password}';")
    test = cursor.fetchone()
    connect.close()
    return test


@app.get("/getUser")
def getUser(username: str):
    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM users WHERE username = '{username}';")
    user = cursor.fetchone()
    connect.close()
    return user

@app.get("/getPassword")
def getPassword(username: str):
    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM users WHERE password = '{toHash(username)}';")
    password = cursor.fetchone()
    connect.close()
    return password

@app.post("/createPost")
def createPost(post: Post):
    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)
    cursor.execute(f"INSERT INTO posts(postAuthor, postText) VALUES ('{post.username}', '{post.text}');")
    connect.commit()
    connect.close()
    return True

@app.get("/getAllPosts")
def getAllPosts():
    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM POSTS;")
    posts = cursor.fetchall()
    connect.close()
    return posts