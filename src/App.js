
import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';



function App() {
  
  const [walletAdd, setWalletAdd] = useState(null)
  const [errMsg, setErrMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recAddress, setRecAdress] = useState('')
  const [walletBal,setWalletBal]=useState('')

  const [value, setValue] = useState(0);

  const valueOnchangeHandler = (e) => {
    const re = /^(\d+(\.\d{0,2})?|\.?\d{0,2})$/
    if (re.test(e.target.value)) {
      setValue(e.target.value);
    }
  }

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      setLoading(true)
      try {
        // const accounts = await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // })
        // const bal = await provider.getBalance(accounts[0]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

        // MetaMask requires requesting permission to connect users accounts
       const accounts = await provider.send("eth_requestAccounts", []);

        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        const signer = provider.getSigner();
        const bal = await provider.getBalance(accounts[0]);
        setWalletBal(bal)
        accountChangedHandler(accounts)
        setWalletAdd(accounts)
        console.log(accounts,bal, 'acc bal')
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    } else {
      setErrMsg('Install Metamask')
    }
  }

  
  const accountChangedHandler = (newAcc) => {
    setWalletAdd(newAcc)
    getUserBalance(newAcc)
  }
  
  const getUserBalance = () => {

  }

  const sentTransaction = async (address) => {
    if (value > 0) {
      setLoading(true)
      let params = [
        {
          from: walletAdd.toString(),
          to: address,
          value: Number(ethers.utils.parseEther(value)).toString(16),
          // value: 0,
        },
      ];
      let result = await window.ethereum.request({
        method: "eth_sendTransaction",
        params
      })
        .catch((err) => console.log(err))
      console.log(JSON.stringify(result))
      setLoading(false)
    }
    else {
      alert('Please enter valid amount')
    }
  }

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', accountChangedHandler)
  }



  return (
    <>
      <div className="App">
        <h1>Token Transfer App</h1>
        {!!walletAdd && (
          <>
            <p>
              <span style={{ fontWeight: "bold" }}>Your Wallet Address :</span>{" "}
              {walletAdd}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Your Wallet Balance :</span>{" "}
              {ethers.utils.formatEther(walletBal.toString())}
            </p>
            <input
              value={value}
              onChange={valueOnchangeHandler}
              className="inputbox"
              placeholder="enter eth amount"
            />
            <input
              value={recAddress}
              onChange={(e) => setRecAdress(e.target.value)}
              className="inputbox"
              placeholder="enter receiver's address"
            />
          </>
        )}

        {walletAdd && (
          <button
            disabled={loading}
            onClick={() => {
              console.log(value, recAddress, "bhbh");
              sentTransaction(recAddress);
            }}
          >
            transfer eth
          </button>
        )}
        {!walletAdd && (
          <button
            disabled={loading}
            onClick={() => {
              connectWalletHandler();
            }}
          >
            Connect Wallet
          </button>
        )}
        {/* {walletAdd} */}
        {errMsg}
      </div>
    </>
  );
}
 


export default App;
