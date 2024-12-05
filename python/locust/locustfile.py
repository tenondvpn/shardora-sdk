import itertools

from locust import HttpUser, task, constant_throughput, FastHttpUser
from zjchain.api import get_transfer_params, get_keypair
from urllib.parse import urlencode

class S3User(FastHttpUser):
    wait_time = constant_throughput(10)
    host = 'http://10.101.20.33:8405'


    @task
    def transfer_to_s3(self):
        self.client.base_url = 'http://10.101.20.35:8301'
        to = 'd9ec5aff3001dece14e1f4a35a39ed506bd6274a'
        sk = 'b5039128131f96f6164a33bc7fbc48c2f5cf425e8476b1c4d0f4d186fbd0d708'
        keypair = get_keypair(bytes.fromhex(sk))
        data = get_transfer_params(
            gid='',
            to=to,
            amount=10,
            gas_limit=100000,
            gas_price=1,
            keypair=keypair,
            des_shard_id=3)
        querystr = urlencode(data)
        res = self.client.post("/transaction", data=data, headers={
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': str(len(bytes(querystr, 'utf-8'))),
        })
        print("s3 response status code: ", res.status_code)

    @task(0)
    def transfer_to_s4(self):
        self.client.base_url = 'http://10.101.20.33:8405'
        to = '6cb0b390a1eea1d83eb743e592c47082df5bf75c'
        sk = 'fa04ebee157c6c10bd9d250fc2c938780bf68cbe30e9f0d7c048e4d081907971'        
        keypair = get_keypair(bytes.fromhex(sk))
        data = get_transfer_params(
            gid='',
            to=to,
            amount=10,
            gas_limit=100000,
            gas_price=1,
            keypair=keypair,
            des_shard_id=4)
        querystr = urlencode(data)
        res = self.client.post("/transaction", data=data, headers={
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': str(len(bytes(querystr, 'utf-8'))),
        })
        print("s4 response status code: ", res.status_code)        

    @task(0)
    def transfer_to_s5(self):
        self.client.base_url = 'http://10.101.20.32:8503'
        to = 'ce7acc2cfbfdeddc7c033fc157f3854cc4e72d7b'
        sk = '373a3165ec09edea6e7a1c8cff21b06f5fb074386ece283927aef730c6d44596'        
        keypair = get_keypair(bytes.fromhex(sk))
        data = get_transfer_params(
            gid='',
            to=to,
            amount=10,
            gas_limit=100000,
            gas_price=1,
            keypair=keypair,
            des_shard_id=5)
        querystr = urlencode(data)
        res = self.client.post("/transaction", data=data, headers={
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': str(len(bytes(querystr, 'utf-8'))),
        })
        print("s5 response status code: ", res.status_code)  