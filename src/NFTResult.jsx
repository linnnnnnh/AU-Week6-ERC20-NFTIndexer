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

const NFTResult = ({ NFTResults, NFTDataObjects, error2, isPending2 }) => {
    return (
        <>
            {error2 ? (<Box color="#DEE1E6">{error2}</Box>)
                : isPending2 ? (<Box color="#DEE1E6">Retrieving tokens ...</Box>)
                    : (NFTResults.ownedNfts && NFTResults.ownedNfts.length > 0 ? (
                        <SimpleGrid w="100%" columns={5} spacingX={10} spacingY={10}>
                            {NFTResults.ownedNfts.map((e, i) => {
                                return (
                                    <Flex
                                        flexDir={'column'}
                                        color="white"
                                        bg="#323639"
                                        w={'10vw'}
                                        key={e.id}
                                        objectFit={'contain'}
                                        border="1px solid white"
                                        borderRadius="5px"
                                    >
                                        <Center mt={2}>
                                            <b>Name :</b>
                                        </Center>
                                        <Center mt={1}>
                                            {NFTDataObjects[i]?.title?.length === 0
                                                ? 'No Name'
                                                : NFTDataObjects[i]?.title}
                                        </Center>
                                        <Image
                                            mt={1} ml={2} mr={2} mb={2}
                                            src={
                                                NFTDataObjects[i]?.rawMetadata?.image ??
                                                'https://via.placeholder.com/200'
                                            }
                                            alt={'Image'}
                                        />
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

export default NFTResult;