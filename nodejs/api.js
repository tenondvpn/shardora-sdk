const Web3 = require('web3');
var net = require('net');
var web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
const { randomBytes } = require('crypto');
const Secp256k1 = require('./secp256k1.js');
const keccak256 = require('keccak256');
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var self_private_key = null;
var self_public_key = null;
var local_count_shard_id = 3;
var contract_address = null;
const CONTRACT_CODE = "60806040526000805560405162002a6138038062002a6183398181016040528101906200002d919062000459565b60008251905060005b81811015620000ca576001600460008684815181106200005b576200005a620004de565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508080620000c19062000546565b91505062000036565b50600080819055506001600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600290816200017c9190620007d4565b50505050620008bb565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001ea826200019f565b810181811067ffffffffffffffff821117156200020c576200020b620001b0565b5b80604052505050565b60006200022162000186565b90506200022f8282620001df565b919050565b600067ffffffffffffffff821115620002525762000251620001b0565b5b602082029050602081019050919050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620002958262000268565b9050919050565b620002a78162000288565b8114620002b357600080fd5b50565b600081519050620002c7816200029c565b92915050565b6000620002e4620002de8462000234565b62000215565b905080838252602082019050602084028301858111156200030a576200030962000263565b5b835b81811015620003375780620003228882620002b6565b8452602084019350506020810190506200030c565b5050509392505050565b600082601f8301126200035957620003586200019a565b5b81516200036b848260208601620002cd565b91505092915050565b600080fd5b600067ffffffffffffffff821115620003975762000396620001b0565b5b620003a2826200019f565b9050602081019050919050565b60005b83811015620003cf578082015181840152602081019050620003b2565b60008484015250505050565b6000620003f2620003ec8462000379565b62000215565b90508281526020810184848401111562000411576200041062000374565b5b6200041e848285620003af565b509392505050565b600082601f8301126200043e576200043d6200019a565b5b815162000450848260208601620003db565b91505092915050565b6000806040838503121562000473576200047262000190565b5b600083015167ffffffffffffffff81111562000494576200049362000195565b5b620004a28582860162000341565b925050602083015167ffffffffffffffff811115620004c657620004c562000195565b5b620004d48582860162000426565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000819050919050565b600062000553826200053c565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036200058857620005876200050d565b5b600182019050919050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620005e657607f821691505b602082108103620005fc57620005fb6200059e565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620006667fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000627565b62000672868362000627565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620006b5620006af620006a9846200053c565b6200068a565b6200053c565b9050919050565b6000819050919050565b620006d18362000694565b620006e9620006e082620006bc565b84845462000634565b825550505050565b600090565b62000700620006f1565b6200070d818484620006c6565b505050565b5b81811015620007355762000729600082620006f6565b60018101905062000713565b5050565b601f82111562000784576200074e8162000602565b620007598462000617565b8101602085101562000769578190505b62000781620007788562000617565b83018262000712565b50505b505050565b600082821c905092915050565b6000620007a96000198460080262000789565b1980831691505092915050565b6000620007c4838362000796565b9150826002028217905092915050565b620007df8262000593565b67ffffffffffffffff811115620007fb57620007fa620001b0565b5b620008078254620005cd565b6200081482828562000739565b600060209050601f8311600181146200084c576000841562000837578287015190505b620008438582620007b6565b865550620008b3565b601f1984166200085c8662000602565b60005b8281101562000886578489015182556001820191506020850194506020810190506200085f565b86831015620008a65784890151620008a2601f89168262000796565b8355505b6001600288020188555050505b505050505050565b61219680620008cb6000396000f3fe6080604052600436106100a75760003560e01c80638da5cb5b116100645780638da5cb5b1461021c578063a257325a14610247578063e802a85014610284578063e8039e35146102ad578063e9073fc6146102ea578063f62aef3314610306576100a7565b80630cdb0d53146100ac578063210d66f8146100e95780632e559c0d14610128578063593b79fe1461016557806370587c10146101a2578063856ed094146101df575b600080fd5b3480156100b857600080fd5b506100d360048036038101906100ce9190611550565b61032f565b6040516100e09190611618565b60405180910390f35b3480156100f557600080fd5b50610110600480360381019061010b9190611670565b610535565b60405161011f939291906116ed565b60405180910390f35b34801561013457600080fd5b5061014f600480360381019061014a9190611670565b610607565b60405161015c9190611618565b60405180910390f35b34801561017157600080fd5b5061018c60048036038101906101879190611757565b610664565b6040516101999190611618565b60405180910390f35b3480156101ae57600080fd5b506101c960048036038101906101c4919061186a565b61068d565b6040516101d69190611618565b60405180910390f35b3480156101eb57600080fd5b5061020660048036038101906102019190611757565b610815565b60405161021391906118e1565b60405180910390f35b34801561022857600080fd5b50610231610835565b60405161023e91906118fc565b60405180910390f35b34801561025357600080fd5b5061026e60048036038101906102699190611953565b61085b565b60405161027b9190611618565b60405180910390f35b34801561029057600080fd5b506102ab60048036038101906102a69190611a56565b610d83565b005b3480156102b957600080fd5b506102d460048036038101906102cf9190611b55565b610e78565b6040516102e19190611618565b60405180910390f35b61030460048036038101906102ff9190611550565b61117c565b005b34801561031257600080fd5b5061032d60048036038101906103289190611a56565b61129d565b005b60606000600283516103419190611be0565b67ffffffffffffffff81111561035a57610359611425565b5b6040519080825280601f01601f19166020018201604052801561038c5781602001600182028036833780820191505090505b50905060006040518060400160405280601081526020017f3031323334353637383961626364656600000000000000000000000000000000815250905060005b845181101561052a578182518683815181106103eb576103ea611c22565b5b602001015160f81c60f81b60f81c60ff166104069190611c80565b8151811061041757610416611c22565b5b602001015160f81c60f81b836002836104309190611be0565b8151811061044157610440611c22565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535081825186838151811061048657610485611c22565b5b602001015160f81c60f81b60f81c60ff166104a19190611cb1565b815181106104b2576104b1611c22565b5b602001015160f81c60f81b8360016002846104cd9190611be0565b6104d79190611ce2565b815181106104e8576104e7611c22565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350808061052290611d16565b9150506103cc565b508192505050919050565b600360205280600052604060002060009150905080600001805461055890611d8d565b80601f016020809104026020016040519081016040528092919081815260200182805461058490611d8d565b80156105d15780601f106105a6576101008083540402835291602001916105d1565b820191906000526020600020905b8154815290600101906020018083116105b457829003601f168201915b5050505050908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154905083565b6060602067ffffffffffffffff81111561062457610623611425565b5b6040519080825280601f01601f1916602001820160405280156106565781602001600182028036833780820191505090505b509050816020820152919050565b6060816040516020016106779190611e06565b6040516020818303038152906040529050919050565b60606000805b838110156106d7578481815181106106ae576106ad611c22565b5b602002602001015151826106c29190611ce2565b915080806106cf90611d16565b915050610693565b5060008167ffffffffffffffff8111156106f4576106f3611425565b5b6040519080825280601f01601f1916602001820160405280156107265781602001600182028036833780820191505090505b5090506000805b858110156108085760005b87828151811061074b5761074a611c22565b5b6020026020010151518110156107f45787828151811061076e5761076d611c22565b5b6020026020010151818151811061078857610787611c22565b5b602001015160f81c60f81b84848061079f90611d16565b9550815181106107b2576107b1611c22565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535080806107ec90611d16565b915050610738565b50808061080090611d16565b91505061072d565b5081935050505092915050565b60046020528060005260406000206000915054906101000a900460ff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6060600060088361086c9190611e21565b63ffffffff1667ffffffffffffffff81111561088b5761088a611425565b5b6040519080825280602002602001820160405280156108be57816020015b60608152602001906001900390816108a95790505b50905060006040518060400160405280600981526020017f7b2264617461223a5b000000000000000000000000000000000000000000000081525082828061090590611d16565b93508151811061091857610917611c22565b5b602002602001018190525060008054905060008590508163ffffffff1687876109419190611e21565b63ffffffff16111561095c5786826109599190611e59565b90505b60008763ffffffff1690505b87826109749190611e21565b63ffffffff16811015610af657610ab9600360008381526020019081526020016000206040518060600160405290816000820180546109b290611d8d565b80601f01602080910402602001604051908101604052809291908181526020018280546109de90611d8d565b8015610a2b5780601f10610a0057610100808354040283529160200191610a2b565b820191906000526020600020905b815481529060010190602001808311610a0e57829003601f168201915b505050505081526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160028201548152505060018a85610aa29190611e21565b610aac9190611e59565b63ffffffff168314610e78565b858580610ac590611d16565b965081518110610ad857610ad7611c22565b5b60200260200101819052508080610aee90611d16565b915050610968565b506040518060400160405280600b81526020017f5d2c22746f74616c223a22000000000000000000000000000000000000000000815250848480610b3990611d16565b955081518110610b4c57610b4b611c22565b5b6020026020010181905250610b7f82604051602001610b6b9190611ec7565b60405160208183030381529060405261032f565b848480610b8b90611d16565b955081518110610b9e57610b9d611c22565b5b60200260200101819052506040518060400160405280600c81526020017f222c226f6666736574223a220000000000000000000000000000000000000000815250848480610beb90611d16565b955081518110610bfe57610bfd611c22565b5b6020026020010181905250610c3187604051602001610c1d9190611ec7565b60405160208183030381529060405261032f565b848480610c3d90611d16565b955081518110610c5057610c4f611c22565b5b60200260200101819052506040518060400160405280600b81526020017f222c226c696d6974223a22000000000000000000000000000000000000000000815250848480610c9d90611d16565b955081518110610cb057610caf611c22565b5b6020026020010181905250610ce386604051602001610ccf9190611ec7565b60405160208183030381529060405261032f565b848480610cef90611d16565b955081518110610d0257610d01611c22565b5b60200260200101819052506040518060400160405280600281526020017f227d000000000000000000000000000000000000000000000000000000000000815250848480610d4f90611d16565b955081518110610d6257610d61611c22565b5b6020026020010181905250610d77848461068d565b94505050505092915050565b3373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610ddd57600080fd5b60008151905060005b81811015610e7357600160046000858481518110610e0757610e06611c22565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508080610e6b90611d16565b915050610de6565b505050565b60606000606467ffffffffffffffff811115610e9757610e96611425565b5b604051908082528060200260200182016040528015610eca57816020015b6060815260200190600190039081610eb55790505b50905060006040518060400160405280600c81526020017f7b2261757468496e666f223a0000000000000000000000000000000000000000815250828280610f1190611d16565b935081518110610f2457610f23611c22565b5b60200260200101819052508460000151828280610f4090611d16565b935081518110610f5357610f52611c22565b5b60200260200101819052506040518060400160405280600b81526020017f2c22617574686f72223a22000000000000000000000000000000000000000000815250828280610fa090611d16565b935081518110610fb357610fb2611c22565b5b6020026020010181905250610fd3610fce8660200151610664565b61032f565b828280610fdf90611d16565b935081518110610ff257610ff1611c22565b5b60200260200101819052506040518060400160405280600881526020017f222c226964223a2200000000000000000000000000000000000000000000000081525082828061103f90611d16565b93508151811061105257611051611c22565b5b602002602001018190525061107261106d8660400151610607565b61032f565b82828061107e90611d16565b93508151811061109157611090611c22565b5b60200260200101819052508315611107576040518060400160405280600281526020017f227d0000000000000000000000000000000000000000000000000000000000008152508282806110e490611d16565b9350815181106110f7576110f6611c22565b5b6020026020010181905250611168565b6040518060400160405280600381526020017f227d2c000000000000000000000000000000000000000000000000000000000081525082828061114990611d16565b93508151811061115c5761115b611c22565b5b60200260200101819052505b611172828261068d565b9250505092915050565b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff166111d257600080fd5b60405180606001604052808281526020013373ffffffffffffffffffffffffffffffffffffffff1681526020016000548152506003600080548152602001908152602001600020600082015181600001908161122e919061208e565b5060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015590505060008081548092919061129590611d16565b919050555050565b3373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146112f757600080fd5b60008151905060005b818110156113f1576004600084838151811061131f5761131e611c22565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16156113de576004600084838151811061138b5761138a611c22565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81549060ff02191690555b80806113e990611d16565b915050611300565b505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61145d82611414565b810181811067ffffffffffffffff8211171561147c5761147b611425565b5b80604052505050565b600061148f6113f6565b905061149b8282611454565b919050565b600067ffffffffffffffff8211156114bb576114ba611425565b5b6114c482611414565b9050602081019050919050565b82818337600083830152505050565b60006114f36114ee846114a0565b611485565b90508281526020810184848401111561150f5761150e61140f565b5b61151a8482856114d1565b509392505050565b600082601f8301126115375761153661140a565b5b81356115478482602086016114e0565b91505092915050565b60006020828403121561156657611565611400565b5b600082013567ffffffffffffffff81111561158457611583611405565b5b61159084828501611522565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156115d35780820151818401526020810190506115b8565b60008484015250505050565b60006115ea82611599565b6115f481856115a4565b93506116048185602086016115b5565b61160d81611414565b840191505092915050565b6000602082019050818103600083015261163281846115df565b905092915050565b6000819050919050565b61164d8161163a565b811461165857600080fd5b50565b60008135905061166a81611644565b92915050565b60006020828403121561168657611685611400565b5b60006116948482850161165b565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006116c88261169d565b9050919050565b6116d8816116bd565b82525050565b6116e78161163a565b82525050565b6000606082019050818103600083015261170781866115df565b905061171660208301856116cf565b61172360408301846116de565b949350505050565b611734816116bd565b811461173f57600080fd5b50565b6000813590506117518161172b565b92915050565b60006020828403121561176d5761176c611400565b5b600061177b84828501611742565b91505092915050565b600067ffffffffffffffff82111561179f5761179e611425565b5b602082029050602081019050919050565b600080fd5b60006117c86117c384611784565b611485565b905080838252602082019050602084028301858111156117eb576117ea6117b0565b5b835b8181101561183257803567ffffffffffffffff8111156118105761180f61140a565b5b80860161181d8982611522565b855260208501945050506020810190506117ed565b5050509392505050565b600082601f8301126118515761185061140a565b5b81356118618482602086016117b5565b91505092915050565b6000806040838503121561188157611880611400565b5b600083013567ffffffffffffffff81111561189f5761189e611405565b5b6118ab8582860161183c565b92505060206118bc8582860161165b565b9150509250929050565b60008115159050919050565b6118db816118c6565b82525050565b60006020820190506118f660008301846118d2565b92915050565b600060208201905061191160008301846116cf565b92915050565b600063ffffffff82169050919050565b61193081611917565b811461193b57600080fd5b50565b60008135905061194d81611927565b92915050565b6000806040838503121561196a57611969611400565b5b60006119788582860161193e565b92505060206119898582860161193e565b9150509250929050565b600067ffffffffffffffff8211156119ae576119ad611425565b5b602082029050602081019050919050565b60006119d26119cd84611993565b611485565b905080838252602082019050602084028301858111156119f5576119f46117b0565b5b835b81811015611a1e5780611a0a8882611742565b8452602084019350506020810190506119f7565b5050509392505050565b600082601f830112611a3d57611a3c61140a565b5b8135611a4d8482602086016119bf565b91505092915050565b600060208284031215611a6c57611a6b611400565b5b600082013567ffffffffffffffff811115611a8a57611a89611405565b5b611a9684828501611a28565b91505092915050565b600080fd5b600080fd5b600060608284031215611abf57611abe611a9f565b5b611ac96060611485565b9050600082013567ffffffffffffffff811115611ae957611ae8611aa4565b5b611af584828501611522565b6000830152506020611b0984828501611742565b6020830152506040611b1d8482850161165b565b60408301525092915050565b611b32816118c6565b8114611b3d57600080fd5b50565b600081359050611b4f81611b29565b92915050565b60008060408385031215611b6c57611b6b611400565b5b600083013567ffffffffffffffff811115611b8a57611b89611405565b5b611b9685828601611aa9565b9250506020611ba785828601611b40565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611beb8261163a565b9150611bf68361163a565b9250828202611c048161163a565b91508282048414831517611c1b57611c1a611bb1565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000611c8b8261163a565b9150611c968361163a565b925082611ca657611ca5611c51565b5b828204905092915050565b6000611cbc8261163a565b9150611cc78361163a565b925082611cd757611cd6611c51565b5b828206905092915050565b6000611ced8261163a565b9150611cf88361163a565b9250828201905080821115611d1057611d0f611bb1565b5b92915050565b6000611d218261163a565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611d5357611d52611bb1565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611da557607f821691505b602082108103611db857611db7611d5e565b5b50919050565b60008160601b9050919050565b6000611dd682611dbe565b9050919050565b6000611de882611dcb565b9050919050565b611e00611dfb826116bd565b611ddd565b82525050565b6000611e128284611def565b60148201915081905092915050565b6000611e2c82611917565b9150611e3783611917565b9250828201905063ffffffff811115611e5357611e52611bb1565b5b92915050565b6000611e6482611917565b9150611e6f83611917565b9250828203905063ffffffff811115611e8b57611e8a611bb1565b5b92915050565b60008160e01b9050919050565b6000611ea982611e91565b9050919050565b611ec1611ebc82611917565b611e9e565b82525050565b6000611ed38284611eb0565b60048201915081905092915050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302611f447fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82611f07565b611f4e8683611f07565b95508019841693508086168417925050509392505050565b6000819050919050565b6000611f8b611f86611f818461163a565b611f66565b61163a565b9050919050565b6000819050919050565b611fa583611f70565b611fb9611fb182611f92565b848454611f14565b825550505050565b600090565b611fce611fc1565b611fd9818484611f9c565b505050565b5b81811015611ffd57611ff2600082611fc6565b600181019050611fdf565b5050565b601f8211156120425761201381611ee2565b61201c84611ef7565b8101602085101561202b578190505b61203f61203785611ef7565b830182611fde565b50505b505050565b600082821c905092915050565b600061206560001984600802612047565b1980831691505092915050565b600061207e8383612054565b9150826002028217905092915050565b61209782611599565b67ffffffffffffffff8111156120b0576120af611425565b5b6120ba8254611d8d565b6120c5828285612001565b600060209050601f8311600181146120f857600084156120e6578287015190505b6120f08582612072565b865550612158565b601f19841661210686611ee2565b60005b8281101561212e57848901518255600182019150602085019450602081019050612109565b8683101561214b5784890151612147601f891682612054565b8355505b6001600288020188555050505b50505050505056fea264697066735822122082e522bded14ade510ee47a650dd646a32603e7a9779245c642a3a9db931d1cb64736f6c63430008110033"

