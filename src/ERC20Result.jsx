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
} from '@chakra-ui/react';
import { Utils } from 'alchemy-sdk';

const ERC20Result = ({ ERC20Results, ERC20DataObjects, error1, isPending1 }) => {

    return (
        <>
            {error1 ? (<Box color="#DEE1E6">{error1}</Box>)
                : isPending1 ? (<Box color="#DEE1E6">Retrieving tokens ...</Box>)
                    : (ERC20Results && ERC20Results.tokenBalances ? (
                        <SimpleGrid w="100%" columns={5} spacingX={10} spacingY={10}>
                            {ERC20Results.tokenBalances.map((e, i) => {
                                return (
                                    <Flex
                                        flexDir={'column'}
                                        color="white"
                                        bg="#323639"
                                        w={'15vw'}
                                        key={e.id}
                                        objectFit={'contain'}
                                        border="1px solid #DEE1E6"
                                        borderRadius="5px"
                                    >
                                        <Image
                                            ml={5}
                                            mb={2}
                                            mt={2}
                                            src={ERC20DataObjects[i]?.logo}
                                            boxSize="50px"
                                        />
                                        <Box ml={5} mt={1}>
                                            <b>Symbol:</b>
                                        </Box>
                                        <Box ml={5}>
                                            ${ERC20DataObjects[i]?.symbol}&nbsp;
                                        </Box>
                                        <Box ml={5} mt={1}>
                                            <b>Balance:</b>&nbsp;
                                        </Box>
                                        <Box ml={5} mb={2}>
                                            {Number(Utils.formatUnits(
                                                e.tokenBalance,
                                                ERC20DataObjects[i]?.decimals
                                            )).toFixed(2)}
                                        </Box>
                                    </Flex>
                                );
                            })}
                        </SimpleGrid>
                    ) : (
                        <Text color="#DEE1E6">Please make a query! This may take a few seconds...</Text>
                    )
                    )}
        </>
    );
}

export default ERC20Result;