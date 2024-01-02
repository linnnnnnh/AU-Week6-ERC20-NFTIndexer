import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    components: {
        Image: {
            baseStyle: {
                boxSize: "50px", // Set the desired box size
                objectFit: "cover", // Adjust how the image should fit within the box
                borderRadius: "full", // Apply a circular border
            },
        },
    },
});

export default theme;