function str_to_hex(str) {
    var arr1 = [];
    for (var n = 0; n < str.length; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }
    return arr1.join('');
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function init_private_key() {
    // const privateKeyBuf = Secp256k1.uint256("b5b3128c236fcec044c303b54d55a97e20bf98b625fec1de6a2a0fffcd8c7cf7", 16)
    //const privateKeyBuf = Secp256k1.uint256("1b2f993407b95324155ecbfcf2577e32174c8b66e5fdfa4da5677bccdc788763", 16)
    //const privateKeyBuf = Secp256k1.uint256("1ef07e73ed6211e7b0a512bc6468419fbdcd9b345b49a3331b4c8f8070172a70", 16)
    //const privateKeyBuf = Secp256k1.uint256("373a3165ec09edea6e7a1c8cff21b06f5fb074386ece283927aef730c6d44596", 16)
    //const privateKeyBuf = Secp256k1.uint256("fa04ebee157c6c10bd9d250fc2c938780bf68cbe30e9f0d7c048e4d081907971", 16)
    //manager
    const privateKeyBuf = Secp256k1.uint256("b5039128131f96f6164a33bc7fbc48c2f5cf425e8476b1c4d0f4d186fbd0d708", 16);
    self_private_key = Secp256k1.uint256(privateKeyBuf, 16);
    self_public_key = Secp256k1.generatePublicKeyFromPrivateKeyData(self_private_key);
    var pk_bytes = hexToBytes(self_public_key.x.toString(16) + self_public_key.y.toString(16));
    var address = keccak256(pk_bytes).toString('hex');
    address = address.slice(address.length - 40, address.length);
    self_account_id = address;
    console.log("self_account_id: ", self_account_id)
    contract_address = fs.readFileSync('contract_address', 'utf-8');
    console.log("contract_address: " + contract_address);
}

function PostCode(data) {
    console.log(data)
    var post_data = querystring.stringify(data);
    var post_options = {
        host: '10.101.20.35',
        port: '8783',
        path: '/transaction',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            if (chunk != "ok") {
                console.log('Response: ' + chunk + ", " + data);
            } else {
                console.log('Response: ' + chunk + ", " + data);
            }
        })
    });

    //console.log("req data: " + post_data);
    post_req.write(post_data);
    post_req.end();
}

