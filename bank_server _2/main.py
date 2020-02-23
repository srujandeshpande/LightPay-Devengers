from flask import Flask, render_template, jsonify , request
from src.mongo_scripts.mong_query import bank_mongo
from time import sleep
import random
import datetime
from flask_cors import CORS



app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
bank_mongo_obj = bank_mongo()
CORS(app)



@app.route('/')
def sessions():
    return "ALive"

@app.route('/updatetransactions',methods=["POST"])
def updateTransactions():
    sender_id = request.json.get("sender_id",None)
    reciver_id = request.json.get("reciver_id",None)
    amount = float(request.json.get("amount",None))

    status = bool(random.getrandbits(1))    
    if status == True:
        print("calling bank 2 server")
        response = bank_mongo_obj.debit_transaction(sender_id,reciver_id,amount)
        
        return {"status":"success"}
    else:
        return{"status":"Failed","error":"server is down"}

@app.route("/recive_transaction",methods=["POST"])
def recive_transaction():
    user_id = request.json.get("user_id",None)
    amount = float(request.json.get("amount",None))
    credit_response = bank_mongo_obj.credit_transaction(user_id,amount)
    return jsonify(credit_response)


@app.route('/login',methods=["POST"])
def login():
    user_name = request.json.get("user_name",None)
    print(user_name)
    user_id = bank_mongo_obj.get_user_id(user_name)
    user_id.update({"server":"bank_server_1"})
    return jsonify(user_id)

@app.route('/withdrawal',methods = ["POST"])
def withdrawal():
    user_id = request.json.get("user_id",None)
    amount = float(request.json.get("amount",None))
    respo = bank_mongo_obj.withdrawal(user_id,amount)
    return jsonify(respo)


if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0",port=5007)