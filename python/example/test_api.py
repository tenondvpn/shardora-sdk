import time
import sys
sys.path.append('../')
from eth_utils import decode_hex, encode_hex
from zjchain.api import get_keypair, transfer, post_data, deploy_contract, call_contract_function, query_contract_function, check_contract_deploy_success, contract_prepayment, gen_gid

def confirmation_of_rights(private_key, key, value, rights_address=""):
     if rights_address == "":
          rights_address = 'a0793c84fb3133c0df1b9a6ccccbbfe5e7545138'

     if not transfer(
               str_prikey=private_key,
               to=rights_address,
               amount=0,
               key=key,
               val=value):
          print("confirmation_of_rights failed")
          sys.exit(1)

     print("确权成功！")
     
     
def get_confirmation_of_rights_list(count = 10, rights_address=""):
     if rights_address == "":
          rights_address = 'a0793c84fb3133c0df1b9a6ccccbbfe5e7545138'

     res = post_data("http://82.156.224.174:801/zjchain/confirm_transactions/", {
            "type": 0,
            "search": rights_address,
            "limit": f"0, {count}",
        })
     
     print(f"获取确权列表: {res.text}")


if __name__ == '__main__':
     sk = 'cefc2c33064ea7691aee3e5e4f7842935d26f3ad790d81cf015e79b78958e848'
     # 测试转账交易
     gid = gen_gid()
     if not transfer(str_prikey=sk, gid=gid, to='ce7acc2cfbfdeddc7c033fc157f3854cc4e72d7b', amount=1000):
          print(f"transfer failed: {gid}")
          sys.exit(1)

     print(f"transfer success: {gid}")
     sys.exit(0)
     #测试确权
     confirmation_of_rights(private_key=sk, key="confirm", value=encode_hex("value")[2:])
     time.sleep(3)

     #获取确权列表
     get_confirmation_of_rights_list()

     #测试合约创建部署
     contract_address = deploy_contract(
          private_key=sk, 
          amount=0, 
          sol_file_path="./bjd.sol", 
          constructor_types=[], 
          constructor_params=[])
     if contract_address is None:
          print("deploy_contract failed!")
          sys.exit(1)

     if not contract_prepayment(
               private_key=sk, 
               contract_address=contract_address, 
               prepayment=100000000000):
          print("contract_prepayment failed!")
          sys.exit(1)

     print("部署合约成功！")
     #测试合约调用
     call_contract = call_contract_function(
               private_key=sk, 
               contract_address=contract_address,
               amount=0, 
               function="initialize", 
               types_list=['address'], 
               params_list=['ce7acc2cfbfdeddc7c033fc157f3854cc4e72d7b'])
     if not call_contract:
          print("call contract failed!")
          sys.exit(1)

     print("调用合约函数 'initialize' 成功")

     # 测试合约查询
     query_contract_res = query_contract_function(
          private_key=sk, 
          contract_address=contract_address,
          function="QueryContract", 
          types_list=['bytes'], 
          params_list=[decode_hex('ce7acc2cfbfdeddc7c033fc157f3854cc4e72d7b')])
     print(f"查询合约成功: {query_contract_res}")