function GetValidHexString(uint256_bytes) {
    var str_res = uint256_bytes.toString(16)
    while (str_res.length < 64) {
        str_res = "0" + str_res;
    }

    return str_res;
}

function param_contract(tx_type, gid, to, amount, gas_limit, gas_price, contract_bytes, input, prepay) {

    var gid = GetValidHexString(Secp256k1.uint256(randomBytes(32)));
    var frompk = '04' + self_public_key.x.toString(16) + self_public_key.y.toString(16);
    const MAX_UINT32 = 0xFFFFFFFF;
    var amount_buf = new Buffer(8);
    var big = ~~(amount / MAX_UINT32)
    var low = (amount % MAX_UINT32) - big
    amount_buf.writeUInt32LE(big, 4)
    amount_buf.writeUInt32LE(low, 0)

    var gas_limit_buf = new Buffer(8);
    var big = ~~(gas_limit / MAX_UINT32)
    var low = (gas_limit % MAX_UINT32) - big
    gas_limit_buf.writeUInt32LE(big, 4)
    gas_limit_buf.writeUInt32LE(low, 0)

    var gas_price_buf = new Buffer(8);
    var big = ~~(gas_price / MAX_UINT32)
    var low = (gas_price % MAX_UINT32) - big
    gas_price_buf.writeUInt32LE(big, 4)
    gas_price_buf.writeUInt32LE(low, 0)

    var step_buf = new Buffer(8);
    var big = ~~(tx_type / MAX_UINT32)
    var low = (tx_type % MAX_UINT32) - big
    step_buf.writeUInt32LE(big, 0)
    step_buf.writeUInt32LE(low, 0)

    var prepay_buf = new Buffer(8);
    var big = ~~(prepay / MAX_UINT32)
    var low = (prepay % MAX_UINT32) - big
    prepay_buf.writeUInt32LE(big, 4)
    prepay_buf.writeUInt32LE(low, 0)

    var message_buf = Buffer.concat([Buffer.from(gid, 'hex'), Buffer.from(frompk, 'hex'), Buffer.from(to, 'hex'),
        amount_buf, gas_limit_buf, gas_price_buf, step_buf, Buffer.from(contract_bytes, 'hex'), Buffer.from(input, 'hex'), prepay_buf]);
    var kechash = keccak256(message_buf)

    var digest = Secp256k1.uint256(kechash, 16)
    const sig = Secp256k1.ecsign(self_private_key, digest)
    const sigR = Secp256k1.uint256(sig.r, 16)
    const sigS = Secp256k1.uint256(sig.s, 16)
    const pubX = Secp256k1.uint256(self_public_key.x, 16)
    const pubY = Secp256k1.uint256(self_public_key.y, 16)
    const isValidSig = Secp256k1.ecverify(pubX, pubY, sigR, sigS, digest)
    console.log("digest: " + digest)
    console.log("sigr: " + sigR.toString(16))
    console.log("sigs: " + sigS.toString(16))
    console.log(sig.v)
    if (!isValidSig) {
        console.log('signature transaction failed.')
        return;
    }

    return {
        'gid': gid,
        'pubkey': '04' + self_public_key.x.toString(16) + self_public_key.y.toString(16),
        'to': to,
        'amount': amount,
        'gas_limit': gas_limit,
        'gas_price': gas_price,
        'type': tx_type,
        'shard_id': local_count_shard_id,
        'hash': kechash,
        'attrs_size': 4,
        "bytes_code": contract_bytes,
        "input": input,
        "pepay": prepay,
        'sign_r': sigR.toString(16),
        'sign_s': sigS.toString(16),
        'sign_v': sig.v,
    }
}

