from flask import Flask, render_template, jsonify , request
from src.mongo_script.mong_query import trans_mongo
import datetime
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
trans_mongo_obj = trans_mongo()
CORS(app)

@app.route('/')
def sessions():
    return "ALive"


@app.route('/login',methods=["POST"])
def login():
    user_name = request.json.get("user_name",None)
    print(user_name)
    user_id = trans_mongo_obj.get_user_id(user_name)
    user_id.update({"server":"devenger"})
    return jsonify(user_id)


@app.route('/sendmoney', methods=["POST"])
def sendmoney():
    # print(request.json)
    sender_id = request.json.get("sender_id",None)
    reciver_id = request.json.get("reciver_id",None)
    amount = float(request.json.get("amount",None))
    invet_status = True if request.json.get("invet_status",None) else False
    invest_amount = float(request.json.get("invest_amount",None))
    print(invest_amount)

    trans_response = (trans_mongo_obj.internal_transaction(sender_id,reciver_id,amount,invest_amount))

    if trans_response["trans_status"] == "Failed":
        return trans_response

    if invet_status == True:
        invest_status = trans_mongo_obj.invest_transaction(sender_id,invest_amount)
        trans_response.update(invest_status)
 
    
    return jsonify(trans_response) 


@app.route("/investedmoney",methods=["GET"])
def investedmoney():
    user_id = request.args.get("user_id",None)
    invest_response = trans_mongo_obj.get_all_investment(user_id)
    return jsonify(invest_response)


@app.route("/usertransactions", methods = ["GET"])
def usertransactions():
    user_id = request.args.get("user_id",None)
    date = (request.args.get("date",None))
    print(date)
    date = datetime.datetime.strptime(date,"%Y-%m-%d %H:%M:%S.%f")
    respo = trans_mongo_obj.get_all_transaction(user_id,date)
    return jsonify(respo)

@app.route("/updatestatus", methods = ["POST"])
def updatestatus():
    user_id = request.json.get("user_id",None)
    amount = float(request.json.get("amount",None))
    res = trans_mongo_obj.user_amount_update(user_id,amount)
    return jsonify(res)



if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0",port=5005)