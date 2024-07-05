from fastapi import FastAPI
from pydantic import BaseModel
import mysql.connector
from os import urandom # Used to generate salt
from base64 import b64encode # Used to decode

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

# Creates a random, 16 characters long utf-8 string that acts as salt for the users password
def createSalt():
    return b64encode(urandom(12)).decode('utf-8')

import hashlib # Used to hash passwords and salts
# Combines the users password and the salt into one string and converts it into a 256 bit SHA-3 string encoded in hexadecimal
def toHash(password: str, salt: str):
    hashPassword = password+salt
    return hashlib.sha3_256(hashPassword.encode(encoding='utf-8')).hexdigest()

@app.post("/register")
def register(user: User):
    salt = createSalt()
    user.password = toHash(user.password, salt)

    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)
    cursor.execute(f"INSERT INTO users(username, password, name, surname, salt) VALUES ('{user.username}', '{user.password}', '{user.name}', '{user.surname}', '{salt}');")
    connect.commit()
    connect.close()
    return True

# "if not salt/userData": if the user doesnt exist, it will return False instead of erroring out
@app.post("/login")
def login(login: Login):
    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)

    cursor.execute(f"SELECT salt FROM users WHERE username = '{login.username}';")

    salt = cursor.fetchone()
    if not salt:
        connect.close()
        return False
    
    login.password = toHash(login.password, salt['salt'])

    cursor.execute(f"SELECT username, name, surname FROM users WHERE username = '{login.username}' AND password = '{login.password}';")
    userData = cursor.fetchone()
    connect.close()

    if not userData:
        return False
    return userData

# For testing
@app.get("/getUser")
def getUser(username: str):
    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)

    cursor.execute(f"SELECT username, name, surname FROM users WHERE username = '{username}';")

    user = cursor.fetchone()

    connect.close()

    return user

# For testing
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

# For testing
@app.get("/getAllPosts")
def getAllPosts():
    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)

    cursor.execute("SELECT * FROM POSTS;")

    posts = cursor.fetchall()
    connect.close()

    return posts

@app.post("/modifyUser")
def modifyUser(user: User):
    salt = createSalt()
    user.password = toHash(user.password, salt)

    connect = mysql.connector.connect(**config)
    cursor = connect.cursor(dictionary=True)

    cursor.execute(f"UPDATE users SET password='{user.password}', name='{user.name}', surname='{user.surname}', salt='{salt}' WHERE username='{user.username}';")

    connect.commit()
    connect.close()

    return True