function create_tx(to, amount, gas_limit, gas_price, prepay, tx_type) {
    var gid = GetValidHexString(Secp256k1.uint256(randomBytes(32)));
    var frompk = '04' + self_public_key.x.toString(16) + self_public_key.y.toString(16);
    const MAX_UINT32 = 0xFFFFFFFF;
    var amount_buf = new Buffer(8);
    var big = ~~(amount / MAX_UINT32)
    var low = (amount % MAX_UINT32) - big
    amount_buf.writeUInt32LE(big, 4)
    amount_buf.writeUInt32LE(low, 0)

    var gas_limit_buf = new Buffer(8);
    var big = ~~(gas_limit / MAX_UINT32)
    var low = (gas_limit % MAX_UINT32) - big
    gas_limit_buf.writeUInt32LE(big, 4)
    gas_limit_buf.writeUInt32LE(low, 0)

    var gas_price_buf = new Buffer(8);
    var big = ~~(gas_price / MAX_UINT32)
    var low = (gas_price % MAX_UINT32) - big
    gas_price_buf.writeUInt32LE(big, 4)
    gas_price_buf.writeUInt32LE(low, 0)
    var step_buf = new Buffer(8);
    var big = ~~(tx_type / MAX_UINT32)
    var low = (tx_type % MAX_UINT32) - big
    step_buf.writeUInt32LE(big, 0)
    step_buf.writeUInt32LE(low, 0)
    var prepay_buf = new Buffer(8);
    var big = ~~(prepay / MAX_UINT32)
    var low = (prepay % MAX_UINT32) - big
    prepay_buf.writeUInt32LE(big, 4)
    prepay_buf.writeUInt32LE(low, 0)

    var message_buf = Buffer.concat([Buffer.from(gid, 'hex'), Buffer.from(frompk, 'hex'), Buffer.from(to, 'hex'),
        amount_buf, gas_limit_buf, gas_price_buf, step_buf, prepay_buf]);
    var kechash = keccak256(message_buf)
    var digest = Secp256k1.uint256(kechash, 16)
    const sig = Secp256k1.ecsign(self_private_key, digest)
    const sigR = Secp256k1.uint256(sig.r, 16)
    const sigS = Secp256k1.uint256(sig.s, 16)
    const pubX = Secp256k1.uint256(self_public_key.x, 16)
    const pubY = Secp256k1.uint256(self_public_key.y, 16)
    return {
        'gid': gid,
        'pubkey': '04' + self_public_key.x.toString(16) + self_public_key.y.toString(16),
        'to': to,
        'amount': amount,
        'gas_limit': gas_limit,
        'gas_price': gas_price,
        'type': tx_type,
        'shard_id': local_count_shard_id,
        'sign_r': sigR.toString(16),
        'sign_s': sigS.toString(16),
        'sign_v': sig.v,
        'pepay': prepay
    }
}

