from setuptools import setup, find_packages

setup(
    name='zjchain',
    version='0.1.1',
    packages=find_packages(),
    install_requires=[
        'web3',
        'safe-pysha3',
        'secp256k1',
        'locust',
        'eth-utils',
        'eth-keys',
        'ecdsa',
        'eth-abi',
        'eth-account',
        'coincurve',
        'requests',
    ]
)
