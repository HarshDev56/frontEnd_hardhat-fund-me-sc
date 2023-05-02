import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constance.js"

const connectButton = document.getElementById("connectBtn")
const fundButton = document.getElementById("fundBtn")
const getBalanceButton = document.getElementById("getBalance")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connectWallet
fundButton.onclick = fund
getBalanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

// console.log(ethers);
async function connectWallet() {
    if (typeof window.ethereum != "undefined") {
        // console.log("I see a metamask");
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }

        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please Install MetaMask!"
    }
}

//   fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}`)
    if (typeof window.ethereum != "undefined") {
        // provider / connection to blockchain
        // singer / wallet / someone with some gas
        // contract that we are interacting with
        // ^ ABI & address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listnerForTransactionMine(transactionResponse, provider)
            console.log("Done!!!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listnerForTransactionMine(transactionResponse, provider) {
    console.log(`Mining for ${transactionResponse.hash}....`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionRecipt) => {
            console.log(
                `Completed with ${transactionRecipt.confirmations} confirmations `
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
        getBalanceButton.innerHTML = `Current Balance is ${ethers.utils.formatEther(
            balance
        )} ETH `
    }
}
// withdraw function
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listnerForTransactionMine(transactionResponse,provider)

        } catch (error) {
            console.log(error)
        }
    }
}