function new_contract(contract_bytes) {
    var gid = GetValidHexString(Secp256k1.uint256(randomBytes(32)));
    var kechash = keccak256(self_account_id + gid + contract_bytes).toString('hex')
    var self_contract_address = kechash.slice(kechash.length - 40, kechash.length)
    var data = param_contract(
        6,
        gid,
        self_contract_address,
        0,
        100000000,
        1,
        contract_bytes,
        "",
        999999999);
    PostCode(data);

    const opt = { flag: 'w', }
    fs.writeFile('contract_address', self_contract_address, opt, (err) => {
        if (err) {
            console.error(err)
        }
    })
}

function call_contract(input, amount) {
    contract_address = fs.readFileSync('contract_address', 'utf-8');
    console.log("contract_address: " + contract_address);
    var gid = GetValidHexString(Secp256k1.uint256(randomBytes(32)));
    var data = param_contract(
        8,
        gid,
        contract_address,
        amount,
        90000000000,
        1,
        "",
        input,
        0);
    PostCode(data);
}

function do_transaction(to_addr, amount, gas_limit, gas_price) {
    var data = create_tx(to_addr, amount, gas_limit, gas_price, 0, 0);
    console.log(data);
    PostCode(data);
}

function CreatePhr() {
    console.log("test smart contract signature: ");
    var account1 = web3.eth.accounts.privateKeyToAccount('0x20ac5391ad70648f4ac6ee659e7709c0305c91c968c91b45018673ba5d1841e5');
    console.log("account1 :");
    console.log(account1.address);
    var account2 = web3.eth.accounts.privateKeyToAccount('0x748f7eaad8be6841490a134e0518dafdf67714a73d1275f917475abeb504dc05');
    console.log("account2 :");
    console.log(account2.address);
    var account3 = web3.eth.accounts.privateKeyToAccount('0xb546fd36d57b4c9adda29967cf6a1a3e3478f9a4892394e17225cfb6c0d1d1e5');
    console.log("account3 :");
    console.log(account3.address);

    var cons_codes = web3.eth.abi.encodeParameters(['address[]'],
        [[account1.address,
        account2.address,
            account3.address]]);
    console.log("cons_codes: " + cons_codes.substring(2));

    {
        var func = web3.eth.abi.encodeFunctionSignature('AddManager(address[])');
        var funcParam = web3.eth.abi.encodeParameters(['address[]'], [[account1.address,
            account2.address,
                account3.address]]);
        console.log("AddManager func: " + func.substring(2) + funcParam.substring(2));
    }

    {
        var func = web3.eth.abi.encodeFunctionSignature('RemoveManager(address[])');
        var funcParam = web3.eth.abi.encodeParameters(['address[]'], [[account1.address]]);
        console.log("RemoveManager func: " + func.substring(2) + funcParam.substring(2));
    }

    {
        var func = web3.eth.abi.encodeFunctionSignature('Authorization(bytes)');
        var funcParam = web3.eth.abi.encodeParameters(['bytes'], ['0x20ac5391ad70648f4ac6ee659e7709c0305c91c968c91b45018673ba5d1841e5']);
        console.log("Authorization func: " + func.substring(2) + funcParam.substring(2));x
    }
    
    {
        var func = web3.eth.abi.encodeFunctionSignature('GetAuthJson()');
        // var funcParam = web3.eth.abi.encodeParameters(['uint', 'uint'], [0, 100]);
        console.log("GetAuthJson func: " + func.substring(2));

    }
}

