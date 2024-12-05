package org.zjchain;
import java.math.BigInteger;
import org.web3j.crypto.ECKeyPair;

public class KeyPair extends ECKeyPair {
    public KeyPair(BigInteger privateKey, BigInteger publicKey) {
        super(privateKey, publicKey);
    }
}
