from pymongo import MongoClient
from bson import ObjectId
import datetime
import json
import requests 



class bank_mongo:
    def __init__(self):
        self.client = MongoClient('localhost', 27017)
        self.db = self.client.bank_1

    def user_collection(self):
        collections_ = self.db.users
        return collections_

    def trans_collections(self):
        collections_ = self.db.trans
        return collections_

    def get_all_transaction(self,user_id,date):
        all_trans = self.trans_collections().find({"user_id": user_id,'trans_time': {'$gte':date}})
        trans_list = []
        for itr in all_trans:
            itr["_id"] = str(itr["_id"])
            trans_list.append(itr)
        return trans_list

    def sync_db(self,user_id):
        print("syncing")
        user_info = self.user_collection().find_one({"user_id": user_id}) 
        reciver_response = requests.get(url = "http://0.0.0.0:5005/usertransactions", params = {"user_id":user_id,"date":user_info["last_sync"]}) 

        insert_trans = []
        for itr in json.loads((reciver_response.text)):
            ele = {"user_id": user_id,
                     "trans_type": itr["trans_type"],
                     "amount": itr["amount"],
                     "transaction_status": "success",
                     "available": itr["available"],
                     "trans_time":datetime.datetime.now(),
                     }
            
            new_balance = itr["available"]
            last_sync = datetime.datetime.now()

            insert_trans.append(ele)

        if insert_trans != []:
            self.trans_collections().insert_many(insert_trans)
            update_user = { "$set": {"avaiable_bal": new_balance, "last_sync":(last_sync)}}
            user_status = self.user_collection().update_one({"user_id":user_id},update_user)

        return {"status":"success"}


    def debit_transaction(self, sender_id, reciver_id, amount):
        self.sync_db(sender_id)        
        sender_info = self.user_collection().find_one({"user_id": sender_id})  

        if sender_info["avaiable_bal"] >= amount:
            new_bal = sender_info["avaiable_bal"] - amount
            sender_query = {"user_id": sender_id,
                     "trans_type": "debit",
                     "amount": amount,
                     "transaction_status": "success",
                     "available": new_bal,
                     "trans_time": datetime.datetime.now(),
                     }

            sender_trans_id = self.trans_collections().insert_one(sender_query).inserted_id
            update_sender = { "$set": {"avaiable_bal": new_bal, "last_transaction_id":str(sender_trans_id)}}
            sender_status = self.user_collection().update_one({"user_id":sender_id},update_sender)

            response_res = {"sender_status": "success","sender_id":sender_id,"sender_bal":new_bal}

            reciver_response = requests.post(url = "http://0.0.0.0:5007/recive_transaction", json = {"user_id":reciver_id,"amount":amount}) 

            return {"sender":response_res,"reciver":reciver_response}



        else:
            return {"trans_status": "failed","error":"insufficant funds"}


    def credit_transaction(self,reciver_id, amount):
        self.sync_db(reciver_id)
        reciver_info = self.user_collection().find_one({"user_id": reciver_id})
        new_bal = reciver_info["avaiable_bal"] + amount
        reciver_query = {"user_id": reciver_id,
                    "trans_type": "debit",
                    "amount": amount,
                    "transaction_status": "success",
                    "available": new_bal,
                    "trans_time": datetime.datetime.now(),
                    }

        reciver_trans_id = self.trans_collections().insert_one(reciver_query).inserted_id
        update_reciver = { "$set": {"avaiable_bal": new_bal, "last_transaction_id":str(reciver_trans_id)}}
        reciver_status = self.user_collection().update_one({"user_id":reciver_id},update_reciver)       

        return {"reciver_status": "success","reciver_id":reciver_id,"reciver_bal":new_bal}


    def get_user_id(self,user_name):
        _id = self.user_collection().find_one({"user_name":user_name})
        _id["_id"] = str(_id["_id"])
        return _id



    def user_amount_update(self,user_id,amount):
        update_amount = {
            "$set": {"avaiable_bal": amount }
        }
        user_update = self.user_collection().update_one({"_id":ObjectId(user_id)},update_amount)
        return {"status":"successfull"}

        

    def withdrawal(self, user_id, amount):
        self.sync_db(user_id)        
        user_info = self.user_collection().find_one({"user_id": user_id})  
        # print(float(user_info["avaiable_bal"]) >= amount)
        if float(user_info["avaiable_bal"]) >= amount:
            new_bal = user_info["avaiable_bal"] - amount
            # print(new_bal,amount,user_info["avaiable_bal"])
            sender_query = {"user_id": user_id,
                     "trans_type": "withdraw",
                     "amount": amount,
                     "transaction_status": "success",
                     "available": new_bal,
                     "trans_time": datetime.datetime.now(),
                     }

            user_trans_id = self.trans_collections().insert_one(sender_query).inserted_id
            update_sender = { "$set": {"avaiable_bal": new_bal, "last_transaction_id":str(user_trans_id)}}
            sender_status = self.user_collection().update_one({"user_id":user_id},update_sender)
            response_res = {"sender_status": "success","sender_id":user_id,"sender_bal":new_bal}

            return {"amount":new_bal,"status":"successfull"}

        else:
            return {"status":"failed","error":"insuficant funds"} 