function GetConstructorParams(args) {
    if (args.length < 2) {
        return;
    }

    var addrs = [];
    for (var i = 1; i < args.length; ++i) {
        if (args[i].length != 42) {
            return null;
        }

        if (!args[i].startsWith("0x")) {
            return null;
        }

        addrs.push(args[i]);
    }
    
    var cons_codes = web3.eth.abi.encodeParameters(['address[]', 'bytes', 'bytes'], [addrs, '140', '123']);
    console.log("cons_codes: " + cons_codes.substring(2));
    return cons_codes.substring(2);
}

function GetAddManagerParams(args) {
    if (args.length < 2) {
        return;
    }

    var addrs = [];
    for (var i = 1; i < args.length; ++i) {
        if (args[i].length != 42) {
            return null;
        }

        if (!args[i].startsWith("0x")) {
            return null;
        }

        addrs.push(args[i]);
    }
    var func = web3.eth.abi.encodeFunctionSignature('AddManager(address[])');
    var funcParam = web3.eth.abi.encodeParameters(['address[]'], [addrs]);
    console.log("AddManager func: " + func.substring(2) + funcParam.substring(2));
    return func.substring(2) + funcParam.substring(2);
}

function GetRemoveManagerParams(args) {
    if (args.length < 2) {
        return;
    }

    var addrs = [];
    for (var i = 1; i < args.length; ++i) {
        if (args[i].length != 42) {
            return null;
        }

        if (!args[i].startsWith("0x")) {
            return null;
        }

        addrs.push(args[i]);
    }
    
    var func = web3.eth.abi.encodeFunctionSignature('RemoveManager(address[])');
    var funcParam = web3.eth.abi.encodeParameters(['address[]'], [addrs]);
    console.log("RemoveManager func: " + func.substring(2) + funcParam.substring(2));
    return func.substring(2) + funcParam.substring(2);
}

