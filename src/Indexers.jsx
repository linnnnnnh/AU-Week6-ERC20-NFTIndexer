import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Input,
    SimpleGrid,
    Text,
    ChakraProvider,
    Divider,
} from '@chakra-ui/react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useState, useEffect } from 'react';
import ERC20Result from './ERC20Result';
import NFTResult from './NFTResult';

const Indexers = () => {
    const [userAddress, setUserAddress] = useState('');
    const [walletAddress, setWalletAddress] = useState("");
    const [ERC20Results, setERC20Results] = useState([]);
    const [ERC20HasQueried, setERC20HasQueried] = useState(false);
    const [ERC20DataObjects, setERC20DataObjects] = useState([]);
    const [NFTResults, setNFTResults] = useState([]);
    const [NFTHasQueried, setNFTHasQueried] = useState(false);
    const [NFTDataObjects, setNFTDataObjects] = useState([]);
    const [displayResults, setDisplayResults] = useState('all');
    const [error1, setError1] = useState(null);
    const [error2, setError2] = useState(null);
    const [isPending1, setIsPending1] = useState(false);    
    const [isPending2, setIsPending2] = useState(false);    

    const handleDisplay = (token) => {
        setDisplayResults(token);
    };

    useEffect(() => {
        getCurrentWalletConnected();
        addWalletListener();
    }, [walletAddress]);

    const connectWallet = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
                console.log(accounts[0]);
            } catch (err) {
                console.error(err.message);
            }
        } else {
            console.log("Please install MetaMask");
        }
    };

    const getCurrentWalletConnected = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                } else {
                    console.log("Connect to MetaMask using the Connect button");
                }
            } catch (err) {
                console.error(err.message);
            }
        } else {
            console.log("Please install MetaMask");
        }
    };

    const addWalletListener = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            window.ethereum.on("accountsChanged", (accounts) => {
                setWalletAddress(accounts[0]);
            });
        } else {
            setWalletAddress("");
            console.log("Please install MetaMask");
        }
    };

    const config = {
        apiKey: '3kxYiG3rBAxaU2AIsUebbS1rOoaqE2LW',
        network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);

    async function walletFromENS() {
        if (addr.includes(".eth")) {
            try {
                const addrFromENS = await alchemy.core.resolveName("vitalik.eth");
                const addr = addrFromENS;
                return addr;
            } catch (error) {
                console.error("Error resolving ENS:", error);
            }
        } else {
            return addr;
        }
    }

    async function getERC20Balance(addr) {
        try {
            setIsPending1(true);    
            walletFromENS();
            const data = await alchemy.core.getTokenBalances(addr);

            setERC20Results(data);

            const ERC20DataPromises = [];

            for (let i = 0; i < data.tokenBalances.length; i++) {
                const tokenData = alchemy.core.getTokenMetadata(
                    data.tokenBalances[i].contractAddress
                );
                ERC20DataPromises.push(tokenData);
            }

            setERC20DataObjects(await Promise.all(ERC20DataPromises));
            setERC20HasQueried(true);
            setIsPending1(false);

        } catch (err) {
            setError1('Error in getting ERC20 balances ...');
            setIsPending1(false);
        }
    }

    async function getNFTBalance(addr) {
        try {
            setIsPending2(true);
            walletFromENS();

            const data = await alchemy.nft.getNftsForOwner(addr);
            setNFTResults(data);

            const NFTDataPromises = [];

            for (let i = 0; i < data.ownedNfts.length; i++) {
                const tokenData = alchemy.nft.getNftMetadata(
                    data.ownedNfts[i].contract.address,
                    data.ownedNfts[i].tokenId
                );
                NFTDataPromises.push(tokenData);
            }

            setNFTDataObjects(await Promise.all(NFTDataPromises));
            setNFTHasQueried(true);
            setIsPending2(false);
        } catch (err) {
            setError2('Error getting NFT balances ...');
            setIsPending2(false);
        }
    }

    return (
        <ChakraProvider>
            <Box w="105vw" backgroundColor="#c99c45">
                <Center>
                    <Flex
                        alignItems={'center'}
                        justifyContent="center"
                        flexDirection={'column'}
                    >
                        <Heading
                            mb={1} mt={4}
                            textAlign="center"
                            fontSize={36}
                            color={'white'}
                        >
                            Token
                            <Box as="span" bg="#121212" px={2} >
                                Indexer
                            </Box>
                        </Heading>
                        <Text mb={4} color={'white'}>
                            ERC-20 tokens & NFTs
                        </Text>
                    </Flex>
                </Center>
            </Box>
            <Divider my={0} w="100%" backgroundColor="white" height="4px" borderBottom="none" />
            <Box backgroundColor="#282C2F" height="250px" p={4}>
                <Flex>
                    <Box flex="1" p={4} position="relative" height="250px" >
                        <Heading mt={22} fontSize={25} textAlign="center" color="#DEE1E6">
                            Get all token balances of your wallet
                        </Heading>
                        <Button
                            fontSize={20}
                            position="absolute"
                            top="45%" left="50%"
                            transform="translate(-50%, -50%)"
                            bgColor="#e3bd72"
                            color="#fff"
                            border="1px solid white"
                            fontWeight="bold"
                            _hover={{
                                bgColor: 'gray',
                                borderColor: 'white',
                            }}
                            onClick={connectWallet}
                        >
                            {walletAddress && walletAddress.length > 0 ? (
                                `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                            ) : (
                                "Connect Wallet"
                            )}
                        </Button>
                        {walletAddress && (
                            <Button
                                fontSize={20}
                                p={4}
                                position="absolute"
                                top="70%" left="50%"
                                transform="translate(-50%, -50%)"
                                bgColor="#121212"
                                color="#fff"
                                border="1px solid white"
                                fontWeight="bold"
                                _hover={{
                                    bgColor: 'gray',
                                    borderColor: 'gray',
                                }}
                                onClick={() => {
                                    getERC20Balance(walletAddress);
                                    getNFTBalance(walletAddress);
                                }}
                            >
                                Check my balances
                            </Button>
                        )}
                    </Box>
                    <Box flex="1" p={4} position="relative">
                        <Flex
                            w="100%"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent={'center'}
                        >
                            <Heading mt={22} fontSize={25} textAlign="center" color="#DEE1E6">
                                Get all token balances of this address
                            </Heading>
                            <Input
                                onChange={(e) => setUserAddress(e.target.value)}
                                color="black"
                                w="450px"
                                textAlign="center"
                                p={4}
                                bgColor="#DEE1E6"
                                fontSize={18}
                                mt={6}
                                border="3px solid white"
                                placeholder="Enter your wallet address or ENS name..."
                            />
                            <Button
                                fontSize={20}
                                position="absolute"
                                top="70%" left="50%"
                                transform="translate(-50%, -50%)"
                                bgColor="#121212"
                                color="#fff"
                                border="1px solid white"
                                fontWeight="bold"
                                _hover={{
                                    bgColor: 'gray',
                                    borderColor: 'white',
                                }}
                                onClick={() => {
                                    getERC20Balance(userAddress);
                                    getNFTBalance(userAddress);
                                }}
                            >
                                Check Balances
                            </Button>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
            <Divider my={0} w="100%" backgroundColor="#DEE1E6" height="1px" borderBottom="none" />
            <Box backgroundColor="#282C2F" p={4}>
                <Heading mt={5} mb={10} fontSize={35} textAlign="center" color="#DEE1E6">
                    LIST OF ASSETS
                </Heading>
                <Box w="100vw">
                    <Center mb={2}>
                        <Text color="#DEE1E6" mr={5}>Filter to display :</Text>
                        <Button size="sm" mr={5} border="1px solid gray"
                            onClick={() => handleDisplay("all")}>All Tokens</Button>
                        <Button size="sm" mr={5} border="1px solid gray"
                            onClick={() => handleDisplay("erc20")}>ERC-20</Button>
                        <Button size="sm" mr={5} border="1px solid gray"
                            onClick={() => handleDisplay("nft")}>NFT</Button>
                    </Center>
                    <Center>
                        {displayResults === 'erc20'
                            && ERC20HasQueried
                            && (
                                <Box>
                                    <Heading mt={10} mb={10} fontSize={35} textAlign="left" color="#DEE1E6">
                                        ERC-20
                                    </Heading>
                                    <ERC20Result ERC20Results={ERC20Results} ERC20DataObjects={ERC20DataObjects} error1={error1} isPending1={isPending1}/>
                                </Box>)
                        }
                        {displayResults === 'nft'
                            && NFTHasQueried
                            && (
                                <Box>
                                    <Heading mt={10} mb={10} fontSize={35} textAlign="left" color="#DEE1E6">
                                        ERC-20
                                    </Heading>
                                    <NFTResult NFTResults={NFTResults} NFTDataObjects={NFTDataObjects} error2={error2} isPending2={isPending2} />
                                </Box>)
                        }
                        {displayResults === 'all' && (
                            <Box>
                                <Heading mt={10} mb={10} fontSize={35} textAlign="left" color="#DEE1E6">
                                    ERC-20
                                </Heading>
                                <ERC20Result ERC20Results={ERC20Results} ERC20DataObjects={ERC20DataObjects} error1={error1} isPending1={isPending1}/>
                                <Heading mt={10} mb={10} fontSize={35} textAlign="left" color="#DEE1E6">
                                    NFT
                                </Heading>
                                <NFTResult NFTResults={NFTResults} NFTDataObjects={NFTDataObjects} error2={error2} isPending2={isPending2}/>
                            </Box>)
                        }
                    </Center>
                </Box>
            </Box>
        </ChakraProvider>
    );
}

export default Indexers;