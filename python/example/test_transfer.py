import sys
sys.path.append('../zjchain')
from zjchain import api

if __name__ == '__main__':
    res = api.transfer('373a3165ec09edea6e7a1c8cff21b06f5fb074386ece283927aef730c6d44596',
            'ce7acc2cfbfdeddc7c033fc157f3854cc4e72d7b',
            amount=1000)
    print(res)