function GetAuthorizationParams(args) {
    if (args.length < 3) {
        return;
    }

    var func = web3.eth.abi.encodeFunctionSignature('Authorization(bytes)');
    var funcParam = web3.eth.abi.encodeParameters(['bytes'], ['0x' + str_to_hex(args[1])]);
    console.log("Authorization func: " + func.substring(2) + funcParam.substring(2));
    return func.substring(2) + funcParam.substring(2);
}

function QueryPostCode(path, data) {
    var post_data = querystring.stringify(data);
    var post_options = {
        host: '82.156.224.174',
        port: '8781',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            var json_res = JSON.parse(chunk)
            console.log('Response: ' + chunk);
        })
    });

    post_req.write(post_data);
    post_req.end();
}

function QueryContract(input) {
    var contract_address = fs.readFileSync('contract_address', 'utf-8');
    var data = {
        "input": input,
        'address': contract_address,
        'from': self_account_id,
    };

    QueryPostCode('/query_contract', data);
}

function Prepayment(prepay) {
    var contract_address = fs.readFileSync('contract_address', 'utf-8');
    var data = create_tx(contract_address, 0, 100000, 1, prepay, 7);
    PostCode(data);
}

function Transfer(amount, account_id) {
    var contract_address = fs.readFileSync('contract_address', 'utf-8');
    var data = create_tx(account_id, amount, 100000, 1, 0, 0);
    PostCode(data);
}

