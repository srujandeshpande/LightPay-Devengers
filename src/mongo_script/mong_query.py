from pymongo import MongoClient
from bson import ObjectId
import datetime


class trans_mongo:
    def __init__(self):
        self.client = MongoClient('localhost', 27017)
        self.db = self.client.Devs

    def user_collection(self):
        collections_ = self.db.users
        return collections_

    def trans_collections(self):
        collections_ = self.db.trans
        return collections_

    def invest_collections(self):
        collections_ = self.db.invest
        return collections_

    def get_all_transaction(self,user_id,date):
        all_trans = self.trans_collections().find({"user_id": user_id,'trans_time': {'$gte':date}})
        print(all_trans)
        count=0
        for i in all_trans:
            print(i)
            count+=1
        print(count)
        return {}

    def internal_transaction(self, sender_id, reciver_id, amount):
        sender_info = self.user_collection().find_one({"_id": ObjectId(sender_id)})

        if sender_info["avaiable_bal"] >= amount:
            new_bal = sender_info["avaiable_bal"] - amount
            sender_query = {"user_id": sender_id,
                     "trans_type": "debit",
                     "amount": amount,
                     "transaction_status": "success",
                     "available": new_bal,
                     "sync": False,
                     "trans_time": datetime.datetime.now(),
                     "bank_id": sender_info["band_id"]
                     }

            sender_trans_id = self.trans_collections().insert_one(sender_query).inserted_id
            update_sender = { "$set": {"avaiable_bal": new_bal, "last_transaction_id":str(sender_trans_id)}}
            sender_status = self.user_collection().update_one({"_id":ObjectId(sender_id)},update_sender)

            reciver_info = self.user_collection().find_one({"_id": ObjectId(reciver_id)})  
            reciver_query = {"user_id": reciver_id,
                     "trans_type": "credit",
                     "amount": amount,
                     "transaction_status": "success",
                     "available": reciver_info["avaiable_bal"] + amount,
                     "sync": False,
                     "trans_time": datetime.datetime.now(),
                     "bank_id": reciver_info["band_id"]
                     }

            rec_trans_id = self.trans_collections().insert_one(reciver_query).inserted_id
            update_res = { "$set": {"avaiable_bal": reciver_info["avaiable_bal"] + amount , "last_transaction_id":str(rec_trans_id)}}
            reciver_status = self.user_collection().update_one({"_id":ObjectId(reciver_id)},update_res)

            return {"trans_status": "success","sender_id":sender_id,"remaining_bal":new_bal}


        else:
            return {"trans_status": "failed","error":"insufficant funds"}


    def invest_transaction(self,sender_id,amount):
        invester_info = self.user_collection().find_one({"_id": ObjectId(sender_id)})
        new_invest = float(invester_info["invest_amt"])+amount
        invester_query = {"user_id": sender_id,
                     "trans_type": "investment",
                     "amount": amount,
                     "transaction_status": "success",
                     "trans_time": datetime.datetime.now()
                     }

        invest_trans_id = self.invest_collections().insert_one(invester_query).inserted_id
        update_invest = { "$set": {"invest_amt": new_invest , "last_invester_id":str(invest_trans_id)}}
        invest_status = self.user_collection().update_one({"_id":ObjectId(sender_id)},update_invest)

        return {"invest_status":"successfull","new_invest": new_invest}


    def get_all_investment(self,user_id):

        invest_log = self.invest_collections().find({"user_id":str(user_id)})
        response_invest = {
            "status":"successful",
            "investments":[],
            "total_investment" : 0
        }
        logs = []
        total_invested = 0
        for invest in invest_log:
            total_invested += invest["amount"]
            ele = {
                "amount" : invest["amount"],
                "date" : invest["trans_time"]
            }
            logs.append(ele)

        response_invest["total_investment"] = total_invested
        response_invest["investments"] = logs

        return response_invest


    def get_user_id(self,user_name):
        _id = self.user_collection().find_one({"user_name":user_name})
        _id["_id"] = str(_id["_id"])
        return _id

