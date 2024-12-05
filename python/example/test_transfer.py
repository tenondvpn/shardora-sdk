from zjchain.api import get_keypair, transfer


if __name__ == '__main__':
    sk = '373a3165ec09edea6e7a1c8cff21b06f5fb074386ece283927aef730c6d44596'

    to = 'ce7acc2cfbfdeddc7c033fc157f3854cc4e72d7b'
    keypair = get_keypair(bytes.fromhex(sk))
    print(keypair.account_id)
    transfer(gid='',
            to=to,
            amount=1000,
            gas_limit=100000,
            gas_price=1,
            keypair=keypair,
            des_shard_id=5)