init_private_key();
const args = process.argv.slice(2)

console.log("args type: " + args[0] + ", size: " + args.length);

// 创建链上数据身份
if (args[0] == 0) {
    var cons_cods = GetConstructorParams(args);
    if (cons_cods == null) {
        console.log("创建数据身份失败，输入的初始管理员错误: " + process.argv);
        return;
    }

	var contract_bytes = CONTRACT_CODE;
    new_contract(contract_bytes + cons_cods);
}

// 调用确权预置quota
if (args[0] == 1) {
    Prepayment(100000000000);
}

// 增加数据管理员
if (args[0] == 2) {
    var add_cods = GetAddManagerParams(args);
    if (add_cods == null) {
        console.log("添加管理员失败，输入的初始管理员错误: " + process.argv);
        return;
    }

    call_contract(add_cods, 0);
}

// 删除数据管理员
if (args[0] == 3) {
    var remove_cods = GetRemoveManagerParams(args);
    if (remove_cods == null) {
        console.log("添加管理员失败，输入的初始管理员错误: " + process.argv);
        return;
    }
    
    call_contract(remove_cods, 0);
}

// 确权
if (args[0] == 4) {
    var auth_cods = GetAuthorizationParams(args);
    if (auth_cods == null) {
        console.log("确权失败，输入的确权参数错误: " + process.argv);
        return;
    }
    
    call_contract(auth_cods, 0);
}

// 读取确权列表
if (args[0] == 5) {
    var func = web3.eth.abi.encodeFunctionSignature('GetAuthJson(uint32,uint32)');
    var funcParam = web3.eth.abi.encodeParameters(['uint32', 'uint32'], [1, 10]);
    console.log("GetAuthJson func: " + func.substring(2));
    QueryContract(func.substring(2)+funcParam.substring(2));
}

if (args[0] == 6) {
    do_transaction(args[1], 10000000000000, 100000, 1);
}

if (args[0] == 7) {
    var auth_cods = GetAuthorizationParams(args);
    if (auth_cods == null) {
        console.log("确权失败，输入的确权参数错误: " + process.argv);
        return;
    }
    
    call_contract(auth_cods, 0);
}