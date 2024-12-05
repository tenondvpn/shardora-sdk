import requests
import sha3
import uuid
import hashlib

from eth_keys import keys, datatypes
from secp256k1 import PrivateKey, PublicKey
from eth_utils import decode_hex, encode_hex
from ecdsa import SigningKey, SECP256k1
from web3 import Web3, AsyncWeb3, eth, utils
from eth_keys import keys, datatypes
from eth_utils import decode_hex, encode_hex
from eth_abi import encode
from urllib.parse import urlencode
from eth_account.datastructures import SignedMessage
from eth_account.messages import encode_defunct, encode_structured_data, SignableMessage
from eth_account import Account
from collections import namedtuple
from coincurve import PrivateKey as cPrivateKey


w3 = Web3(Web3.IPCProvider('/Users/myuser/Library/Ethereum/geth.ipc'))

http_ip = "10.101.20.35"
http_port = "8301"

Keypair = namedtuple('Keypair', ['skbytes', 'pkbytes', 'account_id'])
Sign = namedtuple('Sign', ['r', 's', 'v'])

STEP_FROM = 0


def transfer(gid: str, to: str, amount: int, gas_limit: int, gas_price: int, keypair: Keypair, des_shard_id: int):
    params = get_transfer_params(gid=gid,
                                 to=to,
                                 amount=amount,
                                 gas_limit=gas_limit,
                                 gas_price=gas_price,
                                 keypair=keypair,
                                 des_shard_id=des_shard_id)
    print(_call_tx(params))


def get_transfer_params(gid: str, to: str, amount: int, gas_limit: int, gas_price: int, keypair: Keypair, des_shard_id: int):
    if gid == '':
        gid = _gen_gid()
    sign = _sign_message(keypair=keypair,
                        gid=gid,
                        to=to,
                        amount=amount,
                        gas_limit=gas_limit,
                        gas_price=gas_price,
                        step=STEP_FROM,
                        contract_bytes='',
                        input='',
                        prepay=0)
    params = _get_tx_params(sign=sign,
                            pkbytes=keypair.pkbytes,
                            gid=gid,
                            to=to,
                            amount=amount,
                            prepay=0,
                            gas_limit=gas_limit,
                            gas_price=gas_price,
                            contract_bytes='',
                            input='',
                            des_shard_id=des_shard_id,
                            step=STEP_FROM)
    return params



def get_pk_and_cpk(skbytes: bytes) -> tuple[bytes, bytes, bytes]:
    privkey = skbytes
    sk = SigningKey.from_string(privkey, curve=SECP256k1)
    pk = sk.verifying_key
    public_key = pk.to_string()
    compressed_public_key = pk.to_string("compressed")
    return privkey, public_key, compressed_public_key


def random_skbytes() -> bytes:
    # 生成 32 字节的随机数作为私钥
    sk = SigningKey.generate(curve=SECP256k1)
        
    return sk.to_string()


def skbytes2account(skbytes: bytes) -> str:
    sk = skbytes.hex()
    _, pk_bytes, _ = get_pk_and_cpk(sk)
    return pkbytes2account(pk_bytes)


def pkbytes2account(pub_key_bytes: bytes) -> str:
    addr = _keccak256_bytes(pub_key_bytes)
    return addr[len(addr)-40:len(addr)]


def get_keypair(skbytes: bytes) -> Keypair:
    _, pkbytes, _ = get_pk_and_cpk(skbytes=skbytes)
    addr = _keccak256_bytes(pkbytes)
    account_id = addr[len(addr)-40:len(addr)]
    return Keypair(skbytes=skbytes, pkbytes=decode_hex('04'+pkbytes.hex()), account_id=account_id)


def _encode_func_signature(func_str: str) -> str:
    return _keccak256_str(func_str)[:8]


def _encode_func_param(param_types: list, param_values: list) -> str:
    return encode_hex(encode(param_types, param_values))[2:]


def _keccak256_bytes(b: bytes) -> str:
    k = sha3.keccak_256()
    k.update(b)
    return k.hexdigest()

def _keccak256_str(s: str) -> str:
    k = sha3.keccak_256()
    k.update(bytes(s, 'utf-8'))
    return k.hexdigest()
    
    
def _sign_message(keypair: Keypair, gid: str, to: str, amount: int, gas_limit: int, gas_price: int, step: int, contract_bytes: str, input: str, prepay: int):
    frompk = keypair.pkbytes
    b = decode_hex(gid) + frompk + decode_hex(to) + _long_to_bytes(amount) + _long_to_bytes(gas_limit) + _long_to_bytes(gas_price) + _long_to_bytes(step)
    if contract_bytes != '':
        b += decode_hex(contract_bytes)
    if input != '':
        b += decode_hex(input)
    b += _long_to_bytes(prepay)

    h = _keccak256_bytes(b)
    sign_bytes = cPrivateKey(keypair.skbytes).sign_recoverable(bytes.fromhex(h), hasher=None)

    # message = encode_defunct(hexstr=h)
    # sign = Account.sign_message(message, keypair.skbytes)
    return _parse_sign_bytes(sign_bytes)

def _parse_sign_bytes(sign_bytes) -> Sign:
    if len(sign_bytes) == 65:
    # 分解签名为 r, s, 和 v
        r = sign_bytes[:32]
        s = sign_bytes[32:64]
        v = sign_bytes[64]  # 注意: 在某些情况下，你可能需要对v值进行调整

    r_hex = r.hex()
    s_hex = s.hex()
        
    return Sign(r=r_hex, s=s_hex, v=v)


def _long_to_bytes(i: int) -> bytes:
    return i.to_bytes(8, 'little')


def _get_random_hex_str() -> str:
    return uuid.uuid4().hex


def _gen_gid() -> str:
    hex_str = _get_random_hex_str()
    ret = hashlib.sha256(hex_str.encode('utf-8')).hexdigest()
    return (64 - len(ret)) * '0' + ret


def _get_tx_params(sign, pkbytes: bytes, gid: str, gas_limit: int, gas_price: int,
                   to: str, amount: int, prepay: int, contract_bytes: str, des_shard_id: int,
                   input: str, step: int):
    ret = {
        'gid': gid,
        'pubkey': encode_hex(pkbytes)[2:],
        'to': to,
        'type': step,
        'amount': amount,
        'gas_limit': gas_limit,
        'gas_price': gas_price,
        'shard_id': des_shard_id,
        'sign_r': sign.r,
        'sign_s': sign.s,
        'sign_v': sign.v,
        'pepay': prepay,
        }
    
    if contract_bytes != '':
        ret['bytes_code'] = contract_bytes

    if input != '':
        ret['input'] = input

    return ret


def _call_tx(post_data: dict):
    return _post_data("http://{}:{}/transaction".format(http_ip, http_port), post_data)


def _post_data(path: str, data: dict):
    querystr = urlencode(data)
    res = requests.post(path, data=data, headers={
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': str(len(bytes(querystr, 'utf-8'))),
    })
    return res
